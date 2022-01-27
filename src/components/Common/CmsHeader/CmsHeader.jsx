import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { OutlinedButton, ContainedButton, TextButton } from '../../Buttons/Button';
import { GoBackIcon } from '../../../assets/icons';

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

const CmsHeader = ({ tabData = [], title, actions = [], goBack = false, history }) => {
  return (
    <section className="cms-container">
      <div className="cms-header">
        {goBack &&
          (goBack.url ? (
            <TextButton blue className="ml-5 mt-3 cmsTitle" link to={goBack.url}>
              <div className="d-flex align-items-center">
                {GoBackIcon}
                <p className="ml-2"> {goBack.label}</p>
              </div>
            </TextButton>
          ) : (
            <TextButton blue className="ml-5 mt-3 cmsTitle" onClick={() => history.goBack()}>
              <div className="d-flex align-items-center">
                {GoBackIcon}
                <p className="ml-2"> {goBack.label}</p>
              </div>
            </TextButton>
          ))}
        <h2 className="black-heading mb-3">{title}</h2>
        <div className="d-flex action-wrapper navOverflow">
          <ul className="nav">
            {tabData.map(
              (link, key) =>
                !link.redirect && (
                  <NavItem key={key} to={link.path}>
                    {link.label}
                  </NavItem>
                ),
            )}
          </ul>
          <div className="d-flex justify-content-end actions mHide">
            {actions.map(({ icon, label, outlined, containedButton, path }, ind) =>
              outlined ? (
                <OutlinedButton blue link to={path ? path : '#'} key={ind}>
                  <div className="d-flex align-items-center">
                    {icon}
                    <p className="ml-2">{label}</p>
                  </div>
                </OutlinedButton>
              ) : containedButton ? (
                <ContainedButton lightBlue link to={path ? path : '#'} className="ml-2" key={ind}>
                  <div className="d-flex align-items-center">
                    {icon}
                    <p className="ml-2">{label}</p>
                  </div>
                </ContainedButton>
              ) : (
                <></>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

CmsHeader.propTypes = {
  tabData: PropTypes.array,
  title: PropTypes.string,
};

export default CmsHeader;
