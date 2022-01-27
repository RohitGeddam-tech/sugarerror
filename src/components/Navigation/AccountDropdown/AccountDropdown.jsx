import React, { useContext, useCallback } from 'react';
import { Setting, Edit, Power, SwitchAccount } from '../../../assets/icons';
import { Link } from 'react-router-dom';
import { ProfileContext } from '../../../context/context';

const AccountDropdown = ({ button }) => {
  const { profile, setProfileData } = useContext(ProfileContext);
  const { roles = [] } = profile ? profile : {};

  const removeSelectedRole = useCallback(
    item => {
      localStorage.removeItem('loginAs');
      localStorage.removeItem('selectedRole');
      setProfileData({ selectedRole: {} });
    },
    [setProfileData],
  );
  return (
    <div className="nav-item dropdown account-dropdown">
      <span
        className="nav-item nav-link dropdown-toggle"
        // href="#"
        id="bd-versions"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="true"
      >
        {button}
      </span>
      <div className="dropdown-menu dropdown-menu-md-right" aria-labelledby="bd-versions">
        <div className="account-more-option">
          {roles.length ? (
            <Link to={`/login-as`} className="d-flex options" onClick={removeSelectedRole}>
              <p className="ml-1 mr-4">{SwitchAccount}</p>
              <p>Switch Accounts</p>
            </Link>
          ) : (
            <></>
          )}
          <Link to={`/${localStorage.getItem('loginAs')}/setting`} className="d-flex options">
            <p className="ml-2 mr-4">{Setting}</p>
            <p>Settings</p>
          </Link>
          <Link
            to={{ pathname: `/${localStorage.getItem('loginAs')}/setting/my-profile`, state: { changePassword: true } }}
            className="d-flex options"
          >
            <p className="ml-2 mr-4">{Edit}</p>
            <p>Change Password</p>
          </Link>
          <div
            className="d-flex cursor-pointer logout-option"
            onClick={() => {
              localStorage.clear();
              window.location.href = '/sign-in';
            }}
          >
            <p className="ml-2 mr-4">{Power}</p>
            <span className="logout-btn">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AccountDropdown;
