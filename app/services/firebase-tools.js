import Ember from 'ember';
import * as PERMS from 'manage/constants/permission-paths';

const { Service, inject: { service }, computed, RSVP: { Promise } } = Ember;

/**
 * 
 * @param {firebase.database.Database} db The firebase database instance.
 * @param {string} cmd The database write command to execute, e.g. `set` or `update`.
 * @param {string} path The database path to write to.
 * @param {*} value The value to write to the database.
 * @return {firebase.Promise}
 */
function dbWrite(db, cmd, path, value) {
  return db.ref(path)[cmd](value);
}

function createQueueName(name) {
  return `${name}-queue`;
}

/**
 * @param {firebase.database.Database} db The firebase database instance.
 * @param {string} cmd The database write command to execute, e.g. `set` or `update`.
 * @param {string} name 
 * @param {string} uid 
 * @param {string} oid 
 * @param {*} value 
 */
function writeToOrgOwnerQueue(db, cmd, permission, name, uid, oid, value) {
  const path = `${permission}/${createQueueName(name)}/${uid}/${oid}`;
  return dbWrite(db, cmd, path, value);
}

/**
 * 
 * @param {firebase.database.Database} db The firebase database instance.
 * @param {string} cmd The database write command to execute, e.g. `set` or `update`.
 * @param {string} name 
 * @param {string} uid 
 * @param {*} value 
 */
function writeToUserQueue(db, cmd, permission, name, uid, value) {
  const path = `${permission}/${createQueueName(name)}/${uid}`;
  return dbWrite(db, cmd, path, value);
}

export default Service.extend({
  firebaseApp: service(),

  auth: computed('firebaseApp', function() {
    return this.get('firebaseApp').auth();
  }),

  database: computed('firebaseApp', function() {
    return this.get('firebaseApp').database();
  }),

  getFirebase() {
    return this.get('firebaseApp');
  },

  foo() {
    return this.get('database');
  },

  /**
   * Writes a value to a `org-owner-writeable` queue.
   * 
   * @param {string} cmd The database write command to execute, e.g. `set` or `update`.
   * @param {string} name The name of the queue.
   * @param {string} uid The user identifier of the active user.
   * @param {string} oid The organization identifier.
   * @param {*} value The value to write to the queue.
   */
  setToOrgOwnerWriteableQueue(cmd, name, uid, oid, value) {
    const db = this.get('database');
    return writeToOrgOwnerQueue(db, cmd, PERMS.ORG_OWNER_WRITEABLE, name, uid, oid, value);
  },

  /**
   * Writes a value to a `user-writeable` queue.
   * 
   * @param {string} cmd The database write command to execute, e.g. `set` or `update`.
   * @param {string} name The name of the queue.
   * @param {string} uid The user identifier of the active user.
   * @param {*} value The value to write to the queue.
   */
  setToOwnerWriteableQueue(cmd, name, uid, value) {
    const db = this.get('database');
    return writeToUserQueue(db, cmd, PERMS.OWNER_WRITEABLE, name, uid, value);
  },

  /**
   * Creates a `Promise` that will be resolved once the provided path's value exists.
   * If the value does not exist yet, the promise will not be resolved until it does.
   * If the value already exists, the promise will be resolved immediately.
   * The listener will be immediately detached (via `.off()`) once the value is retrieved.
   * The promise will be rejected if the listener attachment fails (e.g. no permission to read).
   * 
   * @param {string} path The path to wait on.
   * @return {Promise<*>} A promise containing the path's value.
   */
  waitUntilExists(path) {
    const ref = this.get('database').ref(path);
    return new Promise((resolve, reject) => {
      const listener = ref.on('value', (snap) => {
        const value = snap.val();
        if (value !== null) {
          ref.off('value', listener);
          resolve(value);
        }
      }, reject);
    });
  },
});
