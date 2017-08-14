import Model from 'ember-data/model';
import { hasMany } from 'ember-data/relationships';
import Ember from 'ember';
import attr from 'ember-data/attr';
const { inject: { service }, computed, RSVP: { Promise } } = Ember;

export default Model.extend({
  userManager: service(),
  orgManager: service(),
  fb: service('firebase-tools'),

  key: computed.reads('id'),

  users: hasMany('org-readable/$oid/users', { async: false, inverse: null }),
  keys: hasMany('org-readable/$oid/keys', { async: false, inverse: null }),

  save() {
    const uid = this.get('userManager.uid');
    const oid = this.get('id');
    return Promise.resolve()
      .then(() => this._executeDelete(uid, oid))
      .then(() => this)
    ;
  },

  _executeDelete(uid, oid) {
    if (this.get('isDeleted')) {
      const writeTo = this.get('fb').setToOrgOwnerWriteableQueue.bind(this.get('fb'));
      const payload = Object.assign({}, this.getProperties('key'));
      return Promise.resolve()
        .then(() => writeTo('push', 'org-delete', uid, oid, payload))
      ;
    }
  },
});
