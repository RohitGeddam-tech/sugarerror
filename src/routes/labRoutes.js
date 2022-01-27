import loadable from '@loadable/component';

const PatientOverview = loadable(()=>import('../pages/Pathology/Dashboard/PatientOverview/PatientOverview'));
const LabStatistics = loadable(()=>import('../pages/Pathology/Dashboard/LabStatistics/LabStatistics'));
const Appointments = loadable(()=>import('../pages/Pathology/Dashboard/Appointments/Appointments'));
const PatientsList = loadable(()=>import('../pages/Pathology/Patients/List/PatientsList'));
const AddPatient = loadable(()=>import('../pages/Pathology/Patients/Add/AddPatient'));
const AddDoctor = loadable(()=>import('../pages/Pathology/ReferredDoctor/Add/AddDoctor'));
const DoctorList = loadable(()=>import('../pages/Pathology/ReferredDoctor/List/DoctorList'));
const AddAppointment = loadable(()=>import('../pages/Pathology/AddAppointment/AddAppointment'));
const MyProfile = loadable(()=>import('../pages/MyProfile/MyProfile'));
const NameAndAddress = loadable(()=>import('../pages/LabDetails/BranchDetails/BranchSettings/NameAndAddress'));
const BranchUsers = loadable(()=>import('../pages/LabDetails/BranchDetails/BranchSettings/User/BranchUsers'));
const Report = loadable(()=>import('../pages/LabDetails/BranchDetails/BranchSettings/Report'));
const TestSetList = loadable(()=>import('../pages/LabDetails/TestSets/TestSetList'));
const TestSetView = loadable(()=>import('../pages/LabDetails/TestSets/TestSetView/TestSetView'));
const PatientReport = loadable(()=>import('../pages/Pathology/Patients/List/PatientReport'));
const AddTestPackage = loadable(()=>import('../pages/LabDetails/BranchDetails/BranchSettings/AddTestPackage'));
const CategoryList = loadable(()=>import('../components/Common/Tests/List/Category/CategoryList'));
const UnitList = loadable(()=>import('../components/Common/Tests/List/Unit/UnitList'));
const SampleList = loadable(()=>import('../components/Common/Tests/List/SampleType/SampleList'));
const TestList = loadable(()=>import('../components/Common/Tests/List/TestList'));
const AddTestDetails = loadable(()=>import('../components/Common/Tests/Add/AddTestDetails'));
const ViewTest = loadable(()=>import('../components/Common/Tests/Add/ViewTest'));

const parentUrl = '/lab';

