import Ember from 'ember';

const { Component, inject: { service } } = Ember;

export default Component.extend({
  isLoading: false,
  error: null,
  fb: service('firebase-tools'),

  organization: null,
  confirmation: '',
  isModalShown: false,

  actions: {
    delete() {
      const uid = this.get('userManager.uid');
      const oid = this.get('organization.id');
      const check = this.get('orgManager.activeOrg.name');
      const userOrgPath = `/owner-readable/user-organizations/${uid}/${oid}`;
      this.set('error', null);
      if (this.get('confirmation') !== check) {
        this.set('error', {message: 'Enter the organization name to confirm.'});
        this.set('confirmation', '');
        return false;
      }
      this.set('isLoading', true);
      this.get('organization').save()
        .then(() => this.get('fb').waitUntilGone(userOrgPath))
        .then(() => window.location.reload())
        .catch((e) => this.set('error', e))
        .finally(() => this.set('isModalShown', false))
        .finally(() => this.set('isLoading', false))
        .finally(() => this.set('confirmation', ''))
      ;
    },
    hideModal() {
      this.get('organization').rollbackAttributes();
      this.set('isModalShown', false);
    },
    showModal() {
      this.get('organization').deleteRecord();
      this.set('isModalShown', true);
    },
  },
});
