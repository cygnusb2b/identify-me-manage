import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  model(params) {
    return this.store.find('tenant/$tid/form', params.form_id);
  },
});
