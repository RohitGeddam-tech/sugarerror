import loadable from '@loadable/component';

const MyProfile = loadable(() => import('../pages/MyProfile/MyProfile'));
const ReportBills = loadable(() => import('../pages/Patient/ReportBills/ReportBills'));
const TrackingChart = loadable(() => import('../pages/Patient/TrackingChart/TrackingChart'));
const Dashboard = loadable(() => import('../pages/Patient/Dashboard/Dashboard'));
const ViewReport = loadable(() => import('../pages/Patient/ReportBills/ViewReport'));

const parentUrl = '/patient';

const patientRoutes = [
  {
    path: `${parentUrl}/setting/my-profile`,
    exact: true,
    component: MyProfile,
    role: ['patient'],
  },
  {
    redirect: true,
    path: `${parentUrl}/setting`,
    pathTo: `${parentUrl}/setting/my-profile`,
    exact: true,
    role: ['patient'],
  },
  {
    path: `${parentUrl}/tracking-chart`,
    exact: true,
    component: TrackingChart,
    role: ['patient'],
  },
  {
    path: `${parentUrl}/view-report`,
    exact: true,
    component: ViewReport,
    role: ['patient'],
  },
  {
    path: `${parentUrl}/reports-and-bills`,
    exact: true,
    component: ReportBills,
    role: ['patient'],
  },
  {
    path: `${parentUrl}/dashboard`,
    exact: true,
    component: Dashboard,
    role: ['patient'],
  },
];

export default patientRoutes;
