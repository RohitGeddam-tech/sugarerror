import React from 'react';
import { Link } from 'react-router-dom';

var Tab = ({ handleClick, isActive, data }) => {
  return (
    <li onClick={handleClick} className={`nav-tab-link ${isActive ? 'active' : ''}`}>
      <span>{data.name}</span>
      <span className="nav-border"></span>
    </li>
  );
};
var CmsTab = ({ handleClick, isActive, data }) => {
  return (
    <li onClick={handleClick} className={`nav-tab-link ${isActive ? 'active' : ''}`}>
      <Link to={data.path}>{data.label}</Link>
      <span className="nav-border"></span>
    </li>
  );
};
var NavTab = ({ tabData, activeTab, onTabChange, children, cms }) => {
  return (
    <div>
      <ul className="nav nav-tabs">
        {tabData.map((tab, ind) => {
          return cms ? (
            <CmsTab
              key={ind} //Key Added
              data={tab}
              isActive={activeTab ? activeTab === tab : tab.isActive}
              handleClick={() => {
                onTabChange(tab);
              }}
            />
          ) : (
            <Tab
              key={ind} //Key Added
              data={tab}
              isActive={activeTab ? activeTab === tab : tab.isActive}
              handleClick={() => {
                onTabChange(tab);
              }}
            />
          );
        })}
      </ul>
      {children}
    </div>
  );
};
export default NavTab;
