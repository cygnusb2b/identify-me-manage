import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  email: attr('string'),
  firstName: attr('string'),
  lastName: attr('string'),
  role: attr('string'),
  photoURL: attr('string'),
});
