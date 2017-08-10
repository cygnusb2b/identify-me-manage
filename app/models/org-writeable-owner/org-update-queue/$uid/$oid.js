import WriteQueue from 'manage/models/write-queue';
import attr from 'ember-data/attr';

export default WriteQueue.extend({
  name: attr('string'),
  photoURL: attr('string')
});
