import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  name: attr('string'),
  role: attr('string'),
  photoURL: attr('string'),
});
