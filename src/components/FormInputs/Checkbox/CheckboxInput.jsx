import React from 'react';
import { CheckBoxBlue } from '../../../assets/icons';

function CheckboxInput({ name, label, value, checked = false, onClick, blue, red, className = '', disabled }) {
  let checkboxFillColor = blue ? 'blue' : 'red';
  return (
    <div className={`d-flex checkbox-input ${className} pure-material-checkbox ${disabled ? 'disabled' : ''}`}>
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onClick} //As it is an Input Element onChange method needed for any changeEvent.
      />
      <div
        className={`mr-3 checkbox-checked ${checkboxFillColor}`}
        onClick={() => {
          if (disabled) return;
          else onClick();
        }}
      >
        {CheckBoxBlue}
      </div>
      <label dangerouslySetInnerHTML={{ __html: label }}></label>
    </div>
  );
}

export default CheckboxInput;
