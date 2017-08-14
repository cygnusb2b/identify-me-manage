import Model from 'ember-data/model';
import Ember from 'ember';
import attr from 'ember-data/attr';
const { inject: { service }, computed, RSVP: { Promise } } = Ember;

export default Model.extend({
  userManager: service(),
  orgManager: service(),
  fb: service('firebase-tools'),

  createdAt: attr('string'),
  deletedAt: attr('string'),
  key: computed.reads('id'),

  save() {
    const uid = this.get('userManager.uid');
    const oid = this.get('orgManager.activeOrgId');
    return Promise.resolve()
      .then(() => this._executeKeyCreate(uid, oid))
      .then(() => this._executeKeyInvalidate(uid, oid))
      .then(() => this)
    ;
  },

  _executeKeyCreate(uid, oid) {
    if (this.get('isNew')) {
      this.set('createdAt', this.get('fb').getTimestamp());
      const writeTo = this.get('fb').setToOrgWriteableQueue.bind(this.get('fb'));
      const payload = Object.assign({}, this.getProperties('key', 'createdAt'));
      return Promise.resolve()
        .then(() => writeTo('push', 'api-key-create', uid, oid, payload))
        .then((snap) => {
          const key = snap.key;
          const path = `org-readable/${oid}/keys/${key}`;
          return this.get('fb').waitUntilExists(path).then(() => this);
        })
      ;
    }
  },

  _executeKeyInvalidate(uid, oid) {
    if (this.get('isDeleted')) {
      const writeTo = this.get('fb').setToOrgWriteableOwnerQueue.bind(this.get('fb'));
      const payload = Object.assign({}, this.getProperties('key', 'deletedAt'));
      return Promise.resolve()
        .then(() => writeTo('push', 'api-key-invalidate', uid, oid, payload))
      ;
    }
  },

});
