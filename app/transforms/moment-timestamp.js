import Transform from 'ember-data/transform';
import moment from 'moment';

export default Transform.extend({
  deserialize(serialized) {
    const type = typeof serialized;

    if (type === "string") {
      return moment(serialized);
    } else if (type === "number") {
      return moment(serialized);
    } else if (serialized === null || serialized === undefined) {
      // if the value is null return null
      // if the value is not present in the data return undefined
      return serialized;
    } else {
      return null;
    }
  },

  serialize(date) {
    if (date instanceof moment && !isNaN(date)) {
      return date.valueOf();
    } else {
      return null;
    }
  }
});
