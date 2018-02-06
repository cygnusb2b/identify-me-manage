const admin = require('firebase-admin');
const account = require('./identify-me-development-bare-9faf349e0aa3.json');

admin.initializeApp({
  credential: admin.credential.cert(account),
  databaseURL: "https://identify-me-development-bare.firebaseio.com"
});

const db = admin.database();

// Populate controls attributes
const controlAttrRef = db.ref('app/field-control-attributes');
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
const attributes = controlAttrs.map((controlAttr) => {
  const key =  controlAttr.name;
  const label = controlAttr.label;
  return {
    key,
    values: {
      label: label || key.charAt(0).toUpperCase() + key.slice(1),
      togglable: controlAttr.togglable || false,
    },
  };
});

Promise.resolve()
  .then(() => console.info('Wiping control attributes.'))
  .then(() => controlAttrRef.set(null))
  .then(() => Promise.all(attributes.map(attr => controlAttrRef.child(attr.key).set(attr.values))))
  .then(() => console.info('Control attribute push complete!'))
;


function AttrSupport(key) {
  const attributes = controlAttrs
    .filter(attr => attr.controls.includes('*') || attr.controls.includes(key))
  ;
  const supports = attributes.reduce((acc, value) => {
    if (value.controls.includes('*') || value.controls.includes(key)) {
      acc[value.name] = true;
    }
    return acc;
  }, {});
  return supports;
}

// Populate controls.
const controlRef = db.ref('app/field-controls');
const controls = [
  { key: 'input-checkbox', values: { title: 'Checkboxes' } },
  { key: 'input-email', values: { title: 'Email Input' } },
  { key: 'input-number', values: { title: 'Number Input' } },
  { key: 'input-radio', values: { title: 'Radio Buttons' } },
  { key: 'input-text', values: { title: 'Text Input' } },
  { key: 'input-url', values: { title: 'URL Input' } },
  { key: 'select', values: { title: 'Select Box', defaults: { placeholder: 'Please select...' } } },
  { key: 'textarea', values: { title: 'Text Box' } },
];

Promise.resolve()
  .then(() => console.info('Wiping field controls.'))
  .then(() => controlRef.set(null))
  .then(() => Promise.all(controls.map((control) => {
    control.values.attributes = AttrSupport(control.key);
    return controlRef.child(control.key).set(control.values)
  })))
  .then(() => console.info('Field control push complete!'))
;

// Populate field types.
const typeRef = db.ref('app/field-types');
const types = [
  { key: 'choice-multiple', values: { controls: { 'input-checkbox': true }, title: 'Multiple Answer List', description: 'A list of choices with multiple answers', sequence: 3 } },
  { key: 'choice-single', values: { controls: { 'select': true, 'input-radio': true }, defaultControl: 'select', title: 'Single Answer List', description: 'A list of choices with a single answer', sequence: 2 } },
  { key: 'email', values: { controls: { 'input-email': true }, title: 'Email Address', description: 'An email address answer', sequence: 4 } },
  { key: 'number', values: { controls: { 'input-number': true }, title: 'Number', description: 'A number answer', sequence: 5 } },
  { key: 'paragraph', values: { controls: { 'textarea': true }, title: 'Text: Multiple Lines', description: 'A long, open-ended text answer (multiple lines)', sequence: 1 } },
  { key: 'text', values: { controls: { 'input-text': true }, title: 'Text: Single Line', description: 'A short, open-ended text answer (single line)', sequence: 0 } },
  { key: 'url', values: { controls: { 'input-url': true }, title: 'URL (Web Address)', description: 'A url/website answer', sequence: 6 } },
];

Promise.resolve()
  .then(() => console.info('Wiping field types.'))
  .then(() => typeRef.set(null))
  .then(() => Promise.all(types.map(type => {
    if (!type.values.defaultControl) {
      type.values.defaultControl = Object.keys(type.values.controls)[0];
    }
    return typeRef.child(type.key).set(type.values)
  })))
  .then(() => console.info('Field type push complete!'))
