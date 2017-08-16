export function initialize(appInstance) {
  appInstance.inject('controller', 'user', 'service:user');
  appInstance.inject('route', 'user', 'service:user');
  appInstance.inject('component', 'user', 'service:user');
}

export default {
  name: 'user',
  initialize: initialize
};
