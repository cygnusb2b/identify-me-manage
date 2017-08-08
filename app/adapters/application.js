import FirebaseAdapter from 'emberfire/adapters/firebase';
import Ember from 'ember';
const { inject: { service } } = Ember;

export default FirebaseAdapter.extend({
  userManager: service(),
  orgManager: service(),
  pathForType(modelName) {
    const uid = this.get('userManager.uid');
    const oid = this.get('orgManager.activeOrgId');
    return modelName.replace('$uid', uid).replace('$oid', oid);
  },
});
