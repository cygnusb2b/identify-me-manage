import AttrSupport from 'manage/services/field-manager/attr-support';

/**
 * @typedef Control
 * @type {object}
 * @property {string} key The control key, such as `select` or `input-text`.
 * @property {string} name The control name.
 * @property {AttrSupport} supports Determines the attributes that this control supports.
 * @property {object} defaults The default attribute values to apply to a field when using this control.
 */

/**
 * Form control factory.
 * Creates a new form control property.
 *
 * @param {string} key The control key, such as `select` or `input-text`.
 * @param {string} name The control name.
 * @param {object} [defaultVals] The default attribute values to apply to a field when using the control.
 * @return {Control}
 */
export default function Control(key, name, defaultVals) {
  const { supports, attributes } = AttrSupport(key);

  let defaults = {};
  if (defaultVals && typeof defaultVals === 'object') {
    defaults = Object.keys(defaultVals).filter(attrKey => supports[attrKey]).reduce((accum, attrKey) => {
      accum[attrKey] = defaultVals[attrKey];
      return accum;
    }, {});
  }
  return Object.freeze({ key, name, supports, defaults, attributes });
}
