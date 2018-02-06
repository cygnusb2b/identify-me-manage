import Ember from 'ember';

import Field from 'manage/models/app/field';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

const { computed } = Ember;

export default Field.extend({
  ownerId: attr('string'),
  scope: attr('string'),
  sequence: attr('number', { defaultValue: 0 }),
  choices: hasMany('tenant/$tid/form/field/field-choice', { inverse: null, async: false }),
  isCustom: computed('scope', function() {
    return !(['app', 'tenant'].includes(this.get('scope')));
  }),
});
