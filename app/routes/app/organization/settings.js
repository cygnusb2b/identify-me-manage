import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  model() {
    return this.store.findRecord('org-readable', this.modelFor('app.organization').get('id'));
  },
});
