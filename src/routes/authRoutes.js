// import LoginOptions from '../pages/Login/LoginOptions';
import adminRoutes from './adminRoutes';
import labOwnerRoutes from './labOwnerRoutes';
import labRoutes from './labRoutes';
// import Checkout from '../pages/Checkout/Checkout';
// import Packages from '../pages/Packages/Packages';
import superAdminRoutes from './superAdminRoutes';
import patientRoutes from './patientRoutes';

import loadable from '@loadable/component'

const LoginOptions = loadable(() => import('../pages/Login/LoginOptions'));
// const adminRoutes = loadable(() => import('./adminRoutes'));
// const labOwnerRoutes = loadable(() => import('./labOwnerRoutes'));
// const labRoutes = loadable(() => import('./labRoutes'));
const Checkout = loadable(() => import('../pages/Checkout/Checkout'));
const Packages = loadable(() => import('../pages/Packages/Packages'));
// const superAdminRoutes = loadable(() => import('./superAdminRoutes'));
// const patientRoutes = loadable(() => import('./patientRoutes'));

let authRoutes = [];

authRoutes = [
  ...adminRoutes,
  ...superAdminRoutes,
  ...labOwnerRoutes,
  ...labRoutes,
  ...patientRoutes,
  {
    path: '/login-as',
    component: LoginOptions,
    exact: true,
  },
  {
    path: '/checkout',
    component: Checkout,
    exact: true,
  },
  {
    path: '/packages',
    component: Packages,
    exact: true,
  },
  {
    redirect: true,
    path: '/patient',
    pathTo: '/patient/dashboard',
    exact: true,
    role: ['patient'],
  },
  {
    redirect: true,
    path: '/lab-admin',
    pathTo: '/lab-admin/dashboard/overview',
    exact: true,
    role: ['lab-admin'],
  },
  {
    redirect: true,
    path: '/lab',
    pathTo: '/lab/dashboard/overview',
    exact: true,
    role: ['lab'],
  },
  {
    redirect: true,
    path: '/super-admin',
    pathTo: '/super-admin/dashboard/overview',
    exact: true,
    role: ['super-admin'],
  },
  {
    redirect: true,
    path: '/assistant-admin',
    pathTo: '/assistant-admin/dashboard/overview',
    exact: true,
    role: ['assistant-admin'],
  },
  {
    redirect: true,
    path: '/',
    pathTo: localStorage.getItem('loginAs') ? `/${localStorage.getItem('loginAs')}` : '/login-as',
    component: LoginOptions,
  },
];

export default authRoutes;
