import { moduleForModel, test } from 'ember-qunit';

moduleForModel('owner-readable/user-organizations/organization', 'Unit | Model | owner readable/user organizations/organization', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});
