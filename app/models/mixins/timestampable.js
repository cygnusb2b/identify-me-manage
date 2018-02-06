import Ember from 'ember';
import attr from 'ember-data/attr';

const { Mixin } = Ember;

export default Mixin.create({
  createdAt: attr('initial-timestamp'),
  updatedAt: attr('current-timestamp'),
});
