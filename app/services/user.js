import Ember from 'ember';

const { computed, Service, inject: { service }, RSVP, get } = Ember;
const { Promise } = RSVP;

export default Service.extend({
  fb: service('firebase-tools'),
  store: service(),
  session: service(),

  /**
   * The Ember data user model.
   *
   * @type {DS.Model}
   */
  model: {},

  /**
   * Organizations that this user is a user of.
   *
   * @type {DS.Model[]}
   */
  organizations: [],

  /**
   * The user id. Will be `null` if the there is not authenticated user.
   *
   * @type {?string}
   */
  uid: computed.reads('auth.uid'),

  /**
   * The active user organization id.
   *
   * @type {?string}
   */
  oid: computed.reads('activeOrganization.id'),

  /**
   * The Firebase Auth object, or `null` if not authenticated.
   *
   * @type {?object}
   */
  auth: computed('isAuthenticated', 'session.currentUser.@each', function() {
    if (!this.get('isAuthenticated')) {
      return;
    }
    return this.get('session.currentUser');
  }),

  /**
   * Determines if the user has any organizations.
   * @type {boolean}
   */
  hasOrganizations: computed.bool('organizations.length'),

  /**
   * Determines if the user is authenticated, based on the session.
   * Does not check whether a user model is present, or if the session is verified.
   *
   * @type {boolean}
   */
  isAuthenticated: computed.reads('session.isAuthenticated'),

  /**
   * Determines whether the current user is verified.
   *
   * @type {boolean}
   */
  isVerified: computed.reads('auth.emailVerified'),

  /**
   * Determines the user's active organization.
   *
   * @type {DS.Model}
   */
  activeOrganization: computed('organizations.firstObject', 'model.activeOrgId', function() {
    const defaultOrg = this.get('organizations.firstObject');
    const activeOrgId = this.get('model.activeOrgId');
    if (!activeOrgId) {
      return defaultOrg;
    }
    const activeOrg = this.get('organizations').findBy('id', activeOrgId);
    return (activeOrg) ? activeOrg : defaultOrg;
  }),

  /**
   * Determines if the current user can use the application.
   *
   * @type {boolean}
   */
  canUseApplication: computed.and('hasOrganizations', 'isVerified'),

  /**
   * Determines if the current user can manage the active organization.
   */
  canManageOrganization: computed.equal('activeOrganization.role', 'Owner'),

  /**
   * Initializes the user service instance, based on the current session.
   *
   * @return {Promise<this>}
   */
  initialize() {
    return Promise.resolve()
      .then(() => this.fetchSession())
      .then(() => {
        if (this.get('session.isAuthenticated')) {
          const uid = this.get('session.currentUser.uid');
          return this.initUserModels(uid)
        }
      })
      .then(() => this)
    ;
  },

  /**
   * @param {string} email
   * @param {string} password
   * @return {Promise<User>}
   */
  signIn(email, password) {
    const provider = 'password';
    return Promise.resolve()
      .then(() => this.get('session').open('firebase', { provider, email, password }))
      .then(data => data.currentUser)
      .then(auth => auth.getToken(true).then(() => auth))
      .then(auth => this.notifyLogin().then(() => auth))
      .then(auth => this.initUserModels(auth.uid))
    ;
  },

  /**
   * @return {Promise<void>}
   */
  signOut() {
    return this.get('fb.auth')
      .signOut()
      .then(() => this.clear())
      .then(() => window.location.reload())
    ;
  },

  /**
   * Creates a new user instance within the service.
   *
   * @param {string} email
   * @param {string} password
   */
  create(email, password) {
    const validate = () => {
      if (this.get('uid')) {
        throw new Error('You cannot create a new user instance while logged in.');
      }
      if (!email || !password) {
        throw new Error('You must provide an email address and password.');
      }
    }
    return Promise.resolve()
      .then(() => validate())
      .then(() => this.get('fb.auth').createUserWithEmailAndPassword(email, password))
      .then(auth => this.get('fb').waitUntilExists(`models/users/${auth.uid}`))
      .then(() => this.initialize())
      .then(() => this.sendEmailVerification())
    ;
  },

  /**
   * Sends an email verification for this user.
   *
   * @return {Promise<void>}
   */
  sendEmailVerification() {
    const validate = () => {
      if (!this.get('auth')) {
        throw new Error('No user auth instance is available to verify.');
      }
      if (this.get('isVerified')) {
        throw new Error('This user account is already verified.');
      }
    };
    return Promise.resolve()
      .then(() => validate())
      .then(() => this.get('auth').sendEmailVerification())
    ;
  },

  /**
   * Sets the active organization id to the user model.
   *
   * @param {string} oid
   * @return {Promise<void>}
   */
  setActiveOrgTo(oid) {
    this.set('model.activeOrgId', oid);
    return this.get('model').save();
  },

  /**
   * Processes an auth action for this user instance, such as verifying an email address.
   * Note: currently, only `verifyEmail` is supported.
   *
   * @param {string} mode
   * @param {string} code
   * @return {Promise<void>}
   */
  processAction(mode, code) {
    const validate = () => {
      if (!mode || !code) {
        throw new Error('Your request does not contain the proper parameters to continue.')
      }
      if (mode !== 'verifyEmail') {
        throw new Error('Email verification is the only action currently supported.');
      }
    };

    const currentEmail = this.get('auth.email');
    return Promise.resolve()
      .then(() => validate())
      .then(() => this.checkActionCode(code))
      .then(actionCodeInfo => {
        if (currentEmail && currentEmail !== get(actionCodeInfo, 'data.email')) {
          return this.signOut();
        }
      })
      .then(() => this.applyActionCode(code))
      .then(() => {
        if (this.get('auth.email')) {
          return Promise.resolve()
            .then(() => this.get('auth').reload())
            .then(() => this.get('auth').getToken(true))
            .then(() => this.notifyLogin())
          ;
        }
      })
    ;
  },

  /**
   * Applies an action code for the current auth instance.
   *
   * @param {string} code
   * @return {Promise<void>}
   */
  applyActionCode(code) {
    return this.get('fb.auth').applyActionCode(code);
  },

  /**
   * Checks the validity of an action code.
   *
   * @param {string} code The action code to check.
   * @return {Promise<firebase.auth.ActionCodeInfo>}
   */
  checkActionCode(code) {
    return this.get('fb.auth').checkActionCode(code);
  },

  /**
   * Clears user related instance data from the service.
   *
   * @private
   */
  clear() {
    this.set('model', null);
    this.set('organizations', []);
  },

  /**
   * Refreshes all orgs for the user.
   *
   * @return {Promise<void>}
   */
  refreshOrganizations() {
    return Promise.resolve()
      .then(() => this.retrieveUserOrgs())
      .then(orgs => this.set('organizations', orgs))
    ;
  },

  /**
   * @todo Implement me.
   * @private
   * @param {firebase.User} user
   * @return {Promise<firebase.User>}
   */
  notifyLogin() {
    return Promise.resolve()
      .then(() => this.get('auth'))
    ;
  },

  /**
   * @private
   */
  fetchSession() {
    return this.get('session').fetch().catch(() => {});
  },

  /**
   * @private
   * @param {string} uid
   * @return {Promise<void>}
   */
  initUserModels(uid) {
    return RSVP.hash({
      model: this.retrieveUserModel(uid),
      organizations: this.retrieveUserOrgs(),
    }).then(this.setProperties.bind(this));
  },

  /**
   * @private
   */
  retrieveUserOrgs() {
    return this.get('store').findAll('user-organizations/$uid');
  },

  /**
   * @private
   * @param {string} uid
   * @return {Promise<Model>}
   */
  retrieveUserModel(uid) {
    return this.get('store').findRecord('users', uid);
  },
});
