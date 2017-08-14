import Ember from 'ember';

const { Component, computed, assign } = Ember;

export default Component.extend({
  /**
   * Class names to apply to the component.
   * @type {string[]}
   */
  classNames: ['form-group'],

  /**
   * The active control object.
   * @type {object}
   */
  control: {},

  /**
   * The field attribute values.
   * @type {object}
   */
  attributes: {},

  /**
   * Determines the togglable attributes that should be disabled when a field is set as required.
   * Also has the effect of setting the listed attributes to `false`
   *
   * @type {string[]}
   */
  shouldDisableWhenRequired: ['readonly', 'disabled'],

  /**
   * Returns an array of control attributes that are deemed as `togglable: true`.
   * Will also disable certain attributes if the `required` attribute is set to `false`.
   */
  togglable: computed('control.attributes', 'attributes.required', function() {
    const togglable = this.get('control.attributes')
      .filter(attr => attr.togglable === true)
    ;
    if (this.get('attributes.required')) {
      const shouldDisable = this.get('shouldDisableWhenRequired');
      return togglable.map(attr => shouldDisable.includes(attr.name) ? assign({}, attr, { disabled: true }) : attr);
    }
    return togglable;
  }),

  actions: {
    /**
     * Toggles an attribute from `true` to `false` or vice-versa.
     * Will also enforce setting certain attributes to false when `required` is toggled to `true`.
     *
     * @param {string} name The attribute name
     */
    toggleField(name) {
      const fieldName = `attributes.${name}`;
      this.set(fieldName, Boolean(!this.get(fieldName)));

      if (name === 'required' && this.get(fieldName)) {
        const shouldDisable = this.get('shouldDisableWhenRequired');
        shouldDisable.forEach(toUnset => this.set(`attributes.${toUnset}`, false));
      }
    },
  },
});
