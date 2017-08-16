import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  email: null,
  password: null,

  error: null,
  isLoading: false,

  actions: {
    authenticate() {

      this.set('isLoading', true);
      this.set('error', null);

      this.get('user')
        .signIn(this.get('email'), this.get('password'))
        .then(() => this.sendAction('onComplete'))
        .catch(e => this.set('error', e))
        .finally(() => this.set('isLoading', false))
      ;
    },
  },
});
