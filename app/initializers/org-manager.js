export function initialize(appInstance) {
  appInstance.inject('controller', 'orgManager', 'service:org-manager');
  appInstance.inject('route', 'orgManager', 'service:org-manager');
  appInstance.inject('component', 'orgManager', 'service:org-manager');
}

export default {
  name: 'org-manager',
  initialize: initialize
};
