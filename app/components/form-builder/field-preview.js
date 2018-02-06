import Ember from 'ember';

const { Component, computed, inject: { service } } = Ember;

export default Component.extend({
  fieldManager: service(),

  tagName: 'fieldset',
  classNames: ['form-group'],
  field: {},
  attributes: {},

  previewComponent: computed('field.control.id', function() {
    return `form-builder/field-preview/${this.get('field.control.id')}`;
  }),
});
