import Ember from 'ember';

const { Component, computed, inject: { service }, get } = Ember;

function compare(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function nativeSort(toSort, keys) {
  return toSort.toArray().sort((a, b) => {
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      let propA = get(a, key), propB = get(b, key);
      let value = compare(propA, propB);
      if (value) return value;
    }
    return 0;
  });
}

export default Component.extend({
  store: service(),
  fieldManager: service(),

  form: null,
  selectedField: null,

  fields: computed('form.fields.[]', function() {
    return this.get('form.fields');
  }),

  /**
   * Returns the active fields sorted by sequence, then id.
   * Note: Must use the native array `sort` (instead of Ember's) due to
   * Ember following different search order rules.
   */
  fieldsSorted: computed('fields.[]', 'fields.@each.sequence', function() {
    return nativeSort(this.get('fields'), ['sequence', 'id']);
  }),

  nextSequence: computed('fieldsSorted.lastObject.sequence', function() {
    const sequence = this.get('fieldsSorted.lastObject.sequence');
    return typeof sequence === 'undefined' ? 0 : sequence + 1;
  }),

   /**
   * Returns the field types sorted by sequence, then id.
   * Note: Must use the native array `sort` (instead of Ember's) due to
   * Ember following different search order rules.
   */
  fieldTypes: computed('fieldManager.fieldTypes.[]', 'fieldManager.fieldTypes.@each.sequence', function() {
    return nativeSort(this.get('fieldManager.fieldTypes'), ['sequence', 'id']);
  }),

  currentOwnerFieldIds: computed('fields.[]', function() {
    return this.get('fields').map(field => get(field, 'id'));
  }),

  fieldsGlobal: computed('fieldManager.fieldsGlobal.[]', 'currentOwnerFieldIds', function() {
    const ids = this.get('currentOwnerFieldIds');
    return this.get('fieldManager.fieldsGlobal').reject(global => ids.includes(get(global, 'id')));
  }),

  hasSelectedField: computed('selectedField', function() {
    return this.get('selectedField') ? true : false;
  }),

  moveField(from, to) {
    const fields = this.get('fieldsSorted');
    const sorted = fields.slice();
    sorted.splice(to, 0, sorted.splice(from, 1)[0]);
    this.send('reorderFields', sorted);
  },

  actions: {
    createField(type, autosave = true) {
      this.get('form').createField(type, this.get('nextSequence'), autosave)
        .then(field => this.send('selectField', field))
      ;
    },
    assignField(scope, field, autosave = true) {
      this.get('form').assignField(scope, field, this.get('nextSequence'), autosave)
        .then(field => this.send('selectField', field))
      ;
    },
    applyFieldValues() {
      const field = this.get('selectedField');
      // @todo Need error handling here.
      // @todo This will not update the updated date of the form
      // @todo Does the field editor actually need to do this??!?! So we can autosave as field props change?
      field.save().then(() => this.send('selectField', null));
    },
    removeField(field) {
      this.get('form').destroyField(field);
    },
    save() {
      this.get('form').save();
    },
    selectField(field) {
      this.set('selectedField', field);
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
    reorderFields(ordered) {
      ordered.forEach((field, index) => field.set('sequence', index));
      this.get('form').save();
    },
  }
});
