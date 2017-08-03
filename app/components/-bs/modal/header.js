import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  tagName: 'div',
  classNames: ['modal-header'],
  title: null,
  showClose: true,

  titleComponent: '-bs/modal/title',
  closeComponent: '-bs/utilities/close-icon'
});
