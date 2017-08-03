import Ember from 'ember';

const { Route, RSVP: { Promise } } = Ember;

export default Route.extend({
  beforeModel() {
    return Promise.resolve()
      .then(() => this.get('userManager').initializeCurrentUser())
      .then(() => {
        const uid = this.get('userManager.uid');
        if (uid) {
          return this.get('orgManager').setUserOrgsFor(uid);
        }
      })
    ;
  },
});
