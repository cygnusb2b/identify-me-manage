import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('app', { path: '/' }, function() {
    this.route('welcome');
    this.route('setup');
    this.route('settings');
    this.route('organization-create', { path: '/organization/new'});
    this.route('organization', { path: '/organization/:id' }, function() {
      this.route('settings', { path: '/settings' }, function() {
        this.route('team');
      });
    });
  }),

  // Unauthenticated
  this.route('user', { path: '/__/auth/action' });
});

export default Router;
