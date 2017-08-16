import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  completed: false,
  isLoading: false,
  error: null,

  actions: {
    updateProfile() {
      // @todo This should be more elegant and use validation states on the fields themselves.
      if (!this.get('user.model.firstName')) {
        this.set('error', new Error('First name is required.'));
        return;
      }
      if (!this.get('user.model.lastName')) {
        this.set('error', new Error('Last name is required.'));
        return;
      }

      this.set('isLoading', true);
      this.set('error', null);
      this.get('user.model').save()
        .then(() => this.set('completed', true))
        .catch(error => this.set('error', error))
        .finally(() => this.set('isLoading', false))
      ;
    },
  },
});
