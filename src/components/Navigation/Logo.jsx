import React from 'react';
import { logo } from '../../assets/index';
import { Link } from 'react-router-dom';

export default function Logo({ isLink }) {
  const loginAs = localStorage.getItem('loginAs');
  return (
    <>
      {isLink ? (
        <Link to={`/${loginAs ? loginAs : ''}`} className="navbar-brand">
          <img src={logo} alt="Sugarlogger" width="163px" height="40px"/>
        </Link>
      ) : (
        <div className="navbar-brand">
          <img src={logo} alt="Sugarlogger" />
        </div>
      )}
    </>
  );
}
