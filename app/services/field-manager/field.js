import Ember from 'ember';
import { loadFieldType } from 'manage/services/field-manager/field-types';

const { assign } = Ember;

const proto = {
  name: null,
  label: null,
  helpText: null,
  reusable: false,
  attributes: {},

  init() {
    this.setControlTo(this.type.getDefaultControl().key);
    return this;
  },

  setControlTo(key) {
    this.control = this.type.getControl(key);
    this.attributes = assign({}, this.control.defaults);
  },
};

export default function Field({ key }) {
  const type = loadFieldType(key);
  return assign({}, proto, { key, type }).init();
}
