import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  model(params) {
    const { mode, oobCode } = params;
    return this.get('user').processAction(mode, oobCode)
      .then(() => this.transitionTo('app'))
    ;
  },
});
