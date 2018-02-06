import Ember from 'ember';

const { Component, computed, set, get } = Ember;

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
  togglable: computed('control.attributes.@each.togglable', 'attributes.required', function() {
    const togglable = this.get('control.attributes').filter(attr => attr.get('togglable'));
    const shouldDisable = this.get('shouldDisableWhenRequired');
    togglable.forEach((attr) => {
      const disabled = this.get('attributes.required') && shouldDisable.includes(attr.get('id'));
      attr.set('disabled', disabled);
    });
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
      const attributes = this.get('attributes');
      const current = get(attributes, name);
      set(attributes, name, Boolean(!current))

      if (name === 'required' && get(attributes, name)) {
        const shouldDisable = this.get('shouldDisableWhenRequired');
        shouldDisable.forEach(toUnset => set(attributes, toUnset, false));
      }
      this.sendAction('on-change');
    },
  },
});
