import Ember from 'ember';

const { Component, inject: { service } } = Ember;

export default Component.extend({
  orgManager: service(),

  account: {},

  isLoading: false,
  error: null,

  actions: {
    save() {

      this.set('isLoading', true);
      this.set('error', null);

      this.get('orgManager').createNewOrg(this.get('account'))
        .then(() => this.sendAction('on-wizard-complete'))
        .catch(error => this.set('error', error))
        .finally(() => this.set('isLoading', false))
      ;
    },
  },
});
