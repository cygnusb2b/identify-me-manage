import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  actions: {
    transitionTo(routeName) {
      this.transitionTo(routeName);
    },
    transitionToOrg() {
      this.transitionTo('app.organization.index', this.get('orgManager.activeOrg.id'));
    },
  },
});
