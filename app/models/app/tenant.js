import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  name: attr('string'),
  createdAt: attr('moment-timestamp'),
  updatedAt: attr('moment-timestamp'),
  photoURL: attr('string'),
});
