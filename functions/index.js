const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');
admin.initializeApp(functions.config().firebase);

function getNowTimestamp() {
  return admin.database.ServerValue.TIMESTAMP;
}

function getOwnerReadableUsersRef(uid) {
  return admin.database().ref(`/owner-readable/users/${uid}`);
}

function getOwnerWriteableQueuePath(name) {
  return `/owner-writeable/${name}-queue/{uid}`;
}

function getOrgWriteableQueuePath(name) {
  return `/org-writeable/${name}-queue/{uid}/{oid}`;
}

function getOrgWriteableOwnerQueuePath(name) {
  return `/org-writeable-owner/${name}-queue/{uid}/{oid}`;
}

function filterEmptyValues(object, keys) {
  const newObj = {};
  Object.keys(object).forEach((key) => {
    if (keys.includes(key) && object[key] !== null) {
      newObj[key] = object[key];
    }
  });
  return newObj
}

/**
 * Auth User Create
 */
exports.createUser = functions.auth.user().onCreate((event) => {
  const data = event.data;
  const now = getNowTimestamp();

 const hash = crypto.createHash('md5').update(data.email.toLowerCase()).digest('hex');

  const user = {
    email: data.email,
    displayName: data.displayName || null,
    verificationSent: false,
    photoURL: data.photoURL || `https://www.gravatar.com/avatar/${hash}`,
    createdAt: now,
    updatedAt: now,
  };
  return Promise.resolve()
    .then(() => getOwnerReadableUsersRef(data.uid).update(user))
  ;
});

/**
 * Auth User Delete
 */
exports.deleteUser = functions.auth.user().onDelete((event) => {
  const uid = event.data.uid;
  return getOwnerReadableUsersRef(uid).remove();
});

/**
 * Email Verification Sent Queue
 */
const verificationSentQueueFunc = (event) => {
  const uid = event.params.uid;
  const sent = event.data.val();
  if (!sent) {
    return;
  }
  return Promise.resolve()
    .then(() => getOwnerReadableUsersRef(uid).update({ verificationSent: (new Date()).valueOf() }))
    .then(() => event.data.ref.remove())
    .catch(error => event.data.ref.update({ error }).then(() => Promise.reject(error)))
  ;
};
exports.verificationSentQueueCreate = functions.database.ref(getOwnerWriteableQueuePath('verification-sent')).onCreate(verificationSentQueueFunc);
exports.verificationSentQueueUpdate = functions.database.ref(getOwnerWriteableQueuePath('verification-sent')).onUpdate(verificationSentQueueFunc);

/**
 * Owner Writeable, User Profile Queue
 */
const userProfileQueueFunc = (event) => {
  const uid = event.params.uid;
  const profile = event.data.val();
  if (!profile || typeof profile !== 'object') {
    return;
  }
  const user = {
    firstName: profile.firstName || null,
    lastName: profile.lastName || null,
    photoURL: profile.photoURL || null,
    updatedAt: getNowTimestamp(),
  };

  return Promise.resolve()
    .then(() => getOwnerReadableUsersRef(uid).update(user))
    .then(() => event.data.ref.remove())
    .catch(error => event.data.ref.update({ error }).then(() => Promise.reject(error)))
  ;
};
exports.userProfileQueueCreate = functions.database.ref(getOwnerWriteableQueuePath('user-profile')).onCreate(userProfileQueueFunc);
exports.userProfileQueueUpdate = functions.database.ref(getOwnerWriteableQueuePath('user-profile')).onUpdate(userProfileQueueFunc);

/**
 * Owner Writeable, Login Queue
 */
exports.loginQueue = functions.database.ref(getOwnerWriteableQueuePath('login')).onCreate((event) => {
  const uid = event.params.uid;
  const user = {
    lastLogin: (new Date()).valueOf(),
  };

  return Promise.resolve()
    .then(() => getOwnerReadableUsersRef(uid).update(user))
    .then(() => event.data.ref.remove())
    .then(() => user)
    .catch(error => event.data.ref.update({ error }).then(() => Promise.reject(error)))
  ;
});

/**
 * Org Writeable, Org Update Queue
 */
exports.orgUpdate = functions.database.ref(`${getOrgWriteableOwnerQueuePath('org-update')}/{key}`).onCreate((event) => {
  const oid = event.params.oid;
  const payload = filterEmptyValues(event.data.val(), ['name', 'photoURL']);
  return Promise.resolve()
    .then(() => admin.database().ref(`/organizations/${oid}`).update(payload))
    .then(() => event.data.ref.remove())
    .catch(error => event.data.ref.update({ error }).then(() => Promise.reject(error)))
  ;
});

/**
 * Updates org memberships from org updates
 */
exports.orgUpdateMembers = functions.database.ref(`/organizations/{oid}`).onUpdate((event) => {
  const oid = event.params.oid;
  const payload = filterEmptyValues(event.data.val(), ['name', 'photoURL']);
  const uids = [];

  return Promise.resolve()
    .then(() => admin.database().ref(`org-readable/${oid}/users`).once('value'))
    .then(snap => snap.forEach(child => uids.push(child.key)))
    .then(() => {
      const refs = {};
      uids.forEach((uid) => {
        Object.keys(payload).forEach(key => {
          const path = `/owner-readable/user-organizations/${uid}/organizations/${oid}/${key}`;
          refs[path] = payload[key];
        })
      });
      if (refs.length !== 0) {
        return admin.database().ref().update(refs);
      }
    })
  ;
});

