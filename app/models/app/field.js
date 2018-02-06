import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

const { computed } = Ember;

export default Model.extend({
  // @todo Is an embedded object of many different options. Can this get defined better?
  attributes: attr('object'),
  choices: hasMany('app/field/field-choice', { inverse: null, async: false }),
  control: belongsTo('app/field-control', { inverse: null, async: true }),
  helpText: attr('string'),
  label: attr('string'),
  target: attr('string', { defaultValue: 'identity' }),
  type: belongsTo('app/field-type', { inverse: null, async: true }),

  supportsChoices: computed('type.supportsChoices', function() {
    return this.get('type.supportsChoices');
  }),

  visibleChoices: computed('sortedChoices.@each.isHidden', function() {
    return this.get('sortedChoices').reject(choice => choice.get('isHidden'));
  }),
  sortedChoices: computed('choices.@each.sequence', function() {
    return this.get('choices').sortBy('sequence');
  }),

});
