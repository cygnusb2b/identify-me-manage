import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  tagName: 'span',
  placement: 'top',
  title: '',
  html: false,
  tooltipTrigger: 'hover focus', // Must use `tooltipTrigger` instead of `trigger`, as trigger appears to be reserved.
  offset: '0 0',
  delay: 0,
  animation: true,
  tooltipContainer: false, // Must use `tooltipContainer` instead of `conainer`, as container appears to be reserved.

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
