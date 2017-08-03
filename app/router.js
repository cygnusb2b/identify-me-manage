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
    this.route('organization', { path: '/organization/:id' }, function() {
      this.route('taxonomy');
    });
  }),
  this.route('user', { path: '/__/auth/action' });

  this.route('app', function() {
    this.route('organization');
  });
});

export default Router;
