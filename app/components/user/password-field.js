import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  label: 'Password',
  placeholder: null,
  type: 'password',
  value: null,
  disabled: false,
  formContext: 'unknown',

  inputId: computed('formContext', function() {
    return `${this.get('formContext')}.user.password`;
  }),

  actions: {
    toggle() {
      const type = this.get('type');
      const newType = (type === 'password') ? 'text' : 'password';
      this.set('type', newType);
    },
  },
});
