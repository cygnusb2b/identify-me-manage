import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  tagName: 'div',
  classNameBindings: ['fluid:container-fluid:container'],
  fluid: false,
});
