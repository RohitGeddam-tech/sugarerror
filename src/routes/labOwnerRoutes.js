import loadable from '@loadable/component';

const PatientOverview = loadable(() => import('../pages/Pathology/Dashboard/PatientOverview/PatientOverview'));
const LabStatistics = loadable(() => import('../pages/Pathology/Dashboard/LabStatistics/LabStatistics'));
const Appointments = loadable(() => import('../pages/Pathology/Dashboard/Appointments/Appointments'));
const PatientsList = loadable(() => import('../pages/Pathology/Patients/List/PatientsList'));
const AddPatient = loadable(() => import('../pages/Pathology/Patients/Add/AddPatient'));
const AddDoctor = loadable(() => import('../pages/Pathology/ReferredDoctor/Add/AddDoctor'));
const DoctorList = loadable(() => import('../pages/Pathology/ReferredDoctor/List/DoctorList'));
const AddAppointment = loadable(() => import('../pages/Pathology/AddAppointment/AddAppointment'));
const MainOfficeList = loadable(() => import('../pages/LabDetails/MainOfficeDetails/MainOfficeList'));
const MainOfficeEdit = loadable(() => import('../pages/LabDetails/MainOfficeDetails/MainOfficeEdit'));
const BranchList = loadable(() => import('../pages/LabDetails/BranchDetails/BranchList'));
const BranchAdd = loadable(() => import('../pages/LabDetails/BranchDetails/BranchAdd'));
const PackageDetails = loadable(() => import('../pages/LabDetails/PackageDetails/PackageDetails'));
const BranchSettings = loadable(() => import('../pages/LabDetails/BranchDetails/BranchSettings/BranchSettings'));
const MyProfile = loadable(() => import('../pages/MyProfile/MyProfile'));
const TestSetList = loadable(() => import('../pages/LabDetails/TestSets/TestSetList'));
const TestSetView = loadable(() => import('../pages/LabDetails/TestSets/TestSetView/TestSetView'));
const AddTestPackage = loadable(() => import('../pages/LabDetails/BranchDetails/BranchSettings/AddTestPackage'));
const PatientReport = loadable(() => import('../pages/Pathology/Patients/List/PatientReport'));
const CategoryList = loadable(() => import('../components/Common/Tests/List/Category/CategoryList'));
const UnitList = loadable(() => import('../components/Common/Tests/List/Unit/UnitList'));
const SampleList = loadable(() => import('../components/Common/Tests/List/SampleType/SampleList'));
const TestList = loadable(() => import('../components/Common/Tests/List/TestList'));
const AddTestDetails = loadable(() => import('../components/Common/Tests/Add/AddTestDetails'));
const ViewTest = loadable(() => import('../components/Common/Tests/Add/ViewTest'));

const parentUrl = '/lab-admin';

