const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');
admin.initializeApp(functions.config().firebase);

/**
 * Gets the current server value timestamp "identifier."
 *
 * @return {admin.database.ServerValue.TIMESTAMP}
 */
function getNowTimestamp() {
  return admin.database.ServerValue.TIMESTAMP;
}

/**
 * Returns a Promise containing all tenant IDs that are currently assigned
 * to the requested user id.
 *
 * @param {string} uid The user id.
 * @return {Promise<String[]>}
 */
function findTenantIdsForUser(uid) {
  const tids = [];
  return Promise.resolve()
    .then(() => admin.database().ref(`/user/${uid}/tenants`).once('value'))
    .then((snap) => {
      snap.forEach((child) => {
        // Must not return a truthy value from the `forEach`, otherwise further enumeration/looping will be canceled.
        // @see {@link https://firebase.google.com/docs/reference/functions/functions.database.DeltaSnapshot#forEach}
        tids.push(child.key);
      });
      return tids;
    })
  ;
}

/**
 * Returns a Promise containing all users IDs that are currently assigned
 * to the requested tenant id.
 *
 * @param {string} tid The tenant id.
 * @return {Promise<String[]>}
 */
function findAllUserIdsForTenant(tid) {
  const uids = [];
  return Promise.resolve()
    .then(() => admin.database().ref(`/tenant/${tid}/users`).once('value'))
    .then((snap) => {
      snap.forEach((child) => {
        // Must not return a truthy value from the `forEach`, otherwise further enumeration/looping will be canceled.
        // @see {@link https://firebase.google.com/docs/reference/functions/functions.database.DeltaSnapshot#forEach}
        uids.push(child.key);
      });
      return uids;
    })
  ;
}

/**
 * Auth User Create
 */
exports.onAuthUserCreate = functions.auth.user().onCreate((event) => {
  const data = event.data;
  const now = getNowTimestamp();

 const hash = crypto.createHash('md5').update(data.email.toLowerCase()).digest('hex');

  const user = {
    email: data.email,
    displayName: data.displayName || null,
    // verificationSent: false,
    photoURL: data.photoURL || `https://www.gravatar.com/avatar/${hash}`,
    createdAt: now,
    updatedAt: now,
    // lastLogin: false,
    // loginCount: 0,
  };
  return Promise.resolve()
    .then(() => admin.database().ref(`/app/users/${data.uid}`).update(user))
  ;
});

/**
 * Auth User Delete
 */
exports.onAuthUserDelete = functions.auth.user().onDelete((event) => {
  const uid = event.data.uid;
  return admin.database().ref(`/app/users/${uid}`).remove();
});

/**
 * Action: User, Create New Tenant
 */
exports.userActionCreateTenant = functions.database.ref('/user/{uid}/actions/create-tenant/{tid}').onCreate((event) => {
  const now = getNowTimestamp();
  const uid = event.params.uid;
  const tid = event.params.tid;

  const payload = event.data.val();
  const tenant = {
    name: payload.name,
    photoURL: `https://robohash.org/${tid}?set=set3&bgset=bg2`,
    createdAt: now,
    updatedAt: now,
  };
  return Promise.resolve()
    .then(() => admin.database().ref(`/app/tenants/${tid}`).set(tenant)) // Create the tenant.
    .then(() => admin.database().ref(`/app/users/${uid}`).once('value')) // Retrieve the current user.
    .then((snap) => {
      const user = snap.val();
      const path = `/tenant/${tid}/users/${uid}`;
      // Set the current user (who executed the creation) as the owner of the organization.
      return admin.database().ref(path).set({
        email: user.email || null,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        photoURL: user.photoURL || null,
        role: 'Owner',
      });
    })
    .then(() => event.data.ref.remove()) // Remove the action node.
    .catch(error => event.data.ref.update({ error }).then(() => Promise.reject(error)))
  ;
});

/**
 * Listener: On Tenant User Create
 */
exports.onTenantUserCreate = functions.database.ref('/tenant/{tid}/users/{uid}').onCreate((event) => {
  const uid = event.params.uid;
  const tid = event.params.tid;

  const user = event.data.val();

  return Promise.resolve()
    .then(() => admin.database().ref(`/app/tenants/${tid}`).once('value')) // Retrieve the tenant.
    .then((snap) => {
      const tenant = snap.val();
      const path = `/user/${uid}/tenants/${tid}`;
      // Now that the user is a member of the tenant, set the tenant to the user's list of tenants.
      return admin.database().ref(path).set({
        name: tenant.name,
        photoURL: tenant.photoURL,
        role: user.role || 'Restricted',
      });
    });
  ;
});

/**
 * Listener: On App Tenant Update
 */
exports.onAppTenantUpdate = functions.database.ref(`/app/tenants/{tid}`).onUpdate((event) => {
  const tid = event.params.tid;
  const payload = event.data.val();

  return Promise.resolve()
    .then(() => findAllUserIdsForTenant(tid))
    .then((uids) => {
      const refs = {};
      uids.forEach((uid) => {
        ['name', 'photoURL'].forEach(key => {
          // Only send the update if the data has actually changed.
          if (event.data.child(key).changed()) {
            const path = `/user/${uid}/tenants/${tid}/${key}`;
            refs[path] = payload[key];
          }
        });
      });
      if (refs.length !== 0) {
        return admin.database().ref().update(refs);
      }
    })
  ;
});

/**
 * Listener: On App User Update
 */
exports.onAppUserUpdate = functions.database.ref(`/app/users/{uid}`).onUpdate((event) => {
  const uid = event.params.uid;
  const payload = event.data.val();

  return Promise.resolve()
    // Find all tenants currently assigned to this user
    .then(() => findTenantIdsForUser(uid))
    .then((tids) => {
      const refs = {};
      tids.forEach((tid) => {
        ['firstName', 'lastName', 'photoURL', 'email'].forEach(key => {
          // Only send the update if the data has actually changed.
          if (event.data.child(key).changed()) {
            const path = `/tenant/${tid}/users/${uid}/${key}`;
            refs[path] = payload[key];
          }
        });
      });
      if (refs.length !== 0) {
        return admin.database().ref().update(refs);
      }
    })
  ;
});
