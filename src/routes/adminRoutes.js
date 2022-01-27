import loadable from '@loadable/component';

const Overview = loadable(() => import('../pages/Admin/Dashboard/Overview/Overview'));
const DemoRequest = loadable(() => import('../pages/Admin/Dashboard/DemoRequest/DemoRequest'));
const Statistics = '../pages/Admin/Dashboard/Statistics/Statistics';
const PathLabsList = '../pages/Admin/PathLabs/List/PathLabsList';
const AddPathLab = loadable(() => import('../pages/Admin/PathLabs/Add/AddPathLab'));
const AddPackages = loadable(() => import('../pages/Admin/Packages/Add/AddPackages'));
const PackageList = loadable(() => import('../pages/Admin/Packages/List/PackageList'));
const PatientList = loadable(() => import('../pages/Admin/Patients/List/PatientList'));
const ContactLeads = loadable(() => import('../pages/Admin/ContactLeads/ContactLeads'));
const UserManagement = loadable(() => import('../pages/Admin/Settings/UserManagement/UserManagement'));
const MyProfile = loadable(() => import('../pages/MyProfile/MyProfile'));
const MainOfficeList = loadable(() => import('../pages/LabDetails/MainOfficeDetails/MainOfficeList'));
const BranchList = loadable(() => import('../pages/LabDetails/BranchDetails/BranchList'));
const BranchAdd = loadable(() => import('../pages/LabDetails/BranchDetails/BranchAdd'));
const PackageDetails = loadable(() => import('../pages/LabDetails/PackageDetails/PackageDetails'));
const BranchSettings = loadable(() => import('../pages/LabDetails/BranchDetails/BranchSettings/BranchSettings'));
const EditContactLead = loadable(() => import('../pages/Admin/ContactLeads/EditContactLead'));
const CategoryList = loadable(() => import('../components/Common/Tests/List/Category/CategoryList'));
const UnitList = loadable(() => import('../components/Common/Tests/List/Unit/UnitList'));
const SampleList = loadable(() => import('../components/Common/Tests/List/SampleType/SampleList'));
const TestList = loadable(() => import('../components/Common/Tests/List/TestList'));
const AddTestDetails = loadable(() => import('../components/Common/Tests/Add/AddTestDetails'));
const UpgradePackage = loadable(() => import('../pages/LabDetails/PackageDetails/UpgradePackage'));
const ViewTest = loadable(() => import('../components/Common/Tests/Add/ViewTest'));

const parentUrl = '/super-admin';

const adminRoutes = [
  {
    path: `${parentUrl}/upgrade-package`,
    isActive: false,
    component: UpgradePackage,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/lab-details/package-details`,
    exact: true,
    component: PackageDetails,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/lab-details/branch-details/add-branch-details`,
    exact: true,
    component: BranchAdd,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/branch-settings/:branchId/:option`,
    exact: true,
    component: BranchSettings,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/lab-details/branch-details`,
    exact: true,
    component: BranchList,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/lab-details/main-office-details`,
    exact: true,
    component: MainOfficeList,
    role: ['super-admin'],
  },
  //settings
  {
    path: `${parentUrl}/setting/my-profile`,
    exact: true,
    component: MyProfile,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/setting/user-management`,
    exact: true,
    component: UserManagement,
    role: ['super-admin'],
  },
  {
    redirect: true,
    path: `${parentUrl}/setting`,
    pathTo: `${parentUrl}/setting/user-management`,
    exact: true,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/contact-leads/:leadId`,
    isActive: false,
    component: EditContactLead,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/contact-leads`,
    isActive: false,
    component: ContactLeads,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/dashboard/demo-request`,
    isActive: false,
    component: DemoRequest,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/dashboard/overview`,
    isActive: true,
    component: Overview,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/dashboard/statistics`,
    isActive: false,
    component: Statistics,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/dashboard/demo-request`,
    isActive: false,
    component: DemoRequest,
    role: ['super-admin'],
  },
  {
    redirect: true,
    path: `${parentUrl}/dashboard`,
    pathTo: `${parentUrl}/dashboard/overview`,
    component: Overview,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/path-labs/add`,
    exact: true,
    component: AddPathLab,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/path-labs/list`,
    exact: true,
    component: PathLabsList,
    role: ['super-admin'],
  },
  {
    redirect: true,
    path: `${parentUrl}/path-labs`,
    pathTo: `${parentUrl}/path-labs/list`,
    exact: true,
    component: PathLabsList,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/edit-test/:testId`,
    exact: true,
    component: AddTestDetails,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/view-test/:testId`,
    exact: true,
    component: ViewTest,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/add-test`,
    isActive: false,
    component: AddTestDetails,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/tests/list`,
    isActive: false,
    component: TestList,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/tests/categories`,
    isActive: true,
    component: CategoryList,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/tests/units`,
    isActive: false,
    component: UnitList,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/tests/sample-type`,
    isActive: false,
    component: SampleList,
    role: ['super-admin'],
  },
  {
    redirect: true,
    path: `${parentUrl}/tests`,
    pathTo: `${parentUrl}/tests/list`,
    component: TestList,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/packages/add`,
    exact: true,
    component: AddPackages,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/packages/list`,
    exact: true,
    component: PackageList,
    role: ['super-admin'],
  },
  {
    redirect: true,
    path: `${parentUrl}/packages`,
    pathTo: `${parentUrl}/packages/list`,
    exact: true,
    component: PackageList,
    role: ['super-admin'],
  },
  {
    path: `${parentUrl}/patient/list`,
    exact: true,
    component: PatientList,
    role: ['super-admin'],
  },
  {
    redirect: true,
    path: `${parentUrl}/patient`,
    pathTo: `${parentUrl}/patient/list`,
    exact: true,
    component: PatientList,
    role: ['super-admin'],
  },
  {
    redirect: true,
    path: `${parentUrl}`,
    pathTo: `${parentUrl}/dashboard/overview`,
    role: ['super-admin'],
  },
];

export default adminRoutes;
