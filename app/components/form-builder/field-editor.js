import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  field: {},

  control: computed('field.control.key', function() {
    return this.get('field.control');
  }),

  hasMultipleControls: computed('field.type.controls.length', function() {
    return this.get('field.type.controls.length') > 1;
  }),

  actions: {
    switchControl(key) {
      this.get('field').setControlTo(key);
    },
  },

});
