import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  visibleOptions: computed('attributes.options.@each.hidden', function() {
    return this.get('attributes.options').reject(option => option.hidden);
  }),
  sortedOptions: computed('visibleOptions.@each.sequence', function() {
    return this.get('visibleOptions').sortBy('sequence');
  }),
});
