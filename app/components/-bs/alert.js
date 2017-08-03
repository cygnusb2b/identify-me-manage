import Ember from 'ember';

const { Component, computed } = Ember;

const AlertComponent = Component.extend({
  classNames: ['alert'],
  classNameBindings: ['_typeClass', 'dismissible:alert-dismissible', 'dismissible:fade', 'dismissible:show'],
  attributeBindings: ['role'],
  role: 'alert',

  type: 'info', // Either info, success, warning, or danger.
  dismissible: true, // Whether the alert can be dismissed.

  _typeClass: computed('type', function() {
    return `alert-${this.get('type')}`;
  }),

  actions: {
    onClose() {
      this.sendAction('on-close');
    },
  },
});

AlertComponent.reopenClass({
  positionalParams: ['type'],
});

export default AlertComponent;
