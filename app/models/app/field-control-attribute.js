import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  label: attr('string'),
  togglable: attr('boolean', { defaultValue: false }),
  disabled: attr('boolean', { defaultValue: false }),
});
