import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  model(params) {
    return this.store.findRecord('app/tenant', params.id);
  },

  afterModel(resolved) {
    if (resolved && (resolved.get('id') !== this.get('user.tid'))) {
      // @todo This should change to passing the entire model, once the user's active org is a relationship.
      return this.get('user').setActiveOrgTo(resolved.get('id'));
    }
  },
});
