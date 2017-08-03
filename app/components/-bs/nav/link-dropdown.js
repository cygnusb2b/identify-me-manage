import Ember from 'ember';

const { LinkComponent } = Ember;

export default LinkComponent.extend({
  classNames: ['nav-link', 'dropdown-toggle'],
  attributeBindings: ['data-toggle'],
  'data-toggle': 'dropdown',
  eventName: 'preventClick',
  preventClick(event) {
    event.preventDefault();
  },
});
