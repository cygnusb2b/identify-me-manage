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
      
      
      const uid = this.get('userManager.uid');
      const orgManager = this.get('orgManager');

      orgManager.createNewOrg(this.get('account'))
        .then(() => orgManager.setUserOrgsFor(uid))
        .then(() => this.sendAction('on-wizard-complete'))
        .catch(error => this.set('error', error))
        .finally(() => this.set('isLoading', false))
      ;
    },
  },
});
