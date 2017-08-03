export function initialize(appInstance) {
  appInstance.inject('controller', 'userManager', 'service:user-manager');
  appInstance.inject('route', 'userManager', 'service:user-manager');
  appInstance.inject('component', 'userManager', 'service:user-manager');
}

export default {
  name: 'user-manager',
  initialize: initialize
};
