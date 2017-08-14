import Ember from 'ember';

const { Component, computed, inject: { service } } = Ember;

export default Component.extend({
  fieldManager: service(),

  fields: [],

  selected: null,

  fieldTypeSort: ['sequence'],
  fieldTypes: computed.sort('fieldManager.fieldTypes', 'fieldTypeSort'),

  hasSelectedField: computed('selected', function() {
    return this.get('selected') ? true : false;
  }),

  init() {
    this._super(...arguments);
    this.get('fields').clear();
  },

  moveField(from, to) {
    const fields = this.get('fields');
    const sorted = fields.slice();
    sorted.splice(to, 0, sorted.splice(from, 1)[0]);
    fields.setObjects(sorted);
  },

  actions: {
    addField(key) {
      const field = this.get('fieldManager').createFieldFor(key, true);
      this.get('fields').pushObject(field);
      this.set('selected', field);
    },
    moveField(index, direction) {
      if (direction === 'up') {
        if (index === 0) {
          return;
        }
        this.moveField(index, index - 1);
      } else {
        if (index === this.get('fields.length') - 1) {
          return;
        }
        this.moveField(index, index + 1)
      }
    },
    removeField(field) {
      this.get('fields').removeObject(field);
    },
    selectField(field) {
      this.set('selected', field);
    },
  }
});
