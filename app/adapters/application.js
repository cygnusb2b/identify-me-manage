import FirebaseAdapter from 'emberfire/adapters/firebase';
import Ember from 'ember';
import { pluralize } from 'ember-inflector';

const { inject: { service } } = Ember;

/**
 * Determines if the provided model name is an `action` model.
 *
 * @param {string} modelName
 */
function isActionModel(modelName) {
  return modelName.indexOf('/actions/') !== -1;
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
   * Overwritten to ensure `$uid` and `$tid` paths are replaced.
   * Also ensures that models are pluralized and that `actions`
   * are left as-is (as set on the filesystem).
   *
   * @param {string} modelName
   */
  pathForType(modelName) {
    const uid = this.get('user.uid');
    const tid = this.get('user.tid');
    const replaced = modelName.replace('$uid', uid).replace('$tid', tid);
    const formatted = isActionModel(replaced) ? replaced : pluralize(replaced);
    return formatted;
  },
});
