import Ember from 'ember';
import Field from 'manage/services/field-manager/field';
import { getFieldTypes } from 'manage/services/field-manager/field-types';

const { Service, computed } = Ember;

export default Service.extend({
  /**
   * Field type definition object.
   *
   * @typedef FieldType
   * @type {object}
   * @property {string} key The type key, e.g. `text` or `choice-single`.
   * @property {string[]} controls The controls that this field type supports.
   * @property {string} title The title/name/label of the field definition.
   * @property {string} description The description of the field.
   * @property {number} sequence The default display order.
   *
   * @type {FieldType[]}
   */
  fieldTypes: computed(function() {
    return getFieldTypes();
  }),

  /**
   * Creates a new field object for the provided type key.
   *
   * @param {string} key The field type key, such as `text` or `choice-single`.
   * @param {boolean} setDefaults Whether to set defaults for name and label.
   * @return {Field} The field object.
   */
  createFieldFor(key, setDefaults = false) {
    const field = Field({ key });
    if (setDefaults) {
      field.label = field.type.title;
      field.name = `${key}-${(new Date()).valueOf()}`;
    }
    return field;
  },
});
