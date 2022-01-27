import React, { useState, useEffect } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import RouteGenerator from '../../../../layouts/RouteGenerator';
import { LeftArrow } from '../../../../assets/icons';
import { TextButton } from '../../../../components/Buttons/Button';
import TestSetTests from './TestSetTests';

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

const TestSetView = props => {
  const loginAs = localStorage.getItem('loginAs');
  const { branchId, labId, testSetId, type } = useParams();
  const [tabData, setTabData] = useState([]);
  const setName = props && props?.location?.state?.nameset?.name;

  useEffect(() => {
    localStorage.setItem('selectedTestSetId', testSetId);
    localStorage.setItem('selectedLabType', type);
    if (type === 'lab-group') {
      localStorage.setItem('selectedLabId', labId);
      setTabData([
        {
          url: `/lab-admin/setting/test-set/:type/${labId}/${testSetId}/tests`,
          path: `/lab-admin/setting/test-set/:type/:labId/:testSetId/tests`,
          exact: true,
          key: 'test-set',
          component: TestSetTests,
        },
      ]);
    } else if (type === 'lab') {
      localStorage.setItem('selectedBranchId',branchId);
      if (loginAs === 'lab-admin') {
        setTabData([
          {
            url: `/lab-admin/setting/test-set/:type/${branchId}/${testSetId}/tests`,
            path: `/lab-admin/setting/test-set/:type/:branchId/:testSetId/tests`,
            exact: true,
            key: 'test-set',
            component: TestSetTests,
          },
        ]);
      } else {
        setTabData([
          {
            url: `/lab/setting/test-set/:type/${branchId}/${testSetId}/tests`,
            path: `/lab/setting/test-set/:type/:branchId/:testSetId/tests`,
            exact: true,
            key: 'test-set',
            component: TestSetTests,
          },
        ]);
      }
    }
  }, [type, loginAs, labId, testSetId, branchId]);

  return (
    <>
      <section className="cms-container">
        <div className="cms-header">
          <TextButton onClick={() => props.history.goBack()} blue className="ml-5 mt-3">
            <div className="d-flex">
              <span className="mr-2">{LeftArrow}</span>
              <p>BACK TO SET LIST</p>
            </div>
          </TextButton>
          <h2 className="black-heading mb-3 text-capitalize">{setName ?? ''}</h2>
          <div className="d-flex action-wrapper">
            <ul className="nav">
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
export default TestSetView;
