import Ember from 'ember';

const { Component, computed, inject: { service } } = Ember;

export default Component.extend({
  isLoading: false,
  error: null,
  organization: null,
  store: service(),
  orgManager: service(),

  modifiableFields: computed('orgManager.activeOrg', function() {
    console.warn(this.get('orgManager.activeOrg'));
    return {
      name: this.get('orgManager.activeOrg.name'),
      // photoURL: this.get('organization.photoURL'),
    };
  }),

  actions: {
    update() {
        this.get('store').createRecord('org-writeable-owner/org-update-queue/$uid/$oid', this.get('modifiableFields')).save()
          .then(() => this.set('loading', false))
          .then(() => this.set('error', null))
          .catch(e => this.set('error', e))
        ;
    }
  }
});
