import Ember from 'ember';

const { Component, inject: { service } } = Ember;


export default Component.extend({
  isInvalidateModalShown: false,
  activeKey: null,
  isLoading: false,
  error: null,
  store: service(),
  fb: service('firebase-tools'),

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
      this.set('isLoading', true);
      key.save()
        .catch((e) => this.set('error', e))
        .finally(() => this.set('activeKey', null))
        .finally(() => this.set('isInvalidateModalShown', false))
        .finally(() => this.set('isLoading', false))
      ;
    },

    hideInvalidateModal() {
      this.get('activeKey').rollbackAttributes();
      this.set('activeKey', null);
      this.set('isInvalidateModalShown', false);
    },
    showInvalidateModal(key) {
      this.set('activeKey', key);
      this.set('activeKey.deletedAt', this.get('fb').getTimestamp());
      this.get('activeKey').deleteRecord();
      this.set('isInvalidateModalShown', true);
    }
  }
});
