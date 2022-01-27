import React from 'react';

const Details = ({ className, label, value, children }) => {
  return (
    <div className={`details ${className ? className : ''}`}>
      <label className="label mr-2">{`${label} : `}</label>
      {value && <label className="value">{value ? value : '-'}</label>}
      {children ? children : ''}
    </div>
  );
};

export default Details;
