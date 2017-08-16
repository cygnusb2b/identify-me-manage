import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  model(params) {
    return this.store.findRecord('organizations', params.id);
  },

  afterModel(resolved) {
    if (resolved && (resolved.get('id') !== this.get('user.oid'))) {
      return this.get('user').setActiveOrgTo(resolved.get('id'));
    }
  },
});
