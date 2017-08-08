import DS from 'ember-data';
import { pluralize } from 'ember-inflector';

export default DS.Store.extend({
  modelFor(modelName) {
    try {
      return this._super(...arguments);
    } catch (e) {
      return this._super(pluralize(modelName));
    }
  },
});
