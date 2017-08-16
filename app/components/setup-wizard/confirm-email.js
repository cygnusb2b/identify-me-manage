import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  isLoading: false,
  error: null,
  complete: false,

  actions: {
    resendConfirmation() {
      this.set('isLoading', true);
      this.set('error', null);
      this.set('complete', false);

      this.get('user').sendEmailVerification()
        .then(() => this.set('complete', true))
        .catch(e => this.set('error', e))
        .finally(() => this.set('isLoading', false))
      ;
    },
  },

});
