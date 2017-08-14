import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  index: 0,
  field: {},
  fieldCount: 0,

  canMoveUp: computed('index', function() {
    return (0 === this.get('index')) ? false : true;
  }),

  canMoveDown: computed('index', 'fieldCount', function() {
    return (this.get('index') === this.get('fieldCount') - 1) ? false : true;
  }),

  canMove: computed('canMoveUp', 'canMoveDown', function() {
    return (this.get('canMoveUp') || this.get('canMoveDown')) ? true : false;
  }),

  actions: {
    edit() {
      this.sendAction('on-edit', this.get('field'));
    },
    moveDown() {
      this.sendAction('on-move-down', this.get('index'));
    },
    moveUp() {
      this.sendAction('on-move-up', this.get('index'));
    },
    remove() {
      this.sendAction('on-remove', this.get('field'));
    },
  }
});
