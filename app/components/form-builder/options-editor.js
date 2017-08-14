import Ember from 'ember';

const { Component, isArray, computed, set, get } = Ember;

export default Component.extend({
  options: null,

  sortedOptions: computed('options.@each.sequence', function() {
    return this.get('options').sortBy('sequence');
  }),

  nextSequence: computed('sortedOptions.lastObject.sequence', function() {
    const sequence = this.get('sortedOptions.lastObject.sequence');
    return typeof sequence === 'undefined' ? 0 : sequence + 1;
  }),

  init() {
    this._super(...arguments);
    if (!isArray(this.get('options'))) {
      this.set('options', []);
    }
  },

  reorder(options) {
    options.forEach((option, index) => {
      set(option, 'sequence', index);
    });
    return this;
  },

  actions: {
    reorder(ordered) {
      this.reorder(ordered);
    },
    clear() {
      this.get('options').clear();
    },
    hide(option, bit) {
      set(option, 'hidden', Boolean(bit));
    },
    add() {
      const sequence = this.get('nextSequence');
      const option = { sequence, value: null, label: null, hidden: false };
      this.get('options').pushObject(option);
    },
    remove(option) {
      this.get('options').removeObject(option);
      this.reorder(this.get('options'));
    },
    toggle(option, name) {
      set(option, name, !get(option, name));
    },
  },
});
