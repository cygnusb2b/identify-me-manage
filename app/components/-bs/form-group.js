import Ember from 'ember';

const { Component, computed } = Ember;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export default Component.extend({
  classNames: ['form-group'],

  identifier: null,

  control: 'input',

  label: null,
  value: null,

  type: 'text',
  helpText: '',
  disabled: false,

  helpIdentifier: computed('identifier', function() {
    return `${this.get('identifier')}-help`;
  }),

  init() {
    this._super(...arguments);
    if (!this.get('identifier')) {
      this.set('identifier', `field-${getRandomInt(1, 10000)}`);
    }
  },
});