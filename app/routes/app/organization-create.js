import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  model() {
    return this.store.createRecord('user/$uid/actions/create-tenant');
  },
  actions: {
    transitionToOrg(orgId) {
      this.transitionTo('app.organization.index', orgId);
    },
  },
});
