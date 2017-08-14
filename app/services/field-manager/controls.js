import Control from 'manage/services/field-manager/control';

/**
 * @type {Control[]}
 */
const controls = [
  Control('input-checkbox', 'Checkboxes', { options: [] }),
  Control('input-email', 'Email Input'),
  Control('input-number', 'Number Input'),
  Control('input-radio', 'Radio Buttons', { options: [] }),
  Control('input-text', 'Text Input'),
  Control('input-url', 'URL Input'),
  Control('select', 'Select Box', { placeholder: 'Please select...', options: [] }),
  Control('textarea', 'Text Box'),
];

/**
 * Gets a control definition for the provided key.
 *
 * @param {string} key The control key, such as `select` or `input-text`.
 * @return {Control} The field definition object.
 * @throws {Error} If the control definition key is not supported.
 */
export function loadControl(key) {
  const control = controls.find(c => c.key === key);
  if (!control) {
    throw new Error(`The control definition '${key}' is not supported.`);
  }
  return control;
}
