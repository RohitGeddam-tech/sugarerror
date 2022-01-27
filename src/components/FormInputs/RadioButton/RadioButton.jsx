import React from 'react';
import { CheckedRadioButtonIcon, RadioButtonIcon } from '../../../assets/icons';

function RadioButton({ className, name, label, value, checked = false, onClick, blue, red }) {
  return (
    <div className={`d-flex radio-button ${className}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onClick} //As it is an Input Element onChange method needed for any changeEvent.
      />
      <div className="mr-2 radio-checked" onClick={onClick}>
        {checked ? CheckedRadioButtonIcon : RadioButtonIcon}
      </div>
      <label dangerouslySetInnerHTML={{ __html: label }}></label>
    </div>
  );
}

export default RadioButton;
