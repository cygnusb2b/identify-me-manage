import Ember from 'ember';
import { loadFieldType } from 'manage/services/field-manager/field-types';

const { assign, set } = Ember;

const proto = {
  name: null,
  label: null,
  helpText: null,
  reusable: false,
  attributes: {},

  init() {
    this.setControlTo(this.type.getDefaultControl().key, true);
    return this;
  },

  setControlTo(key, applyDefaults = false) {
    set(this, 'control', this.type.getControl(key));

    if (applyDefaults) {
      const defaults = assign({}, this.control.defaults);
      const attributes = Object.keys(defaults).reduce((accum, attrKey) => {
        const value = defaults[attrKey];
        if (Array.isArray(value)) {
          // Ensure array defaults are copied, otherwise multiple fields will share the same array instance.
          accum[attrKey] = value.slice();
        } else if (value && typeof value === 'object') {
          // Clone child objects. Note, this will not copy grandchildren.
          // As such, assigning a deep object as an attribute value is not supported.
          accum[attrKey] = assign({}, value);
        } else {
          accum[attrKey] = value;
        }
        return accum;
      }, defaults);
      set(this, 'attributes', attributes);
    }
  },
};

export default function Field({ key }) {
  const type = loadFieldType(key);
  return assign({}, proto, { key, type }).init();
}
