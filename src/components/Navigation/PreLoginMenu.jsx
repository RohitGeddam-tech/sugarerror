import React from 'react';
import { bool } from 'prop-types';
import { NavLink } from 'react-router-dom';
import { ContainedButton, OutlinedButton } from '../Buttons/Button';
import Container from '../Wrappers/Container';
import Burger from './Burger';
import Logo from './Logo';

const NavItem = ({ children, to = '' }) => {
  return (
    <li className="nav-item">
      <NavLink to={to} exact activeClassName="is-active" className="nav-link mr-2">
        {children}
      </NavLink>
    </li>
  );
};

const PreLoginMenu = ({ open, setOpen, width, match }) => {
  const isHidden = open ? true : false;
  return (
    <nav className="navbar sticky-top navbar-expand-lg justify-content-between">
      <Container>
        <div className="logo-wrapper">
          <Burger open={open} setOpen={setOpen}></Burger>
          <Logo isLink></Logo>
          <div className="login-home-wrapper">
            {open ? (
              <NavLink to="/">
                <span className="home-icon"></span>
              </NavLink>
            ) : (
              <OutlinedButton link to="/sign-in" className="login-btn">
                Login
              </OutlinedButton>
            )}
          </div>
        </div>
        <div
          className={`navlink-wrapper collapse navbar-collapse ${open ? 'show' : ''}`}
          id="navbarSupportedContent"
          open={open}
          aria-hidden={!isHidden}
        >
          <ul className="navbar-nav ml-auto">
            {/* <NavItem to="/path-labs">For Path Labs</NavItem>
            <NavItem to="/patients">For Patients</NavItem>
            <NavItem to="/doctors">For Doctors</NavItem> */}
            {/* <NavItem to="/blogs">Blogs</NavItem> */}
            <NavItem to="/about">About Us</NavItem>
            <NavItem to="/contact">Contact Us</NavItem>
          </ul>
          <div className="d-inline nav-btns-wrapper">
            <OutlinedButton link to="/sign-in" className="mr-2 nav-login-btn">
              Login
            </OutlinedButton>
            <ContainedButton link to="/packages" red className="mr-2 trial-btn">
              Start Free Trial
            </ContainedButton>
          </div>
        </div>
      </Container>
    </nav>
  );
};

PreLoginMenu.propTypes = {
  open: bool.isRequired,
};

export default PreLoginMenu;
