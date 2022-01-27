import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { getInitials } from '../../utils/custom';
import Logo from '../Navigation/Logo';
import { ProfileContext } from '../../context/context';
import { LeftArrow } from '../../assets/icons';

const activeRoutesFromChild = [
  {
    parent: `/${localStorage.getItem('loginAs')}/setting/lab-details`,
    child: [
      `/${localStorage.getItem('loginAs')}/setting/edit-main-office-details`,
      `/${localStorage.getItem('loginAs')}/setting/add-branch-details`,
     ],
  },
  {
    parent: `/${localStorage.getItem('loginAs')}/setting/tests`,
    child: [
      `/${localStorage.getItem('loginAs')}/setting/tests/list`,
      `/${localStorage.getItem('loginAs')}/setting/tests/categories`,
      `/${localStorage.getItem('loginAs')}/setting/tests/units`,
      `/${localStorage.getItem('loginAs')}/setting/tests/sample-type`,
      `/${localStorage.getItem('loginAs')}/setting/add-test`,
    ],
  },
  {
    parent: `/${localStorage.getItem('loginAs')}/setting/test-sets`,
    child: [
      `/${localStorage.getItem('loginAs')}/setting/test-set/${localStorage.getItem('selectedLabType')}/${localStorage.getItem('selectedBranchId')}/${localStorage.getItem('selectedTestSetId')}/tests`,
      `/${localStorage.getItem('loginAs')}/setting/test-set/${localStorage.getItem('selectedLabType')}/${localStorage.getItem('selectedLabId')}/${localStorage.getItem('selectedTestSetId')}/tests`,
    ],
  },
  {
    parent: `/${localStorage.getItem('loginAs')}/path-labs`,
    child: [
      `/${localStorage.getItem('loginAs')}/lab-details/main-office-details`,
      `/${localStorage.getItem('loginAs')}/lab-details/branch-details`,
      `/${localStorage.getItem('loginAs')}/lab-details/branch-details/add-branch-details`,
      `/${localStorage.getItem('loginAs')}/branch-settings/${localStorage.getItem('selectedBranchId')}/name-and-address`,
      `/${localStorage.getItem('loginAs')}/branch-settings/${localStorage.getItem('selectedBranchId')}/branch-users`,
      ],
  },
  {
    parent: `/${localStorage.getItem('loginAs')}/referred-doctor`,
    child: [`/${localStorage.getItem('loginAs')}/referred-doctor-update`],
  },
  {
    parent: `/${localStorage.getItem('loginAs')}/patients`,
    child: [`/${localStorage.getItem('loginAs')}/report-preview`, `/${localStorage.getItem('loginAs')}/edit-patient`],
  },
  {
    parent: `/${localStorage.getItem('loginAs')}/reports-and-bills`,
    child: [`/${localStorage.getItem('loginAs')}/view-report`],
  },
];

const NavItem = ({ children, to = '' }) => {
  const { pathname } = useLocation();

  const parentObj = activeRoutesFromChild.find(item => item.child.includes(pathname));

  let className = parentObj && parentObj.parent === to ? 'is-active' : '';
  
  return (
    <li className="nav-item">
      <NavLink to={to} activeClassName="is-active" className={`${className} nav-link d-flex align-items-center`}>
        {children}
      </NavLink>
    </li>
  );
};
function Sidebar({ links = [], sideBarState }) {
  const { profile } = useContext(ProfileContext);
  const { pathname } = useLocation();
  const loginAs = localStorage.getItem('loginAs');
  const [isSetting, setSetting] = useState(false);
  const firstName = localStorage.getItem('first_name');
  const lastName = localStorage.getItem('last_name');

  useEffect(() => {
    let path = pathname.split('/')[2];
    setSetting(path === 'setting');
  }, [pathname]);

  const { lab_name, branch_name = null, role, first_name, last_name } = profile ? (profile.selectedRole ? profile.selectedRole : {}) : {};

  return (
    <nav className={`sidebar ${sideBarState ? 'open' : ''}`}>
      <div className="sidebar-sticky">
        {sideBarState && (
          <div className="sidebar-open-logo">
            <div className="d-flex justify-content-between">
              <Logo></Logo>
              <span className="cross-icon mr-1"></span>
            </div>
          </div>
        )}
        <div className="user-profile d-flex align-items-center pt-4 px-4">
          <p className={`user-img role_${role?.name || ''}`}>
            {getInitials(`${firstName ?? first_name ?? ''} ${lastName ?? last_name ?? ''}`)}
          </p>
          <div className="user-details flex px-2">
            <p className="user-name">{`${firstName ?? first_name ?? ''} ${lastName ?? last_name ?? ''}`}</p>
            <p className="user-role">{role ? role.formatted_name : ''}</p>
            <div className="d-flex">
              {lab_name && <p className="user-role">{`${lab_name} `}</p>}
              {branch_name && <p className="user-role ml-1">{` - ${branch_name}`}</p>}
            </div>
          </div>
        </div>
        <hr />
        {isSetting ? (
          <div className="px-2 mb-3">
            <Link className="back-to" link="true" to={`/${loginAs}`}>
              <span className="mr-2">{LeftArrow}</span>BACK TO DASHBOARD
            </Link>
          </div>
        ) : (
          ''
        )}
        <ul className="nav flex-column px-2">
          {links.filter((link)=> !(link.excludeRole?.length && link.excludeRole.includes(role?.actual_role))).map(
            (link, key) =>
              !link.redirect &&
              link.role.includes(pathname.split('/')[1]) &&
              (link.role.includes(loginAs) && link.isSidebarMenu && !isSetting ? (
                <NavItem key={key} to={link.path}>
                  {link.icon}
                  <p className="ml-4">{link.label}</p>
                </NavItem>
              ) : link.role.includes(loginAs) && link.isSetting && isSetting && !link.noSidebarLabel ? (
                <NavItem key={key} to={link.path}>
                  <p className="ml-4">{link.label}</p>
                </NavItem>
              ) : null), // If we pass Empty Fragment. We also need to add key for the same. Hence making it to null
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Sidebar;
