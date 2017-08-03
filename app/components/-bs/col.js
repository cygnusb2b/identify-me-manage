import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  tagName: 'div',
  classNameBindings: ['_sizeClassNames'],

  xs: null,
  sm: null,
  md: null,
  lg: null,
  xl: null,

  _sizeClassNames: computed('xs', 'sm', 'md', 'lg', 'xl', function() {
    const keys       = ['xs', 'sm', 'md', 'lg', 'xl'];
    const classNames = [];

    keys.forEach(key => {
      const value = this.get(key);
      key = key === 'xs' ? '' : `${key}-`;

      if (value) {
        classNames.pushObject(`col-${key}${value}`);
      }
    });
    if (!classNames.length) {
      classNames.pushObject('col');
    }
    return classNames.join(' ');
  }),
});
