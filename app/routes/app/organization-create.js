import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  actions: {
    transitionToOrg(orgId) {
      this.transitionTo('app.organization.index', orgId);
    },
  },
});
