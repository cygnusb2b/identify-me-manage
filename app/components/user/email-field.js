import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  label: 'Email Address',
  placeholder: null,
  value: null,
  disabled: false,
  formContext: 'unknown',

  inputId: computed('formContext', function() {
    return `${this.get('formContext')}.user.email`;
  }),
});
