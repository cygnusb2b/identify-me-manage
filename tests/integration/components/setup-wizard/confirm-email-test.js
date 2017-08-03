import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('setup-wizard/confirm-email', 'Integration | Component | setup wizard/confirm email', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{setup-wizard/confirm-email}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#setup-wizard/confirm-email}}
      template block text
    {{/setup-wizard/confirm-email}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
