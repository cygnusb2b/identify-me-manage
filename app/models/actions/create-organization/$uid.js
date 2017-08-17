import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

const { inject: { service } } = Ember;

export default Model.extend({
  user: service(),
  fb: service('firebase-tools'),

  name: attr('string'),

  save() {
    const oid = this.get('id');
    const uid = this.get('user.uid');
    return this._super(...arguments)
      .then(() => {
        const path = `/models/user-organizations/${uid}/${oid}`;
        return this.get('fb').waitUntilExists(path).then(() => oid);
      })
      .finally(() => this.unloadRecord())
    ;
  },
});
