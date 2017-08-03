import Ember from 'ember';

const { Component, isPresent, $ } = Ember;

export default Component.extend({
  tagName: 'div',
  classNames: ['modal'],
  classNameBindings: ['fade'],
  attributeBindings: ['role'],

  fade: true,
  show: false,
  role: 'dialog',
  size: null,

  _isHiding: false,

  didInsertElement() {
    const optionKeys = ['backdrop', 'keyboard', 'focus'];
    let options = { show: false };
    optionKeys.forEach((key) => {
      const value = this.get(key);
      if (isPresent(value)) {
        options[key] = value;
      }
    });
    this.$().modal(options);
    this.send('show');
  },

  willDestroyElement() {
    const instance = this.$();
    instance.on('hidden.bs.modal', () => {
      instance.modal('dispose');
    });
    this.send('hide');
  },

  /**
   * The function/action that will be called when the modal is trying to hide.
   * Returning `false` from this function with prevent the close.
   */
  onHide() {},

  onHidden() {},

  actions: {
    show() {
      const instance = this.$();
      instance.modal('show');
      // Turn off Bootstrap's native dismissing of the modal (via a click from a`[data-dismiss="modal"]` element or by clicking the backdrop)
      instance.off('click.dismiss.bs.modal');

      // Add a new handler to send the Ember hide() action.
      instance.on('click.dismiss.bs.modal', (event) => {
        if ($(event.currentTarget).is(event.target) && true === this.get('backdrop')) {
          this.send('hide');
        }
      });
    },
    hide() {
      const instance = this.$();
      if (this.get('_isHiding')) {
        return;
      }

      if (false !== this.get('onHide')()) {
        instance.on('hidden.bs.modal', () => {
          this.get('onHidden')();
          if (!this.get('isDestroyed')) {
            this.set('show', false);

          }
        });
        instance.modal('hide');
        if (!this.get('isDestroyed')) {
          this.set('_isHiding', true);
        }
      }
    },
  }
});
