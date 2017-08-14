import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  isLoading: false,
  error: null,
  organization: computed.reads('orgManager.activeOrg'),

  isDisabled: computed('isLoading', 'organization.hasDirtyAttributes', function() {
    return this.get('isLoading') || !this.get('organization.hasDirtyAttributes');
  }),

  actions: {
    update() {
      this.set('isLoading', true);
      this.set('error', null);
      this.get('organization').save()
        .catch(e => this.set('error', e))
        .finally(() => this.set('isLoading', false))
      ;
    }
  }
});
