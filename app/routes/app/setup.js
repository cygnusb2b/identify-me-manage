import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  actions: {
    transitionToOrg() {
      this.transitionTo('app.organization.index', this.get('orgManager.activeOrg.id'));
    },
    logout() {
      this.get('userManager').signOutCurrentUser();
    }
  },
});
