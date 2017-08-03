import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  completed: false,
  userModel: computed('userManager.currentUser', function() {
    return this.get('userManager.currentUser');
  }),

  isLoading: false,
  error: null,

  handleError(error) {
    this.set('isLoading', false);
    this.set('error', error);
  },

  actions: {
    updateProfile() {

      // @todo This should be more elegant and use validation states on the fields themselves.
      // Ultimately the backend .validate rule for the `updateProfile` queue write should properly format this.
      if (!this.get('userModel.firstName')) {
        this.set('error', new Error('First name is required.'));
        return;
      }
      if (!this.get('userModel.lastName')) {
        this.set('error', new Error('Last name is required.'));
        return;
      }

      this.set('isLoading', true);
      this.set('error', null);

      const profile = {
        firstName: this.get('userModel.firstName'),
        lastName: this.get('userModel.lastName'),
      };

      this.get('userManager').updateProfileData(profile)
        .then(() => this.set('completed', true))
        .catch(error => this.set('error', error))
        .finally(() => this.set('isLoading', false))
      ;
    },
  },
});
