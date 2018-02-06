import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

const { computed, get } = Ember;

export default Model.extend({
  title: attr('string'),
  defaults: attr('object'),
  attributes: hasMany('app/field-control-attribute', { inverse: null, async: true }),
  supports: computed('attributes.[]', function() {
    return this.get('attributes')
      .map(attribute => get(attribute, 'id'))
      .reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {})
    ;
  }),

});
