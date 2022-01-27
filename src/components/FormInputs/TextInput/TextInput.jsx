import React, { useRef, useState } from 'react';
import { hidePasswordEye, showPasswordEye } from '../../../assets/icons';

function TextInput({
  type,
  placeholder,
  value,
  name,
  onChange,
  onBlur,
  error,
  disabled = false,
  icon,
  className = '',
  hasGrayBack = false,
  showPass,
  maxLength,
  ref,
}) {
  const [showPassword, setShowPassword] = useState(false);
  let hasError = error ? 'has-error' : '';
  className += ` form-control `;
  const inputRef = useRef(null);
  return (
    <>
      <div className={`input-group text-input ${hasError} ${hasGrayBack ? 'background-gray' : ''}`}>
        <input
          type={(showPass ? (!showPassword ? 'password' : 'text') : type) || 'text'}
          className={className}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete="off"
          ref={ref || inputRef}
          disabled={disabled}
          onBlur={onBlur}
          maxLength={maxLength}
        />
        <label className="input-placeholder">{placeholder}</label>
        {icon ? <span className="input-icon">{icon}</span> : <></>}
        {showPass ? (
          <span className="input-icon cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? hidePasswordEye : showPasswordEye}
          </span>
        ) : (
          <></>
        )}
        {error ? <p className="assistive-text error-text">{error}</p> : <p className="assistive-text"></p>}
      </div>
    </>
  );
}
export default TextInput;
