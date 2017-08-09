import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  actions: {
    transitionTo(routeName) {
      this.transitionTo(routeName);
    },
    transitionToOrg() {
      const oid = this.get('orgManager.activeOrg.id');
      if (oid) {
        this.transitionTo('app.organization.index', oid);
      } else {
        this.transitionTo('app.setup');
      }
    },
  },
});
