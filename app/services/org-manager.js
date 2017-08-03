import Ember from 'ember';

const { Service, inject: { service }, RSVP: { Promise }, computed } = Ember;

export default Service.extend({
  fb: service('firebase-tools'),
  store: service(),
  userManager: service(),

  userOrgs: null,
  
  availableOrgs: computed('userOrgs.organizations.[]', function() {
    return this.get('userOrgs.organizations');
  }),
  hasOrgs: computed('availableOrgs.length', function() {
    return this.get('availableOrgs.length') ? true : false;
  }),
  activeOrg: computed('availableOrgs.firstObject', 'userOrgs.activeOrg', function() {
    return this.get('availableOrgs.firstObject');
  }),

  createNewOrg({ name }) {
    const uid = this.get('userManager.uid');
    const validate = () => {
      if (!uid) {
        throw new Error('No user is currently logged in');
      }
      // @todo This should be more elegant and update the fields missing and be done by FB's .validate handler.
      if (!name) {
        throw new Error('You must provide a name for the organization.');
      }
    }
    const writeTo = this.get('fb').setToOwnerWriteableQueue.bind(this.get('fb'));
    return Promise.resolve()
      .then(() => validate())
      .then(() => writeTo('push', 'org-create', uid, { name }))
      .then((snap) => {
        const oid = snap.key;
        const path = `owner-readable/user-organizations/${uid}/organizations/${oid}`;
        return this.get('fb').waitUntilExists(path);
      })
      .then(() => this.setUserOrgsFor(uid))
    ;
  },

  retrieveUserOrgsFor(uid) {
    return this.get('store').findRecord('owner-readable/user-organizations', uid).catch((error) => {
      if (error.message.indexOf('no record was found') !== -1) {
        // No orgs found for the user.
        return null;
      } else {
        throw error;
      }
    })
  },

  setUserOrgsFor(uid) {
    return Promise.resolve()
      .then(() => this.retrieveUserOrgsFor(uid))
      .then(model => {
        this.set('userOrgs', model)
        return model;
      })
    ;
  },

});
