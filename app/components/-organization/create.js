import Ember from 'ember';

const { Component, computed, inject: { service } } = Ember;

export default Component.extend({
  classNames: ['container'],
  session: null,

  userModel: computed('userManager.user', function() {
    return this.get('userManager.user');
  }),

  orgManager: service(),

  organization: {},

  isLoading: false,
  error: null,

  actions: {
    save() {
      this.set('isLoading', true);
      this.set('error', null);

      this.get('orgManager').createNewOrg(this.get('organization'))
        .then((r) => this.sendAction('onComplete', r))
        .catch(error => this.set('error', error))
        .finally(() => this.set('isLoading', false))
      ;
    },
  },
});
