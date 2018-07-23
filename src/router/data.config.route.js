const DataConfiguration = () => import(/* webpackChunkName: 'configuration' */ 'views/dataconfiguration/DataConfiguration');
const ScaleManagement = () => import(/* webpackChunkName: 'configuration' */ 'views/dataconfiguration/scalemanagement/ScaleManagement');
const ScaleDetails = () => import(/* webpackChunkName: 'configuration' */ 'views/dataconfiguration/scalemanagement/ScaleDetails');

export default {
  path: 'dataconfiguration',
  name: 'dataconfiguration',
  component: DataConfiguration,
  children: [
    {
      path: 'scalemanagement',
      name: 'scalemanagement',
      component: ScaleManagement
    },
    {
      path: 'scaleDetails/:id',
      name: 'scaleDetails',
      component: ScaleDetails
    }
  ]
};
