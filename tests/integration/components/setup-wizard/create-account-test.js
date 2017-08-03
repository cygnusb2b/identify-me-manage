import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('setup-wizard/create-account', 'Integration | Component | setup wizard/create account', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{setup-wizard/create-account}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#setup-wizard/create-account}}
      template block text
    {{/setup-wizard/create-account}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
