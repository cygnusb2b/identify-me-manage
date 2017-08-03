import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  tagName: 'div',
  classNames: ['row'],
  classNameBindings: ['gutters::no-gutters'],
  gutters: true,
});
