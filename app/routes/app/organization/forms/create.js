import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  model(params) {
    const model = this.store.createRecord('tenant/$tid/form', { name: 'New Draft Form' });
    return model.save().
      then(() => this.transitionTo('app.organization.forms.edit', model.get('id')))
    ;
  },
});
