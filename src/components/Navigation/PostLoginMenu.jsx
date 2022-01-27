import React, { useContext } from 'react';
import { bool } from 'prop-types';
import { DownArrow } from '../../assets/icons';
import Container from '../Wrappers/Container';
import Logo from './Logo';
import Burger from './Burger';
import { getInitials } from '../../utils/custom';
import AccountDropdown from './AccountDropdown/AccountDropdown';
import { ProfileContext } from '../../context/context';

const PostLoginMenu = ({ open, setOpen, width, location }) => {
  const { profile } = useContext(ProfileContext);
  const { role, first_name, last_name } = profile ? (profile.selectedRole ? profile.selectedRole : {}) : {};
  const firstName = localStorage.getItem('first_name');
  const lastName = localStorage.getItem('last_name');

  return (
    <nav className="navbar sticky-top navbar-expand-lg justify-content-between cms-navbar">
      <Container fluid>
        <div className="logo-wrapper">
          <Burger open={open} setOpen={setOpen}></Burger>
          <Logo></Logo>
          <div className="login-home-wrapper">
            <AccountDropdown
              button={
                <div className="user-profile d-flex align-items-center">
                  <p className={`small user-img role_${role?.name}`}>
                    {getInitials(`${firstName ?? first_name ?? ''} ${lastName ?? last_name ?? ''}`)}
                  </p>
                  <p>{DownArrow}</p>
                </div>
              }
            ></AccountDropdown>
          </div>
        </div>
        {open ? (
          <></>
        ) : (
          location.pathname !== '/login-as' && (
            <div className="d-flex align-items-center nav-btns-wrapper">
              {width > 768 ? (
                <>
                  {/* <div className="notification-wrapper">
                    <p className="unread-notification"></p>
                    <p>{Notification}</p>
                  </div> */}
                  {/* <p className="vertical-divider"></p> */}
                  <AccountDropdown
                    button={
                      <div className="user-profile d-flex align-items-center px-4 user-profile_hover">
                        <p className={`user-img small role_${role?.name}`}>
                          {getInitials(`${firstName ?? first_name ?? ''} ${lastName ?? last_name ?? ''}`)}
                        </p>
                        <div className="user-details flex px-2">
                          <p className="user-name">{`${firstName ?? first_name ?? ''} ${lastName ?? last_name ?? ''}`}</p>
                        </div>
                        <p>{DownArrow}</p>
                      </div>
                    }
                  ></AccountDropdown>
                </>
              ) : (
                <></>
              )}
            </div>
          )
        )}
      </Container>
    </nav>
  );
};
PostLoginMenu.propTypes = {
  open: bool.isRequired,
};
export default PostLoginMenu;
