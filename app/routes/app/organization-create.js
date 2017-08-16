import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  model() {
    return this.store.createRecord('actions/create-organization/$uid');
  },
  actions: {
    transitionToOrg(orgId) {
      this.transitionTo('app.organization.index', orgId);
    },
  },
});