const labRoutes = [
  //settings
  {
    path: `${parentUrl}/setting/test-packages-add`,
    exact: true,
    component: AddTestPackage,
    role: ['lab'],
  },
  {
    path: `${parentUrl}/setting/test-package-edit`,
    exact: true,
    component: AddTestPackage,
    role: ['lab'],
  },
  {
    path: `${parentUrl}/setting/test-sets`,
    exact: true,
    component: TestSetList,
    role: ['lab'],
  },
  {
    path: `${parentUrl}/setting/my-profile`,
    exact: true,
    component: MyProfile,
    role: ['lab'],
  },
  {
    path: `${parentUrl}/setting/branch-details/name-and-address`,
    exact: true,
    component: NameAndAddress,
    role: ['lab'],
  },
  {
    path: `${parentUrl}/setting/branch-details/branch-users`,
    exact: true,
    component: BranchUsers,
    role: ['lab'],
  },
  {
    path: `${parentUrl}/setting/branch-details/report`,
    exact: true,
    component: Report,
    role: ['lab'],
  },
  {
    path: `${parentUrl}/setting/test-packages-add`,
    exact: true,
    component: AddTestPackage,
    role: ['lab-admin'],
  },
  {
    redirect: true,
    path: `${parentUrl}/setting/branch-details`,
    pathTo: `${parentUrl}/setting/branch-details/name-and-address`,
    exact: true,
    role: ['lab'],
  },
  {
    redirect: true,
    path: `${parentUrl}/setting`,
    pathTo: `${parentUrl}/setting/branch-details/name-and-address`,
    exact: true,
    role: ['lab'],
  },

  // View Test set
  {
    path: `${parentUrl}/setting/test-set/:type/:branchId/:testSetId/tests`,
    exact: true,
    component: TestSetView,
    role: ['lab'],
  },

  // Master test list
  {
    path: `${parentUrl}/setting/edit-test/:testId`,
    exact: true,
    component: AddTestDetails,
    role: ['lab'],
    excludeRole : ['lab_technician'], 
  },
  {
    path: `${parentUrl}/setting/view-test/:testId`,
    exact: true,
    component: ViewTest,
    role: ['lab'],
    excludeRole : ['lab_technician'], 
  },
  {
    path: `${parentUrl}/setting/add-test`,
    isActive: false,
    component: AddTestDetails,
    role: ['lab'],
    excludeRole : ['lab_technician'], 
  },
  {
    path: `${parentUrl}/setting/tests/list`,
    isActive: false,
    component: TestList,
    role: ['lab'],
    excludeRole : ['lab_technician'], 
  },
  {
    path: `${parentUrl}/setting/tests/categories`,
    isActive: true,
    component: CategoryList,
    role: ['lab'],
    excludeRole : ['lab_technician'], 
  },
  {
    path: `${parentUrl}/setting/tests/units`,
    isActive: false,
    component: UnitList,
    role: ['lab'],
    excludeRole : ['lab_technician'], 
  },
  {
    path: `${parentUrl}/setting/tests/sample-type`,
    isActive: false,
    component: SampleList,
    role: ['lab'],
    excludeRole : ['lab_technician'], 
  },
  {
    redirect: true,
    path: `${parentUrl}/setting/tests`,
    pathTo: `${parentUrl}/setting/tests/list`,
    component: TestList,
    role: ['lab'],
    excludeRole : ['lab_technician'], 
  },

  //add-appointment
  {
    path: `${parentUrl}/add-appointment`,
    exact: true,
    component: AddAppointment,
    role: ['lab'],
  },

  //referred-doctor
  {
    path: `${parentUrl}/referred-doctor-update`,
    exact: true,
    component: AddDoctor,
    role: ['lab'],
  },
  {
    path: `${parentUrl}/referred-doctor/add`,
    exact: true,
    component: AddDoctor,
    role: ['lab'],
  },
  {
    path: `${parentUrl}/referred-doctor/list`,
    exact: true,
    component: DoctorList,
    role: ['lab'],
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
    role: ['lab'],
  },
  {
    path: `${parentUrl}/edit-patient`,
    exact: true,
    component: AddPatient,
    role: ['lab'],
  },
  {
    path: `${parentUrl}/patients/add`,
    exact: true,
    component: AddPatient,
    role: ['lab'],
  },
  {
    path: `${parentUrl}/patients/list`,
    exact: true,
    component: PatientsList,
    role: ['lab'],
  },
  {
    redirect: true,
    path: `${parentUrl}/patients`,
    pathTo: `${parentUrl}/patients/list`,
    exact: true,
    component: PatientsList,
    role: ['lab'],
  },

  //dashboard
  {
    path: `${parentUrl}/dashboard/appointments`,
    exact: true,
    component: Appointments,
    role: ['lab'],
  },
  {
    path: `${parentUrl}/dashboard/lab-statistics`,
    exact: true,
    component: LabStatistics,
    role: ['lab'],
  },
  {
    path: `${parentUrl}/dashboard/overview`,
    isActive: true,
    component: PatientOverview,
    role: ['lab'],
  },
  {
    redirect: true,
    path: `${parentUrl}/dashboard`,
    pathTo: `${parentUrl}/dashboard/overview`,
    exact: true,
    component: PatientOverview,
    role: ['lab'],
  },
  {
    redirect: true,
    path: `${parentUrl}`,
    pathTo: `${parentUrl}/dashboard/overview`,
    role: ['lab'],
  },
];

export default labRoutes;
