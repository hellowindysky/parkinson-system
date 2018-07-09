const SysConfiguration = () => import(/* webpackChunkName: 'configuration' */ 'views/sysconfiguration/SysConfiguration');
const UserManagement = () => import(/* webpackChunkName: 'configuration' */ 'views/sysconfiguration/usermanagement/UserManagement');

export default {
  path: 'sysconfiguration',
  name: 'sysconfiguration',
  component: SysConfiguration,
  children: [
    {
      path: 'usermanagement',
      name: 'usermanagement',
      component: UserManagement
    }
  ]
};
