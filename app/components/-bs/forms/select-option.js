import Ember from 'ember';

export default Ember.Component.extend({
  value: null,
  label: null,
  selectValue: null,
  tagName: 'option',
  disabled: false,
  attributeBindings: ['selected', 'value', 'disabled'],

  selected: Ember.computed('selectValue', function() {
    return this.get('value') === this.get('selectValue');
  }),

  didReceiveAttrs() {
    if (!this.get('label')) {
      this.set('label', this.get('value'));
    }
  }
});
