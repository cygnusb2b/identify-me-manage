/* eslint-env node */

module.exports = function(environment) {
  var ENV = {
    firebase: {
      apiKey: "AIzaSyCCGhu4G6JCoI4AHBIlz0i1Kffw3tViv2M",
      authDomain: "identify-me-development.firebaseapp.com",
      databaseURL: "https://identify-me-development.firebaseio.com",
      projectId: "identify-me-development",
      storageBucket: "identify-me-development.appspot.com",
      messagingSenderId: "265419473302"
    },
    torii: {
      sessionServiceName: 'session'
    },
    modulePrefix: 'manage',
    environment: environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    ENV.firebase = {
      apiKey: "AIzaSyBAlgGhaVb7WfIgbxAKf5Yn45GqW6pBkPk",
      authDomain: "identify-me-development-bare.firebaseapp.com",
      databaseURL: "https://identify-me-development-bare.firebaseio.com",
      projectId: "identify-me-development-bare",
      storageBucket: "identify-me-development-bare.appspot.com",
      messagingSenderId: "58933591775"
    };

    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    ENV.APP.LOG_TRANSITIONS = true;
    ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.firebase = {
      apiKey: "AIzaSyCcEcC8uFAe-SLZBzBnMGR9j0A8DBEDGck",
      authDomain: "identify-me-production.firebaseapp.com",
      databaseURL: "https://identify-me-production.firebaseio.com",
      projectId: "identify-me-production",
      storageBucket: "",
      messagingSenderId: "318608538836"
    };
  }

  return ENV;
};
