import React, { useRef } from 'react';
import AsyncSelect from 'react-select/async';

const AsyncSelectInput = ({
  className = '',
  options = [],
  noOptionsMessage,
  value,
  onChange,
  placeholder,
  error,
  hasGrayBack = false,
  isMulti = false,
  hideSelectedOptions = true,
  isClearable = true,
  disabled,
  isLoading,
  FilterData,
}) => {
  let parentClass = `input-group select-control-input ${error ? 'has-error' : ''} ${hasGrayBack ? 'background-gray' : ''} ${
    value && value.value ? 'has-value' : ''
  } ${disabled ? 'cursor-notAllowed' : ''}`;

  className += ` select-input `;
  const parentRef = useRef(null);

  const loadOptions = inputValue => {
    return inputValue.length && FilterData(inputValue);
  };

  return (
    <>
      <div className={parentClass} ref={parentRef}>
        <AsyncSelect
          value={value}
          defaultOptions={options}
          noOptionsMessage={() => noOptionsMessage}
          onChange={onChange}
          loadOptions={loadOptions}
          className={className}
          classNamePrefix="select-input"
          placeholder={<div>{''}</div>}
          onFocus={() => parentRef.current.classList.add('select-focused')}
          onBlur={() => parentRef.current.classList.remove('select-focused')}
          isClearable={isClearable}
          isMulti={isMulti}
          removeSelected={false}
          isDisabled={disabled}
          isLoading={isLoading}
        />
        <label className="select-placeholder">{placeholder}</label>
      </div>
      {error ? <p className="assistive-text error-text">{error}</p> : <p className="assistive-text"></p>}
    </>
  );
};
export default AsyncSelectInput;
