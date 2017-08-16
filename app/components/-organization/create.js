import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  organization: {},

  isLoading: false,
  error: null,

  actions: {
    save() {
      this.set('isLoading', true);
      this.set('error', null);

      this.get('organization').save()
        .then(oid => this.sendAction('onComplete', oid))
        .catch(error => this.set('error', error))
        .finally(() => this.set('isLoading', false))
      ;
    },
  },
});
