import Model from 'ember-data/model';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  users: hasMany('org-readable/$oid/users', { async: false, inverse: null }),
});
