import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  tagName: 'span',
  attributeBindings: ['style'],
  placement: 'top',
  title: '',
  html: false,
  tooltipTrigger: 'hover focus', // Must use `tooltipTrigger` instead of `trigger`, as trigger appears to be reserved.
  offset: '0 0',
  delay: 100,
  animation: true,
  tooltipContainer: false, // Must use `tooltipContainer` instead of `conainer`, as container appears to be reserved.
  cursor: 'default',

  style: computed('cursor', function() {
   return Ember.String.htmlSafe(`cursor: ${this.get('cursor')};`);
  }),

  didInsertElement() {
    this._super(...arguments);
    let options = {
      tigger: this.get('tooltipTrigger'),
      container: this.get('tooltipContainer'),
    };
    const keys = ['placement', 'title', 'html', 'offset', 'delay', 'animation'];
    keys.forEach(key => {
      options[key] = this.get(key);
    });
    this.$().tooltip(options);
  },

  willDestoryElement() {
    this.$().tooltip('dispose');
  },

});
