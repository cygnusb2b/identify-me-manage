import FieldType from 'manage/services/field-manager/field-type';

const fieldTypes = [
  FieldType({ key: 'choice-multiple', controlKeys: ['input-checkbox'], title: 'Multiple Answer List', description: 'A list of choices with multiple answers', sequence: 3 }),
  FieldType({ key: 'choice-single', controlKeys: ['select', 'input-radio'], title: 'Single Answer List', description: 'A list of choices with a single answer', sequence: 2 }),
  FieldType({ key: 'email', controlKeys: ['input-email'], title: 'Email Address', description: 'An email address answer', sequence: 4 }),
  FieldType({ key: 'number', controlKeys: ['input-number'], title: 'Number', description: 'A number answer', sequence: 5 }),
  FieldType({ key: 'paragraph', controlKeys: ['textarea'], title: 'Text: Multiple Lines', description: 'A long, open-ended text answer (multiple lines)', sequence: 1 }),
  FieldType({ key: 'text', controlKeys: ['input-text'], title: 'Text: Single Line', description: 'A short, open-ended text answer (single line)', sequence: 0 }),
  FieldType({ key: 'url', controlKeys: ['input-url'], title: 'URL (Web Address)', description: 'A url/website answer', sequence: 6 }),
];

export function loadFieldType(key) {
  const type = fieldTypes.find(t => t.key === key);
  if (!type) {
    throw new Error(`The field type definition '${key}' is not supported.`);
  }
  return type;
}

export function getFieldTypes() {
  return fieldTypes.slice();
}
