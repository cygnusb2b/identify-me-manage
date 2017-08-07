import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  organizations: hasMany('owner-readable/user-organizations/organization', { async: false, inverse: null }),
  activeOrgId: attr('string'),
  photoURL: attr('string'),
});
