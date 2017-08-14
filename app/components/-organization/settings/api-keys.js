import Ember from 'ember';

const { Component, inject: { service }, computed } = Ember;


export default Component.extend({
  store: service(),
  fb: service('firebase-tools'),

  activeKey: null,
  isLoading: false,
  error: null,

  hasActiveKey: computed.notEmpty('activeKey'),

  actions: {
    createKey() {
      this.set('isLoading', true);
      this.get('store').createRecord('org-readable/$oid/keys').save()
        .catch((e) => this.set('error', e))
        .finally(() => this.set('isLoading', false))
      ;
    },
    invalidate() {
      const key = this.get('activeKey');
      key.set('deletedAt', this.get('fb').getTimestamp());
      key.deleteRecord();

      this.set('isLoading', true);
      key.save()
        .catch((e) => this.set('error', e))
        .finally(() => this.set('activeKey', null))
        .finally(() => this.set('isInvalidateModalShown', false))
        .finally(() => this.set('isLoading', false))
      ;
    },

    setActiveKey(key) {
      this.set('activeKey', key);
    },
  }
});
