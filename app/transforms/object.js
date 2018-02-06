import Ember from 'ember';
import Transform from 'ember-data/transform';
import moment from 'moment';

const { typeOf } = Ember;

export default Transform.extend({
  deserialize(serialized) {
    if (typeOf(serialized) === 'object') {
      return serialized;
    }
    return {};
  },

  serialize(value) {
    if (typeOf(value) === 'object') {
      return value;
    }
    return null;
  }
});
