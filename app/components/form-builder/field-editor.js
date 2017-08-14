import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  field: {},

  control: computed('field.control.key', function() {
    return this.get('field.control');
  }),
});
