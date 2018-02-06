import Ember from 'ember';
import Field from 'manage/services/field-manager/field';

const { Service, computed, inject: { service } } = Ember;

export default Service.extend({
  store: service(),

  fieldTypes: computed(function() {
    return this.get('store').findAll('app/field-type');
  }),

  fieldsGlobal: computed(function() {
    return this.get('store').findAll('app/field');
  }),

  fieldsTenant: computed(function() {
    return this.get('store').findAll('tenant/$tid/field');
  }),
});