const labOwnerRoutes = [
  //settings
  {
    path: `${parentUrl}/setting/test-packages-add`,
    exact: true,
    component: AddTestPackage,
    role: ['lab-admin'],
  },
  {
    path: `${parentUrl}/setting/test-package-edit`,
    exact: true,
    component: AddTestPackage,
    role: ['lab-admin'],
  },
  {
    path: `${parentUrl}/setting/test-sets`,
    exact: true,
    component: TestSetList,
    role: ['lab-admin'],
  },
  {
    path: `${parentUrl}/setting/my-profile`,
    exact: true,
    component: MyProfile,
    role: ['lab-admin'],
  },
  {
    path: `${parentUrl}/setting/lab-details/package-details`,
    exact: true,
    component: PackageDetails,
    role: ['lab-admin'],
  },
  {
    path: `${parentUrl}/setting/add-branch-details`,
    exact: true,
    component: BranchAdd,
    role: ['lab-admin'],
  },
  {
    path: `${parentUrl}/setting/branch-settings/:branchId/:option`,
    exact: true,
    component: BranchSettings,
    role: ['lab-admin'],
  },
  {
    path: `${parentUrl}/setting/lab-details/branch-details`,
    exact: true,
    component: BranchList,
    role: ['lab-admin'],
  },
  {
    path: `${parentUrl}/setting/edit-main-office-details`,
    exact: true,
    component: MainOfficeEdit,
    role: ['lab-admin'],
  },
  {
    path: `${parentUrl}/setting/lab-details/main-office-details`,
    exact: true,
    component: MainOfficeList,
    role: ['lab-admin'],
  },
  {
    redirect: true,
    path: `${parentUrl}/setting/lab-details`,
    pathTo: `${parentUrl}/setting/lab-details/main-office-details`,
    exact: true,
    role: ['lab-admin'],
  },
  {
    redirect: true,
    path: `${parentUrl}/setting`,
    pathTo: `${parentUrl}/setting/lab-details`,
    exact: true,
    role: ['lab-admin'],
  },
  // View Test set
  {
    path: `${parentUrl}/setting/test-set/:type/:labId/:testSetId/tests`,
    exact: true,
    component: TestSetView,
    role: ['lab-admin'],
  },
  // Master test list
  {
    path: `${parentUrl}/setting/edit-test/:testId`,
    exact: true,
    component: AddTestDetails,
    role: ['lab-admin'],
  },
  {
    path: `${parentUrl}/setting/view-test/:testId`,
    exact: true,
    component: ViewTest,
    role: ['lab-admin'],
  },
  {
    path: `${parentUrl}/setting/add-test`,
    isActive: false,
    component: AddTestDetails,
    role: ['lab-admin'],
  },
  {
    path: `${parentUrl}/setting/tests/list`,
    isActive: false,
    component: TestList,
    role: ['lab-admin'],
  },
  {
    path: `${parentUrl}/setting/tests/categories`,
    isActive: true,
    component: CategoryList,
    role: ['lab-admin'],
  },
  {
    path: `${parentUrl}/setting/tests/units`,
    isActive: false,
    component: UnitList,
    role: ['lab-admin'],
  },
  {
    path: `${parentUrl}/setting/tests/sample-type`,
    isActive: false,
    component: SampleList,
    role: ['lab-admin'],
  },
  {
    redirect: true,
    path: `${parentUrl}/setting/tests`,
    pathTo: `${parentUrl}/setting/tests/list`,
    component: TestList,
    role: ['lab-admin'],
  },

  //add-appointment
  {
    path: `${parentUrl}/add-appointment`,
    exact: true,
    component: AddAppointment,
    role: ['lab-admin'],
  },

  //referred-doctor
  {
    path: `${parentUrl}/referred-doctor-update`,
    exact: true,
    component: AddDoctor,
    role: ['lab-admin'],
  },
  {
    path: `${parentUrl}/referred-doctor/add`,
    exact: true,
    component: AddDoctor,
    role: ['lab-admin'],
  },
  {
    path: `${parentUrl}/referred-doctor/list`,
    exact: true,
    component: DoctorList,
    role: ['lab-admin'],
  },
  {
    redirect: true,
    path: `${parentUrl}/referred-doctor`,
    pathTo: `${parentUrl}/referred-doctor/list`,
    exact: true,
    component: DoctorList,
    role: ['admin'],
  },

  //patients
  {
    path: `${parentUrl}/report-preview`,
    exact: true,
    component: PatientReport,
    role: ['lab-admin'],
  },
  {
    path: `${parentUrl}/edit-patient`,
    exact: true,
    component: AddPatient,
    role: ['lab-admin'],
  },
  {
    path: `${parentUrl}/patients/add`,
    exact: true,
    component: AddPatient,
    role: ['lab-admin'],
  },
  {
    path: `${parentUrl}/patients/list`,
    exact: true,
    component: PatientsList,
    role: ['lab-admin'],
  },
  {
    redirect: true,
    path: `${parentUrl}/patients`,
    pathTo: `${parentUrl}/patients/list`,
    exact: true,
    component: PatientsList,
    role: ['lab-admin'],
  },

  //dashboard
  {
    path: `${parentUrl}/dashboard/appointments`,
    exact: true,
    component: Appointments,
    role: ['lab-admin'],
  },
  {
    path: `${parentUrl}/dashboard/lab-statistics`,
    exact: true,
    component: LabStatistics,
    role: ['lab-admin'],
  },
  {
    path: `${parentUrl}/dashboard/overview`,
    isActive: true,
    component: PatientOverview,
    role: ['lab-admin'],
  },
  {
    redirect: true,
    path: `${parentUrl}/dashboard`,
    pathTo: `${parentUrl}/dashboard/overview`,
    exact: true,
    component: PatientOverview,
    role: ['lab-admin'],
  },
  {
    redirect: true,
    path: `${parentUrl}`,
    pathTo: `${parentUrl}/dashboard/overview`,
    role: ['lab-admin'],
  },
];

export default labOwnerRoutes;