;

// Populate built-in fields.
const fieldRef = db.ref('app/fields');
const fields = [
  { target: 'identity', type: 'text', label: 'Full Name', name: 'full-name', control: 'input-text', attributes: { autocomplete: 'name' } },
  { target: 'identity', type: 'text', label: 'First Name', name: 'given-name', control: 'input-text', attributes: { autocomplete: 'given-name' } },
  { target: 'identity', type: 'text', label: 'Middle Name', name: 'middle-name', control: 'input-text', attributes: { autocomplete: 'additional-name' } },
  { target: 'identity', type: 'text', label: 'Last Name', name: 'family-name', control: 'input-text', attributes: { autocomplete: 'family-name' }  },
  { target: 'identity', type: 'text', label: 'Company Name', name: 'company-name', control: 'input-text', attributes: { autocomplete: 'organization' } },
  { target: 'identity', type: 'text', label: 'Job Title', name: 'job-title', control: 'input-text', attributes: { autocomplete: 'organization-title' } },
  { target: 'identity', type: 'email', label: 'Email Address', name: 'email', control: 'input-email', attributes: { autocomplete: 'email' } },
  { target: 'identity', type: 'url', label: 'Website', name: 'website', control: 'input-url', attributes: { autocomplete: 'url' } },
  { target: 'identity', type: 'paragraph', label: 'Street Address', name: 'street-address', control: 'textarea', attributes: { autocomplete: 'street-address' } },
  { target: 'identity', type: 'text', label: 'City', name: 'city', control: 'input-text', attributes: { autocomplete: 'address-level2' } },
  { target: 'identity', type: 'text', label: 'State/Province/Region', name: 'region-freeform', control: 'input-text', attributes: { autocomplete: 'address-level1' } },
  { target: 'identity', type: 'text', label: 'Zip/Postal Code', name: 'postal-code', control: 'input-text', attributes: { autocomplete: 'postal-code' } },
  { target: 'identity', type: 'text', label: 'Country', name: 'country-freeform', control: 'input-text', attributes: { autocomplete: 'country-name' } },
  { target: 'identity', type: 'text', label: 'Gender', name: 'gender-freeform', control: 'input-text', attributes: { autocomplete: 'sex' } },
  { target: 'identity', type: 'choice-single', label: 'Select US State', name: 'region-select-us', control: 'select', attributes: { autocomplete: 'address-level1', placeholder: 'Please select...', options: [
    { value: "CA", label: "Canada", sequence: 1 },
    { value: "US", label: "United States", sequence: 0 },
    { value: "MX", label: "Mexico", sequence: 2, isHidden: true },
    { value: "Other", label: "Other", sequence: 3, isOther: true },
  ] } },
  { target: 'identity', type: 'choice-single', label: 'Select Canadian Province', name: 'region-select-ca', control: 'select', attributes: { autocomplete: 'address-level1', placeholder: 'Please select...' } },
  { target: 'identity', type: 'choice-single', label: 'Select Country', name: 'country-select', control: 'select', attributes: { autocomplete: 'country', placeholder: 'Please select...' } },
  { target: 'identity', type: 'choice-single', label: 'Select Gender', name: 'gender-select', control: 'select', attributes: { autocomplete: 'sex', placeholder: 'Please select...' } },
];

Promise.resolve()
  .then(() => console.info('Wiping built-in fields'))
  .then(() => fieldRef.set(null))
  .then(() => console.info('Wipe complete!'))
  .then(() => console.info('Pushing fields'))
  .then(() => Promise.all(fields.map(field => {
    if (field.attributes.options) {
      const options = field.attributes.options;
      delete field.attributes.options;
      return Promise.resolve()
        .then(() => fieldRef.push(field))
        .then((ref) => Promise.all(options.map(option => ref.child('choices').push(option))))
      ;
    } else {
      return fieldRef.push(field);
    }
  })))
  .then(() => console.info('Field push complete!'))
  .catch(e => console.error('Error!', e))
;
