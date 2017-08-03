import { moduleForModel, test } from 'ember-qunit';

moduleForModel('owner-readable/user-organizations', 'Unit | Serializer | owner readable/user organizations', {
  // Specify the other units that are required for this test.
  needs: ['serializer:owner-readable/user-organizations']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  let record = this.subject();

  let serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
