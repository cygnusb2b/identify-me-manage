import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({

  email: null,
  password: null,

  isLoading: false,
  error: null,

  handleError(error) {
    this.set('isLoading', false);
    this.set('error', error);
  },

  actions: {
    signup() {
      this.set('error', null);
      this.set('isLoading', true);

      this.get('userManager').createNewUser(this.get('email'), this.get('password'))
        .then(() => this.sendAction('onComplete'))
        .catch(error => this.set('error', error))
        .finally(() => this.set('isLoading', false))
      ;
    },
  },

});
