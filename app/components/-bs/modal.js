import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
  backdrop: true,
  fade: true,
  show: false,
  keyboard: true,
  focus: true,
  size: null, // Either `large`, `small`, or `null` ("normal" size)

  onHide() {},
  onHidden() {},

  headerComponent: '-bs/modal/header',
  bodyComponent: '-bs/modal/body',
  footerComponent: '-bs/modal/footer',
});
