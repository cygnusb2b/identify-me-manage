import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

const { computed } = Ember;

export default Model.extend({
  label: attr('string'),
  value: attr('string', { defaultValue: '' }),
  sequence: attr('number', { defaultValue: 0 }),
  isHidden: attr('boolean', { defaultValue: false }),
  isOther: attr('boolean', { defaultValue: false }),
  isNone: attr('boolean', { defaultValue: false }),
});
