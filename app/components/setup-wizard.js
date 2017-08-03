import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  classNames: ['container'],
  session: null,

  userModel: computed('userManager.user', function() {
    return this.get('userManager.user');
  }),
});
