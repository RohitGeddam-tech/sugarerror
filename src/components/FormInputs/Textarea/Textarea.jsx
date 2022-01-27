import React from 'react';

function Textarea({ placeholder, rows = 2, value, name, onChange, error, disabled = false, icon, className = '', maxLength, hasGrayBack }) {
  let hasError = error ? 'has-error' : '';
  className += ` form-control ${value ? 'has-value' : ''} ${hasGrayBack ? 'background-gray' : ''}`;
  // const inputRef = useRef(null);
  // if (error) {
  //   inputRef.current.focus();
  // }
  return (
    <>
      <div className={`input-group text-area ${hasError}`}>
        <textarea className={className} value={value} rows={rows} onChange={onChange} maxLength={maxLength} />
        <label>{placeholder}</label>
        {icon ? <span className="input-icon">{icon}</span> : <></>}
      </div>
      {error ? <p className="assistive-text error-text">{error}</p> : <p className="assistive-text"></p>}
    </>
  );
}

export default Textarea;
