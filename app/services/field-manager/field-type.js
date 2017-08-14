import Ember from 'ember';
import { loadControl } from 'manage/services/field-manager/controls';

const { assign } = Ember;

const proto = {
  sequence: 0,
  getDefaultControl() {
    return this.controls[0];
  },
  getControl(key) {
    const control = this.controls.find(c => c.key === key);
    if (!control) {
      throw new Error(`The control '${key}' is not supported by field type '${this.key}'`)
    }
    return control;
  },
};

export default function FieldType({ key, controlKeys, title, description, sequence }) {
  if (!key) {
    throw new Error('All field type definitions must contain a key');
  }
  let controls = [];
  if (Array.isArray(controlKeys)) {
    controls = controlKeys.map(controlKey => loadControl(controlKey));
  }
  return assign({}, proto, { key, title, description, controls, sequence });
}
