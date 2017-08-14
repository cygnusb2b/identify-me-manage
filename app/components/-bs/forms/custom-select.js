import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'select',
  attributeBindings: ['disabled', 'name', 'multiple', 'readonly'],
  classNames: ['custom-select'],

  disabled: false,

  valuePath: 'value',
  labelPath: 'label',

  name: null,
  value: null,
  options: [],

  onChange() { },

  change(event) {
    let value = event.target.value;
    this.set('value', value);
    const onChange = this.get('onChange');
    if ('function' === typeof onChange) {
      onChange(value);
    }
  },
});
