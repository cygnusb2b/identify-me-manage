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
  activeOrgId: computed('userOrgs.activeOrgId', function() {
    return this.get('userOrgs.activeOrgId');
  }),
  activeOrg: computed('availableOrgs.firstObject', 'activeOrgId', function() {
    const defaultOrg = this.get('availableOrgs.firstObject');
    const activeOrgId = this.get('activeOrgId');
    if (!activeOrgId) {
      return defaultOrg;
    }
    const activeOrg = this.get('availableOrgs').findBy('id', activeOrgId);
    return (activeOrg) ? activeOrg : defaultOrg;
  }),

  canManageOrg: computed('activeOrg.role', function() {
    const role = this.get('activeOrg.role');
    return role === 'Owner';
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
    let newId = null;
    return Promise.resolve()
      .then(() => validate())
      .then(() => writeTo('push', 'org-create', uid, { name }))
      .then((snap) => {
        newId = snap.key;
        const path = `owner-readable/user-organizations/${uid}/organizations/${newId}`;
        return this.get('fb').waitUntilExists(path);
      })
      .then(() => this.setUserOrgsFor(uid))
      .then(() => this.setActiveOrgTo(newId))
      .then(() => newId)
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

  setActiveOrgTo(oid) {
    const uid = this.get('userManager.uid');
    const writeTo = this.get('fb').setToOwnerWriteableQueue.bind(this.get('fb'));
    return Promise.resolve()
      .then(() => writeTo('set', 'active-org', uid, oid))
    ;
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
