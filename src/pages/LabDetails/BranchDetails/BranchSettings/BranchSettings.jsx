import React, { useState, useEffect, useContext } from 'react';
import { useParams, NavLink, Link } from 'react-router-dom';
import NameAndAddress from './NameAndAddress';
import BranchUsers from './User/BranchUsers';
import Report from './Report';
import RouteGenerator from '../../../../layouts/RouteGenerator';
import { fetchRequest } from '../../../../utils/api';
import { ProfileContext } from '../../../../context/context';
import { LeftArrow } from '../../../../assets/icons';

const NavItem = ({ children, to = '' }) => {
  return (
    <li className="nav-item">
      <NavLink to={to} activeClassName="is-active" className="nav-link d-flex flex-column ">
        {children}
        <span className="nav-border"></span>
      </NavLink>
    </li>
  );
};

const BranchSettings = () => {
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);
  const [labId, setLabId] = useState(); //lab_group uuid from profile api
  const { branchId } = useParams();
  const [branchDetails, setBranchDetails] = useState({});
  const [tabData, setTabData] = useState([]);

  useEffect(() => {
    localStorage.setItem('selectedBranchId', branchId);
  }, [branchId]);

  useEffect(() => {
    if (profile && loginAs === 'lab-admin') {
      setLabId(profile.selectedRole.uuid);
      setTabData([
        {
          label: 'Name & Address',
          url: `/lab-admin/setting/branch-settings/${branchId}/name-and-address`,
          path: `/lab-admin/setting/branch-settings/:branchId/name-and-address`,
          exact: true,
          key: 'branch-settings',
          component: NameAndAddress,
        },
        {
          label: 'Branch Users',
          url: `/lab-admin/setting/branch-settings/${branchId}/branch-users`,
          path: `/lab-admin/setting/branch-settings/:branchId/branch-users`,
          exact: true,
          key: 'branch-settings',
          component: BranchUsers,
        },
        {
          label: 'Report Letterhead & Sign',
          url: `/lab-admin/setting/branch-settings/${branchId}/report`,
          path: `/lab-admin/setting/branch-settings/:branchId/report`,
          exact: true,
          key: 'branch-settings',
          component: Report,
        },
      ]);
    } else if (profile && (loginAs === 'super-admin' || loginAs === 'assistant-admin')) {
      setLabId(profile.selectedLabId);
      setTabData([
        {
          label: 'Name & Address',
          url: `/${loginAs}/branch-settings/${branchId}/name-and-address`,
          path: `/${loginAs}/branch-settings/:branchId/name-and-address`,
          exact: true,
          component: NameAndAddress,
        },
        {
          label: 'Branch Users',
          url: `/${loginAs}/branch-settings/${branchId}/branch-users`,
          path: `/${loginAs}/branch-settings/:branchId/branch-users`,
          exact: true,
          component: BranchUsers,
        },
      ]);
    }
  }, [profile, branchId, loginAs]);

  useEffect(() => {
    if (labId && branchId)
      (async () => {
        const res = await fetchRequest({ url: `/lab_group/${labId}/lab/${branchId}`, method: 'GET', isAuth: true });
        if (res && res.status === 200) {
          const { data } = await res.json();
          setBranchDetails(data);
          return data;
        }
        return;
      })();
  }, [labId, branchId]);

  return (
    <>
      <section className="cms-container">
        <div className="cms-header ">
          {loginAs !== 'lab-admin' ? (
            <Link className="back-to ml-5" link="true" to={`/${loginAs}/lab-details/branch-details`}>
              <span className="mr-2">{LeftArrow}</span>BACK TO LAB DETAILS
            </Link>
          ) : (
            <></>
          )}
          <h2 className="black-heading mb-3">{branchDetails && branchDetails.name} Branch Setting</h2>
          <div className="d-flex action-wrapper">
            <ul className="nav branch-setting-nav">
              {tabData.map(
                (link, key) =>
                  !link.redirect && (
                    <NavItem key={key} to={link.url}>
                      {link.label}
                    </NavItem>
                  ),
              )}
            </ul>
          </div>
        </div>
      </section>
      <main role="main" className="cms-container">
        <div className="cms-body">
          <RouteGenerator routes={tabData} />
        </div>
      </main>
    </>
  );
};
export default BranchSettings;
