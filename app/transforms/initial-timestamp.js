import MomentTimestamp from 'manage/transforms/moment-timestamp';

const { inject: { service } } = Ember;

export default MomentTimestamp.extend({
  fb: service('firebase-tools'),

  serialize(date) {
    if (!date) {
      return this.get('fb').getTimestamp();
    }
    return this._super(date);
  },
});
