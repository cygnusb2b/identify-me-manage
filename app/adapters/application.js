import FirebaseAdapter from 'emberfire/adapters/firebase';
import Ember from 'ember';

const { inject: { service } } = Ember;

/**
 * Determines if the provided model name is an `action` model.
 *
 * @param {string} modelName
 */
function isActionModel(modelName) {
  return modelName.indexOf('actions') === 0;
}

export default FirebaseAdapter.extend({
  user: service(),

  /**
   * Overwritten to prevent action models (which cannot be read)
   * from having changes listened to/read on create.
   *
   * @inheritdoc
   */
  createRecord(store, typeClass) {
    if (isActionModel(typeClass.modelName)) {
      return this.updateRecord(...arguments);
    } else {
      return this._super(...arguments);
    }
  },

  /**
   * Overwritten to ensure `$uid` and `$oid` paths are replaced.
   * Also ensures that models have the `models/` path pre-pended
   * and that `actions` are left as-is.
   *
   * @param {string} modelName
   */
  pathForType(modelName) {
    const uid = this.get('user.uid');
    const oid = this.get('user.oid');
    const replaced = modelName.replace('$uid', uid).replace('$oid', oid);
    const formatted = isActionModel(replaced) ? replaced : `models/${replaced}`;
    return formatted;
  },
});
