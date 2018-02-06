import Ember from 'ember';

const { Component, isArray, computed, inject: { service }, set, get, isPresent, RSVP: { Promise } } = Ember;

export default Component.extend({
  store: service(),
  field: null,

  choices: computed('field.choices.[]', function() {
    return this.get('field.choices');
  }),

  choicesDisabled: computed('field.isCustom', function() {
    return !this.get('field.isCustom');
  }),

  sortedChoices: computed('choices.@each.sequence', function() {
    return this.get('choices').sortBy('sequence');
  }),

  nextSequence: computed('sortedChoices.lastObject.sequence', function() {
    const sequence = this.get('sortedChoices.lastObject.sequence');
    return typeof sequence === 'undefined' ? 0 : sequence + 1;
  }),

  reorder(choices) {
    choices.forEach((choice, index) => choice.set('sequence', index));
    return this;
  },

  /**
   * Autosaves the choice.
   * @param {Model} choice
   * @return {Promise<void>}
   */
  autosave(choice) {
    return this.execute(choice.save());
  },

  /**
   * Executes a `save` promise by sending common component actions.
   *
   * @param {Promise} promise
   * @return {Promise<void>}
   */
  execute(promise) {
    this.sendAction('on-save-start')
    return promise
      .then(() => this.sendAction('on-save-success'))
      .catch((error) => {
        this.sendAction('on-save-error', error);
        // Rollback choices to original state.
        this.get('choices').forEach(choice => choice.rollbackAttributes());
      })
      .finally(() => this.sendAction('on-save-end'))
    ;
  },

  actions: {
    autosave(choice) {
      this.autosave(choice);
    },
    reorder(ordered) {
      this.reorder(ordered);
      this.execute(Promise.all(this.get('choices').map(choice => choice.save())));
    },
    hide(choice, bit) {
      choice.set('isHidden', bit);
      this.send('autosave', choice);
    },
    saveIfChanged(choice, property) {
      const changed = choice.changedAttributes();
      if (get(changed, property)) {
        this.send('autosave', choice);
      }
    },
    add() {
      const sequence = this.get('nextSequence');
      const choice = this.get('store').createRecord('tenant/$tid/form/field/field-choice', { label: '', sequence });

      this.get('choices').pushObject(choice);
      this.autosave(choice);
    },
    remove(choice) {
      // @todo Add confirmation of delete??
      this.execute(choice.destroyRecord());
    },
    toggle(choice, name) {
      choice.set(name, !choice.get(name));
      this.send('autosave', choice);
    },
  },
});
