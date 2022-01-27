import React, { useRef } from 'react';
import Select from 'react-select';

const SelectInput = ({
  className = '',
  options = [],
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
  hidePlaceholder,
  defaultValue,
  isSearchable = false,
}) => {
  let parentClass = `input-group select-control-input ${error ? 'has-error' : ''} ${hasGrayBack ? 'background-gray' : ''} ${
    value && value.value ? 'has-value' : ''
  } ${hidePlaceholder ? 'hide-placeholder' : ''} ${disabled ? 'cursor-notAllowed' : ''}`;

  className += ` select-input `;
  const parentRef = useRef(null);
  return (
    <>
      <div className={parentClass} ref={parentRef}>
        <Select
          value={value}
          onChange={onChange}
          options={options}
          className={className}
          classNamePrefix="select-input"
          placeholder={<div>{''}</div>}
          onFocus={() => parentRef.current.classList.add('select-focused')}
          onBlur={() => parentRef.current.classList.remove('select-focused')}
          isClearable={isClearable}
          isMulti={isMulti}
          removeSelected={false}
          defaultValue={defaultValue}
          isDisabled={disabled}
          isLoading={isLoading}
          isSearchable={isSearchable}
        />
        <label className="select-placeholder">{placeholder}</label>
      </div>
      {error ? <p className="assistive-text error-text">{error}</p> : <p className="assistive-text"></p>}
    </>
  );
};
export default SelectInput;
