import Ember from 'ember';

const { Component, computed, inject: { service } } = Ember;

export default Component.extend({
  orgManager: service(),
  organization: computed.reads('orgManager.activeOrg'),
});
