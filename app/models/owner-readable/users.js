import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  createdAt: attr('date'),
  email: attr('string'),
  lastLogin: attr('date'),
  firstName: attr('string'),
  lastName: attr('string'),
  updatedAt: attr('date'),
});
