import FirebaseAdapter from 'emberfire/adapters/firebase';

export default FirebaseAdapter.extend({
  pathForType(modelName) {
    return modelName;
  },
});
