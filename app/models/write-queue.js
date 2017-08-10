import Model from 'ember-data/model';

export default Model.extend({
  save() {
    return this._super(...arguments).then(record => record.unloadRecord());
  }
});
