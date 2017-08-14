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

      this.get('orgManager').createNewOrg(this.get('organization'))
        .then(oid => this.sendAction('onComplete', oid))
        .catch(error => this.set('error', error))
        .finally(() => this.set('isLoading', false))
      ;
    },
  },
});
