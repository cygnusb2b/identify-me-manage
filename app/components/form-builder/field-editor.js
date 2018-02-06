import Ember from 'ember';

const { Component, computed, get } = Ember;

export default Component.extend({
  field: {},

  shouldAutosave: true,
  isSaving: false,
  hasSaved: false,
  error: null,

  control: computed('field.control', function() {
    return this.get('field.control');
  }),

  hasMultipleControls: computed('field.type.controls.length', function() {
    return this.get('field.type.controls.length') > 1;
  }),

  actions: {
    autosave() {
      if (this.get('shouldAutosave')) {
        this.send('save');
      }
    },
    save() {
      this.send('setIsSaving', true);
      this.get('field').save()
        .then(() => this.send('setHasSaved', true))
        .catch((error) => this.send('setSavingError', error)) // @todo should this rollback the field?
        .finally(() => this.send('setIsSaving', false))
      ;
    },
    setIsSaving(bit) {
      if (bit) {
        this.send('setHasSaved', false);
        this.send('setSavingError', null);
      }
      this.set('isSaving', bit);
    },
    setHasSaved(bit) {
      this.set('hasSaved', bit);
    },
    setSavingError(error) {
      // @todo Should go into a notification queue.
      this.set('error', error);
    },
    triggerSaveFor(property) {
      const changed = this.get('field').changedAttributes();
      if (get(changed, property)) {
        this.send('autosave');
      }
    },
    switchControl(control) {
      this.set('field.control', control);
      this.send('autosave');
    },
  },

});
