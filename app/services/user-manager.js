import Ember from 'ember';
import RSVP from 'rsvp';

const { Service, inject: { service }, computed, get, RSVP: { Promise } } = Ember;

export default Service.extend({
  session: service(),
  fb: service('firebase-tools'),
  orgManager: service(),
  store: service(),
  currentUser: null,

  authObj: computed('isAuthed', 'session.currentUser.@each', function() {
    if (!this.get('isAuthed')) {
      return;
    }
    return this.get('session.currentUser');
  }),

  uid: computed('authObj.uid', function() {
    return this.get('authObj.uid');
  }),

  authEmail: computed('authObj.email', function() {
    return this.get('authObj.email');
  }),

  isAuthed: computed('session.isAuthenticated', function() {
    return this.get('session.isAuthenticated');
  }),

  canUseApp: computed('orgManager.hasOrgs', 'authObj.emailVerified', function() {
    return this.get('orgManager.hasOrgs') && this.get('authObj.emailVerified');
  }),

  processAction(mode, code) {
    const validate = () => {
      if (!mode || !code) {
        throw new Error('Your request does not contain the proper parameters to continue.')
      }
      if (mode !== 'verifyEmail') {
        throw new Error('Email verification is the only action currently supported.');
      }
    };

    const currentEmail = this.get('authEmail');

    return Promise.resolve()
      .then(() => validate())
      .then(() => this.checkActionCode(code))
      .then(actionCodeInfo => {
        if (currentEmail && currentEmail !== get(actionCodeInfo, 'data.email')) {
          return this.signOutCurrentUser();
        }
      })
      .then(() => this.applyActionCode(code))
      .then(() => {
        if (this.get('authEmail')) {
          return Promise.resolve()
            .then(() => this.get('authObj').reload())
            .then(() => this.get('authObj').getToken(true))
            .then(() => this.notifyLogin(this.get('authObj')))
          ;
        }
      })
    ;
  },

  /**
   *
   * @param {string} code
   * @return {Promise<void>}
   */
  applyActionCode(code) {
    return this.get('fb.auth').applyActionCode(code);
  },

  /**
   *
   * @param {string} code The action code to check.
   * @return {Promise<firebase.auth.ActionCodeInfo>}
   */
  checkActionCode(code) {
    return this.get('fb.auth').checkActionCode(code);
  },

  /**
   * @param {string} email
   * @param {string} password
   * @return {Promise<firebase.User>}
   */
  createNewUser(email, password) {
    const validate = () => {
      if (!email || !password) {
        throw new Error('You must provide an email address and password.');
      }
    }

    return Promise.resolve()
      .then(() => validate())
      .then(() => this.get('fb.auth').createUserWithEmailAndPassword(email, password))
      .then(user => this.sendEmailVerification(user).then(() => user))
      .then(user => this.get('fb').waitUntilExists(`owner-readable/users/${user.uid}`).then(() => user))
      .then(user => this.initializeCurrentUser().then(() => user))
    ;
  },

  /**
   *
   * @param {firebase.User} user
   * @return {Promise<void>}
   */
  sendEmailVerification(user) {
    const writeTo = this.get('fb').setToOwnerWriteableQueue.bind(this.get('fb'));
    return Promise.resolve()
      .then(() => user.sendEmailVerification())
      .then(() => writeTo('set', 'verification-sent', user.uid, (new Date()).valueOf()))
    ;
  },

  /**
   * @param {string} email
   * @param {string} password
   * @return {Promise<firebase.User>}
   */
  signInUser(email, password) {
    const provider = 'password';
    return Promise.resolve()
      .then(() => this.get('session').open('firebase', { provider, email, password }))
      .then(data => data.currentUser)
      .then(user => user.getToken(true).then(() => user))
      .then(user => this.notifyLogin(user))
      .then(user => this.setCurrentUserModel(user.uid).then(() => user))
      .then(user => this.get('orgManager').setUserOrgsFor(user.uid).then(() => user))
    ;
  },

  updateProfileData(data) {
    if (!this.get('isAuthed')) {
      return Promise.reject(new Error('The user is currently not authenticated'));
    }

    const writeTo = this.get('fb').setToOwnerWriteableQueue.bind(this.get('fb'));
    return Promise.resolve()
      .then(() => writeTo('set', 'user-profile', this.get('uid'), data))
    ;
  },

  /**
   *
   * @param {firebase.User} user
   * @return {Promise<firebase.User>}
   */
  notifyLogin(user) {
    const writeTo = this.get('fb').setToOwnerWriteableQueue.bind(this.get('fb'));
    return Promise.resolve()
      .then(() => writeTo('set', 'login', user.uid, {}))
      .then(() => user)
    ;
  },

  /**
   * @param {string} uid
   * @return {Promise<Model>}
   */
  retrieveUserModel(uid) {
    return this.get('store').findRecord('owner-readable/users', uid);
  },

  /**
   * @return {void}
   */
  clearCurrentUser() {
    this.set('currentUser', null);
  },

  /**
   * @param {string} uid
   * @return {Promise<Model>}
   */
  setCurrentUserModel(uid) {
    return this.retrieveUserModel(uid).then((model) => {
      this.set('currentUser', model);
      return model;
    });
  },

  /**
   * @return {Promise<void>}
   */
  signOutCurrentUser() {
    return this.get('fb.auth')
      .signOut()
      .then(() => this.clearCurrentUser())
      .then(() => window.location.reload())
    ;
  },

  fetchSession() {
    return this.get('session').fetch().catch(() => {});
  },

  initializeCurrentUser() {
    return Promise.resolve()
      .then(() => this.fetchSession())
      .then(() => {
        if (this.get('session.isAuthenticated')) {
          const uid = this.get('session.currentUser.uid');
          return this.setCurrentUserModel(uid);
        }
        return null;
      })
    ;
  },
});
