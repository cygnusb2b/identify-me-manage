import Ember from 'ember';

const { Component, inject: { service } } = Ember;

export default Component.extend({
  store: service(),

  isLoading: false,
  error: null,

  init() {
    this._super(...arguments);
    this.set('organization', this.get('store').createRecord('actions/create-organization/$uid'));
  },

  actions: {
    save() {
      this.set('isLoading', true);
      this.set('error', null);

      this.get('organization').save()
        .then(() => this.get('user').refreshOrganizations())
        .then(() => this.sendAction('on-wizard-complete'))
        .catch(error => this.set('error', error))
        .finally(() => this.set('isLoading', false))
      ;
    },
  },
});
