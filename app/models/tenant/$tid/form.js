import Model from 'ember-data/model';
import RSVP from 'rsvp';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import Timestampable from 'manage/models/mixins/timestampable';
import UserAttributable from 'manage/models/mixins/user-attributable';

const { Promise } = RSVP;

export default Model.extend(Timestampable, UserAttributable, {
  name: attr('string'),
  fields: hasMany('tenant/$tid/form/field', { inverse: null, async: false }),

  /**
   * Assigns and copies an external field to this form.
   * Can assign `app` and `tenant` specific fields to the form.
   * Will "copy" the field data to the form-specific model.
   *
   * @param {string} scope The field scope, one of `app` or `tenant`.
   * @param {Model} field The field data to copy/apply.
   * @param {boolean} autosave Whether to automatically save the form.
   * @return {Promise<Model>}
   */
  assignField(scope, field, sequence, autosave = true) {
    const payload = { scope, sequence: sequence || 0 };
    ['id', 'label', 'control', 'type', 'target', 'attributes'].forEach(key => payload[key] = field.get(key));
    if (field.get('supportsChoices')) {
      // Clone the field choices.
      payload.choices = [];
      field.get('choices').forEach((choice) => {
        const choicePayload = {};
        ['id', 'label', 'value', 'sequence', 'isHidden', 'isOther', 'isNone'].forEach(key => choicePayload[key] = choice.get(key))
        const cloned = this.get('store').createRecord('tenant/$tid/form/field/field-choice', choicePayload);
        payload.choices.pushObject(cloned);
      });
    }
    return this._createAndPushField(payload, autosave);
  },

  /**
   * Creates a form-specific field.
   * Is considered a one-off field that's only available to this form.
   *
   * @param {Model} type The `field-type` model to create the form field from.
   * @param {boolean} autosave Whether to autosave the form.
   * @return {Promise<Model>}
   */
  createField(type, sequence, autosave = true) {
    const payload = {
      control: type.get('defaultControl'),
      attributes: type.get('defaultControl.defaults') || {},
      label: type.get('title'),
      scope: 'form',
      sequence: sequence || 0,
      type,
    };
    return this._createAndPushField(payload, autosave);
  },

  destroyField(field) {
    /**
     * Will remove the model from the identity map.
     * Is the only, current, way of allowing the another record with the same id to be created again once destroyed.
     *
     * @todo This is a hack to remove the deleted record so it can be added again, fix if possibe.
     * @see https://github.com/emberjs/data/issues/5006
     * @param {Model} model
     * @return {Model}
     */
    const removeFromMap = (model) => {
      this.get('store')._removeFromIdMap(model._internalModel);
      return model;
    };
    /**
     * Destorys the record and then removes it from the identity map
     *
     * @param {Model} model
     * @return {Promise<Model>}
     */
    const destroy = (model) => {
      return model.destroyRecord().then(removeFromMap);
    };

    if (!field.get('isCustom')) {
      if (field.get('supportsChoices')) {
        return Promise.all(field.get('choices').map(choice => destroy(choice)))
          .then(() => destroy(field))
        ;
      }
      return destroy(field);
    }
    return destroy(field);
  },

  /**
   * Creates and pushes a new field to this form.
   *
   * @private
   * @param {object} payload
   * @param {boolean} autosave
   * @return {Promise<Model>}
   */
  _createAndPushField(payload, autosave = true) {
    const field = this.store.createRecord('tenant/$tid/form/field', payload);
    this.get('fields').pushObject(field);
    if (autosave) {
      return field.save().then(() => field);
    }
    return Promise.resolve().then(() => field);
  }

});
