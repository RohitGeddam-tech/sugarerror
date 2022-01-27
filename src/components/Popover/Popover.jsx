import React from 'react';

const Popover = ({ button, children, className = '' }) => {
  return (
    <div className={`nav-item dropdown popover-dropdown`}>
      <span className="nav-item nav-link dropdown-toggle" id="bd-versions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
        {button}
      </span>
      <div className={`dropdown-menu dropdown-menu-md-right ${className}`} aria-labelledby="bd-versions">
        {children}
      </div>
    </div>
  );
};

export default Popover;
