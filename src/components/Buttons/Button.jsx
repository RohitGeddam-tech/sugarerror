import React from 'react';
import { NavLink } from 'react-router-dom';

function TextButton({
  children,
  className = '',
  red,
  white,
  blue,
  disabled = false,
  onClick,
  dataToggle,
  dataTarget,
  type,
  link,
  to = '',
  loading = false,
  download,
  title,
}) {
  var classes = `btn btn-text ${className} 
  ${red ? 'red-btn' : ''} 
  ${white ? 'white-btn' : ''}  
  ${blue ? 'blue' : ''}`;
  if ((download || link) && disabled) {
    classes = `${classes} disabled`;
  }
  return download ? (
    <button to={download} className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ) : link ? (
    <NavLink
      to={to || (to.pathname && to.title)}
      className={classes}
      disabled={disabled}
      title={title}
      onClick={e => (disabled ? e.preventDefault() : onClick && onClick())}
    >
      {children}
    </NavLink>
  ) : (
    <button
      type={type ? type : 'button'}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      data-toggle={dataToggle}
      data-target={dataTarget}
    >
      {loading ? (
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

function ContainedButton({
  children,
  className = '',
  red,
  black,
  lightBlue,
  darkBlue,
  disabled = false,
  onClick,
  dataToggle,
  dataTarget,
  dataDismiss,
  dataLabel,
  link,
  to = '',
  type,
  loading = false,
  download,
}) {
  var classes = `btn btn-container ${className} ${red ? 'red-btn' : ''} ${black ? 'black-btn' : ''} ${lightBlue ? 'light-blue-btn' : ''} ${
    darkBlue ? 'dark-blue-btn' : ''
  }`;
  if ((download || link) && disabled) {
    classes = `${classes} disabled`;
  }
  return download ? (
    <button to={download} className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ) : link ? (
    <NavLink to={to} className={classes} disabled={disabled} onClick={e => (disabled ? e.preventDefault() : onClick && onClick())}>
      {children}
    </NavLink>
  ) : (
    <button
      type={type ? type : 'button'}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      data-toggle={dataToggle}
      data-target={dataTarget}
      data-dismiss={dataDismiss}
      aria-label={dataLabel}
    >
      {loading ? (
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

function OutlinedButton({
  children,
  className = '',
  red,
  black,
  blue,
  onClick,
  dataToggle,
  dataTarget,
  dataDismiss,
  dataLabel,
  disabled = false,
  link,
  to,
  type,
  loading = false,
  download,
}) {
  var classes = `btn btn-outline ${className} ${red ? 'red-outline' : ''} ${blue ? 'blue-outline' : ''}`;
  if ((download || link) && disabled) {
    classes = `${classes} disabled`;
  }
  return download ? (
    <button to={download} className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ) : link ? (
    <NavLink to={to} className={classes} disabled={disabled} onClick={e => (disabled ? e.preventDefault() : onClick && onClick())}>
      {children}
    </NavLink>
  ) : (
    <button
      type={type ? type : 'button'}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      data-toggle={dataToggle}
      data-target={dataTarget}
      data-dismiss={dataDismiss}
      aria-label={dataLabel}
    >
      {loading ? (
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export { TextButton, ContainedButton, OutlinedButton };
