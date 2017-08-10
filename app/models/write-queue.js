import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  save() {
    return this._super(...arguments).then(record => record.unloadRecord());
  }
});
