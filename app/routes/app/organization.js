import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  model(params) {
    return this.store.findRecord('owner-readable/user-organizations/organization', params.id);
  },

  afterModel(resolved) {
    if (resolved && (resolved.get('id') !== this.get('orgManager.activeOrgId'))) {
      this.get('orgManager').setActiveOrgTo(resolved.get('id'));
    }
  },
});
