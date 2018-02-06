import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  createdAt: attr('moment-timestamp'),
  email: attr('string'),
  firstName: attr('string'),
  lastName: attr('string'),
  updatedAt: attr('moment-timestamp'),
  photoURL: attr('string'),
  activeOrgId: attr('string'), // @todo Change this to a belongsTo
});
