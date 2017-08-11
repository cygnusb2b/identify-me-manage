import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
const { inject: { service }, RSVP: { Promise } } = Ember;

export default Model.extend({
  userManager: service(),
  fb: service('firebase-tools'),

  name: attr('string'),
  role: attr('string'),
  photoURL: attr('string'),

  save() {
    return Promise.resolve()
      .then(() => this._executeOrgUpdate())
      .then(() => this)
    ;
  },

  _executeOrgUpdate() {
    const uid = this.get('userManager.uid');
    const oid = this.get('id');

    const writeTo = this.get('fb').setToOrgOwnerWriteableQueue.bind(this.get('fb'));
    const payload = Object.assign({}, this.getProperties('name', 'photoURL'), { updatedAt: this.get('fb').getTimestamp() });
    return Promise.resolve()
      .then(() => writeTo('push', 'org-update', uid, oid, payload))
    ;
  },

});
