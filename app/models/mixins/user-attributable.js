import Ember from 'ember';
import { belongsTo } from 'ember-data/relationships';

const { Mixin, inject: { service } } = Ember;

export default Mixin.create({
  user: service(),

  createdBy: belongsTo('tenant/$tid/user', { inverse: null, async: true }),
  updatedBy: belongsTo('tenant/$tid/user', { inverse: null, async: true }),

  save() {
    const user = this.get('user.tenantUser').get('content');
    if (!this.get('createdBy.id')) {
      this.set('createdBy', user);
    }
    if (!this.get('updatedBy.id')) {
      this.set('updatedBy', user);
    }
    return this._super(...arguments);
  },
});
