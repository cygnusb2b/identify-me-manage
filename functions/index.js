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
 * Returns a Promise containing all organization IDs that are currently assigned
 * to the requested user id.
 *
 * @param {string} uid The user id.
 * @return {Promise<String[]>}
 */
function findAllOrgIdsForUser(uid) {
  const oids = [];
  return Promise.resolve()
    .then(() => admin.database().ref(`/models/user-organizations/${uid}`).once('value'))
    .then((snap) => {
      snap.forEach((child) => {
        // Must not return a truthy value from the `forEach`, otherwise further enumeration/looping will be canceled.
        // @see {@link https://firebase.google.com/docs/reference/functions/functions.database.DeltaSnapshot#forEach}
        oids.push(child.key);
      });
      return oids;
    })
  ;
}

/**
 * Returns a Promise containing all users IDs that are currently assigned
 * to the requested organization id.
 *
 * @param {string} oid The organization id.
 * @return {Promise<String[]>}
 */
function findAllUserIdsForOrg(oid) {
  const uids = [];
  return Promise.resolve()
    .then(() => admin.database().ref(`/models/organization-users/${oid}`).once('value'))
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
    .then(() => admin.database().ref(`/models/users/${data.uid}`).update(user))
  ;
});

/**
 * Auth User Delete
 */
exports.onAuthUserDelete = functions.auth.user().onDelete((event) => {
  const uid = event.data.uid;
  return admin.database().ref(`/models/users/${uid}`).remove();
});

/**
 * Action: Create New Organization
 */
exports.actionCreateOrganization = functions.database.ref('/actions/create-organization/{uid}/{oid}').onCreate((event) => {
  const now = getNowTimestamp();
  const uid = event.params.uid;
  const oid = event.params.oid;

  const payload = event.data.val();
  const org = {
    name: payload.name,
    photoURL: `https://robohash.org/${oid}?set=set3&bgset=bg2`,
    createdAt: now,
    updatedAt: now,
  };
  return Promise.resolve()
    .then(() => admin.database().ref(`/models/organizations/${oid}`).set(org)) // Create the org.
    .then(() => admin.database().ref(`/models/users/${uid}`).once('value')) // Retrieve the current user.
    .then((snap) => {
      const user = snap.val();
      const path = `/models/organization-users/${oid}/${uid}`;
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
 * Listener: On Organization User Create
 */
exports.onOrganizationUsersCreate = functions.database.ref('/models/organization-users/{oid}/{uid}').onCreate((event) => {
  const uid = event.params.uid;
  const oid = event.params.oid;

  const user = event.data.val();

  return Promise.resolve()
    .then(() => admin.database().ref(`/models/organizations/${oid}`).once('value')) // Retrieve the org.
    .then((snap) => {
      const org = snap.val();
      const path = `/models/user-organizations/${uid}/${oid}`;
      // Now that the user is a member of the org, set the organization to the user's list of orgs.
      return admin.database().ref(path).set({
        name: org.name,
        photoURL: org.photoURL,
        role: user.role || 'Restricted',
      });
    });
  ;
});

/**
 * Listener: On Organization Update
 */
exports.onOrganizationUpdate = functions.database.ref(`/models/organizations/{oid}`).onUpdate((event) => {
  const oid = event.params.oid;
  const payload = event.data.val();

  // @todo Update updatedAt. Be careful not to cause an infinite loop!

  return Promise.resolve()
    .then(() => findAllUserIdsForOrg(oid))
    .then((uids) => {
      const refs = {};
      uids.forEach((uid) => {
        ['name', 'photoURL'].forEach(key => {
          // Only send the update if the data has actually changed.
          if (event.data.child(key).changed()) {
            const path = `/models/user-organizations/${uid}/${oid}/${key}`;
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
 * Listener: On User Update
 */
exports.onUserUpdate = functions.database.ref(`/models/users/{uid}`).onUpdate((event) => {
  const uid = event.params.uid;
  const payload = event.data.val();

  // @todo Update updatedAt. Be careful not to cause an infinite loop!

  return Promise.resolve()
    // Find all organizations currently assigned to this user
    .then(() => findAllOrgIdsForUser(uid))
    .then((oids) => {
      const refs = {};
      oids.forEach((oid) => {
        ['firstName', 'lastName', 'photoURL', 'email'].forEach(key => {
          // Only send the update if the data has actually changed.
          if (event.data.child(key).changed()) {
            const path = `/models/organization-users/${oid}/${uid}/${key}`;
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
