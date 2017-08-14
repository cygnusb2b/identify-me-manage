import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  classNames: ['container'],
  session: null,

  userModel: computed('userManager.user', function() {
    return this.get('userManager.user');
  }),

  organization: {},

  isLoading: false,
  error: null,

  actions: {
    save() {
      this.set('isLoading', true);
      this.set('error', null);

      this.get('orgManager').createNewOrg(this.get('organization'))
        .then(oid => this.sendAction('onComplete', oid))
        .catch(error => this.set('error', error))
        .finally(() => this.set('isLoading', false))
      ;
    },
  },
});
