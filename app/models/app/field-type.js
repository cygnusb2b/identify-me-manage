import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';

const { computed } = Ember;

export default Model.extend({
  title: attr('string'),
  description: attr('string'),
  sequence: attr('number'),
  controls: hasMany('app/field-control', { inverse: null, async: true }),
  defaultControl: belongsTo('app/field-control', { inverse: null, async: true }),
  supportsChoices: computed('id', function() {
    return ['choice-single', 'choice-multiple'].includes(this.get('id'));
  }),
});
