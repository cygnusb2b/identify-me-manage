import Ember from 'ember';

const { Component, computed } = Ember;

export default Component.extend({
  organization: {},

  tagName: 'form',
  fields: [
    {
      key: 'organization.name',
      type: 'text',
      label: 'Organization Name',
      placeholder: null,
      helpText: 'An organization could be a company, a division, or any logical means by which you\'d like to seperate your data.'
    }
  ]

});
