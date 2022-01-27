// import Login from '../pages/Login/Login';
// import Contact from '../pages/Prelogin/Contact/Contact';
// import About from '../pages/Prelogin/About/About';
// import Home from '../pages/Prelogin/Home/Home';
// // import FAQ from '../pages/Prelogin/FAQ/FAQ';
// import Packages from '../pages/Prelogin/Register/Packages/Packages';
// import RegisterForm from '../pages/Prelogin/Register/RegisterForm/RegisterForm';
// import SetNewPassword from '../pages/Prelogin/SetNewPassword/SetNewPassword';
// import TermsAndConditions from '../pages/Prelogin/TermsAndConditions/TermsAndConditions';
// import PrivacyPolicy from '../pages/Prelogin/PrivacyPolicy/PrivacyPolicy';

import loadable from '@loadable/component';

const Login = loadable(() => import('../pages/Login/Login'));
const Contact = loadable(() => import('../pages/Prelogin/Contact/Contact'));
const About = loadable(() => import('../pages/Prelogin/About/About'));
const Home = loadable(() => import('../pages/Prelogin/Home/Home'));
const Packages = loadable(() => import('../pages/Prelogin/Register/Packages/Packages'));
const RegisterForm = loadable(() => import('../pages/Prelogin/Register/RegisterForm/RegisterForm'));
const SetNewPassword = loadable(() => import('../pages/Prelogin/SetNewPassword/SetNewPassword'));
const TermsAndConditions = loadable(() => import('../pages/Prelogin/TermsAndConditions/TermsAndConditions'));
const PrivacyPolicy = loadable(() => import('../pages/Prelogin/PrivacyPolicy/PrivacyPolicy'));

const initialRoutes = [
  // {
  //   path: '/faq',
  //   component: FAQ,
  // },
  {
    path: '/contact',
    component: Contact,
  },
  {
    path: '/about',
    component: About,
  },
  {
    path: '/packages',
    component: Packages,
  },
  {
    path: '/register',
    component: RegisterForm,
  },
  {
    path: '/sign-in',
    component: Login,
  },
  {
    path: '/sign-in',
    component: Login,
  },
  {
    path: '/create_password/:tokenId',
    component: SetNewPassword,
  },
  {
    path: '/terms-and-conditions',
    component: TermsAndConditions,
  },
  {
    path: '/privacy-policy',
    component: PrivacyPolicy,
  },
  {
    path: '/sugarerror',
    component: Home,
    exact: true,
    role: [],
  },
  {
    path: '/',
    component: Home,
    exact: true,
    role: [],
  },
  // {
  //   redirect: true,
  //   path: "/",
  //   pathTo: "/",
  //   component: Home,
  // },
];

export default initialRoutes;