/**
 * Org Writeable, Org API Key Create Queue
 */
exports.orgApiKeyCreate = functions.database.ref(`${getOrgWriteableQueuePath('api-key-create')}/{key}`).onCreate((event) => {
  const now = getNowTimestamp();
  const uid = event.params.uid;
  const oid = event.params.oid;
  const key = event.params.key;
  const kvs = {
    createdAt: now,
    createdBy: uid,
  };

  return Promise.resolve()
    .then(() => admin.database().ref(`api-keys/${key}`).set(oid))
    .then(() => admin.database().ref(`org-readable/${oid}/keys/${key}`).set(kvs))
    .then(() => event.data.ref.remove())
    .catch(error => event.data.ref.update({ error }).then(() => Promise.reject(error)))
  ;
});

/**
 * Org Owner Writeable, Org API Key Invalidate Queue
 */
exports.orgApiKeyInvalidate = functions.database.ref(`${getOrgWriteableOwnerQueuePath('api-key-invalidate')}/{key}`).onCreate((event) => {
  const now = getNowTimestamp();
  const uid = event.params.uid;
  const oid = event.params.oid;
  const key = event.data.val().key;

  return Promise.resolve()
    .then(() => admin.database().ref(`api-keys/${key}`).remove())
    .then(() => admin.database().ref(`org-readable/${oid}/keys/${key}`).remove())
    .then(() => event.data.ref.remove())
    .catch(error => event.data.ref.update({ error }).then(() => Promise.reject(error)))
  ;
});

/**
 * Org Owner Writeable, Org Delete Queue
 */
exports.orgDelete = functions.database.ref(`${getOrgWriteableOwnerQueuePath('org-delete')}/{key}`).onCreate((event) => {
  const oid = event.params.oid;
  const refs = {};

  return Promise.resolve()
    .then(() => admin.database().ref(`org-readable/${oid}/users`).once('value'))
    .then(snap => {
      snap.forEach(child => {
        const path = `/owner-readable/user-organizations/${child.key}/organizations/${oid}`;
        refs[path] = null;
      })
    })
    .then(() => admin.database().ref(`org-readable/${oid}`).remove())
    .then(() => admin.database().ref(`organizations/${oid}`).remove())
    .then(() => admin.database().ref().update(refs))
    .then(() => event.data.adminRef.remove())
    .catch(error => event.data.adminRef.update({ error }).then(() => Promise.reject(error)))
  ;
});

/**
 * Owner Writeable, Org Create Queue
 */
exports.userOrgCreate = functions.database.ref(`${getOwnerWriteableQueuePath('org-create')}/{oid}`).onCreate((event) => {
  const now = getNowTimestamp();
  const uid = event.params.uid;
  const oid = event.params.oid;

  const payload = event.data.val();
  const org = {
    name: payload.name || null,
    photoURL: `https://robohash.org/${oid}?set=set3&bgset=bg2`,
    createdAt: now,
    updatedAt: now,
  };
  return Promise.resolve()
    .then(() => admin.database().ref(`organizations/${oid}`).set(org))
    .then(() => {
      const path = `owner-readable/user-organizations/${uid}/organizations/${oid}`;
      return admin.database().ref(path).set({
        name: org.name,
        photoURL: org.photoURL,
        role: 'Owner',
      });
    })
    .then(() => event.data.ref.remove())
    .catch(error => event.data.ref.update({ error }).then(() => Promise.reject(error)))
  ;
});

/**
 * Owner Writeable, Active Org Queue
 */
exports.ownerWriteableActiveOrgCreate = functions.database.ref(getOwnerWriteableQueuePath('active-org')).onCreate((event) => {
  const uid = event.params.uid;
  const oid = event.data.val();

  const path = `owner-readable/user-organizations/${uid}/activeOrgId`;
  return Promise.resolve()
    .then(() => admin.database().ref(path).set(oid))
    .then(() => event.data.ref.remove())
    .catch(error => event.data.ref.update({ error }).then(() => Promise.reject(error)))
  ;
});

/**
 * Owner Readable, User Org Create
 */
exports.ownerReadableUserOrgCreate = functions.database.ref('owner-readable/user-organizations/{uid}/organizations/{oid}').onCreate((event) => {
  const uid = event.params.uid;
  const oid = event.params.oid;
  const payload = event.data.val();

  const data = {
    role: payload.role || 'Restricted',
  };

  return Promise.resolve()
    .then(() => getOwnerReadableUsersRef(uid).once('value'))
    .then(userSnap => {
      const user = userSnap.val();
      if (typeof user === 'object') {
        data.email = user.email || null;
        data.firstName = user.firstName || null;
        data.lastName = user.lastName || null;
        data.photoURL = user.photoURL || null;
        return admin.database().ref(`org-readable/${oid}/users/${uid}`).set(data);
      }

    })
  ;
});
