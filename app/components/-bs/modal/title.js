import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  tagName: 'h5',
  classNames: ['modal-title'],
  value: null,
});
