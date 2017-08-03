import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({

  currentUser: null,

  isLoading: false,
  error: null,
  complete: false,

  actions: {
    resendConfirmation() {

      this.set('isLoading', true);
      this.set('error', null);
      this.set('complete', false);

      const user = this.get('currentUser');
      this.get('userManager').sendEmailVerification(user)
        .then(() => this.set('complete', true))
        .catch(e => this.set('error', e))
        .finally(() => this.set('isLoading', false))
      ;
    },
  },

});
