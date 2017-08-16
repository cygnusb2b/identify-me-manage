import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  actions: {
    transitionToOrg() {
      const oid = this.get('user.oid');
      if (oid) {
        this.transitionTo('app.organization.index', oid);
      } else {
        this.transitionTo('app.setup');
      }
    },
  },
});
