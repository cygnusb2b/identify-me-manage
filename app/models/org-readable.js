import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  users: hasMany('org-readable/$oid/users', { async: false, inverse: null }),
});
