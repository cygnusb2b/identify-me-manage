import Ember from 'ember';

const { Route, get } = Ember;

export default Route.extend({
  beforeModel(transition) {
    if (!this.get('userManager.currentUser')) {
      // No current user found, redirect to welcome page.
      this.transitionTo('app.welcome');
    } else if (!this.get('orgManager.hasOrgs')) {
      // Auth found, but steup is incomplete.
      // Transition to the setup page.
      this.transitionTo('app.setup');
    } else if (get(transition, 'targetName').indexOf('app.organization') !== 0) {
      // Send them to their org.
      this.transitionTo('app.organization.index', this.get('orgManager.activeOrg.id'));
    }
  },
});
