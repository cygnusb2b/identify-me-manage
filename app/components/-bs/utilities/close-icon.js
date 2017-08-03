import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  tagName: 'button',
  classNames: ['close'],
  attributeBindings: ['label:aria-label', 'dismiss:data-dismiss'],

  label: 'Close',

  click() {
    this.sendAction('on-close');
  },
});
