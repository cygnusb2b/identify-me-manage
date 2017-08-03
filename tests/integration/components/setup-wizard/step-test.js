import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('setup-wizard/step', 'Integration | Component | setup wizard/step', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{setup-wizard/step}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#setup-wizard/step}}
      template block text
    {{/setup-wizard/step}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
