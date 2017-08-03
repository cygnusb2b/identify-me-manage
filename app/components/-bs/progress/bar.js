import Ember from 'ember';

const { Component, computed, String: { htmlSafe } } = Ember;

export default Component.extend({
  classNames: ['progress-bar'],
  classNameBindings: ['striped:progress-bar-striped', 'animated:progress-bar-animated'],
  attributeBindings: ['role', 'min:aria-valuemin', 'max:aria-valuemax', 'value:aria-valuenow', 'style'],
  role: 'progressbar',

  min: 0,
  max: 100,
  value: 0,
  showLabel: false,
  striped: true,
  animated: false,

  label: computed('value', function() {
    return this.formatLabel();
  }),

  style: computed('value', function() {
    const value = parseInt(this.get('value'));
    return htmlSafe(`width: ${value}%`);
  }),

  formatLabel() {
    const value = Math.round(this.get('value'));
    return `${value}%`;
  },

});
