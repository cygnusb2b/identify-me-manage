/**
 * The control attributes.
 * Determines which controls support which attributes.
 *
 * @typedef ControlAttribute
 * @type {object}
 * @property {string} name The attribute name, such as `required` or `placeholder`.
 * @property {string} label The attribute label, such as `Required Field`
 * @property {boolean} [togglable] Whether the attribute is a true/false toggle.
 * @property {string[]} controls The control keys that support this attribute. If a `*` value is present, will apply to all controls.
 *
 * @type {ControlAttribute[]}
 */
const controlAttrs = [
  {
    name: 'autocomplete',
    label: '',
    controls: ['*'],
  },
  {
    name: 'disabled',
    label: 'Disabled',
    togglable: true,
    controls: ['*'],
  },
  {
    name: 'max',
    label: '',
    controls: ['input-number'],
  },
  {
    name: 'maxlength',
    label: '',
    controls: ['input-text', 'input-email', 'input-url', 'textarea'],
  },
  {
    name: 'min',
    label: '',
    controls: ['input-number'],
  },
  {
    name: 'minlength',
    label: '',
    controls: ['input-text', 'input-email', 'input-url', 'textarea'],
  },
  {
    name: 'options',
    label: '',
    controls: ['select', 'input-radio', 'input-checkbox'],
  },
  {
    name: 'pattern',
    label: '',
    controls: ['input-text', 'input-email', 'input-url'],
  },
  {
    name: 'placeholder',
    label: '',
    controls: ['input-text', 'input-email', 'input-url', 'input-number', 'textarea', 'select'],
  },
  {
    name: 'readonly',
    label: 'Read Only',
    togglable: true,
    controls: ['input-text', 'input-email', 'input-url', 'input-number', 'textarea', 'select'],
  },
  {
    name: 'required',
    label: 'Required',
    togglable: true,
    controls: ['*'],
  },
  {
    name: 'step',
    label: '',
    controls: ['input-number'],
  },
  {
    name: 'title',
    label: '',
    controls: ['input-text', 'input-email', 'input-url'],
  },
];

/**
 * @typedef AttrSupport
 * @type {object}
 * @property {boolean} [autocomplete]
 * @property {boolean} [disabled]
 * @property {boolean} [max]
 * @property {boolean} [maxlength]
 * @property {boolean} [min]
 * @property {boolean} [minlength]
 * @property {boolean} [options]
 * @property {boolean} [pattern]
 * @property {boolean} [placeholder]
 * @property {boolean} [readonly]
 * @property {boolean} [required]
 * @property {boolean} [step]
 * @property {boolean} [title]
 */

/**
 * Form control attribute support factory.
 * Creates an attribute support object.
 *
 * @param {string} key The control key, such as `select` or `input-text`.
 * @returns {AttrSupport}
 */
export default function AttrSupport(key) {
  const attributes = controlAttrs
    .filter(attr => attr.controls.includes('*') || attr.controls.includes(key))
  ;
  const supports = Object.freeze(attributes.reduce((acc, value) => {
    if (value.controls.includes('*') || value.controls.includes(key)) {
      acc[value.name] = true;
    }
    return acc;
  }, {}));
  return { supports, attributes };
}
