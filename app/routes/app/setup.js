import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  actions: {
    transitionTo(routeName) {
      this.transitionTo(routeName);
    },
    logout() {
      this.get('userManager').signOutCurrentUser();
    }
  },
});
