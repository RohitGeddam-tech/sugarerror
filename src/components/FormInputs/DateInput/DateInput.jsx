import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const DateInput = ({
  value,
  onChange,
  showTime,
  error,
  placeholder,
  disabled = false,
  icon,
  className = '',
  hasGrayBack,
  returnFormat,
  hidden,
  selectRange,
  showYearMonthPicker,
  disablePastDates,
  disableFutureDates,
}) => {
  const [isFocused, setFocus] = useState(false);
  let hasError = error ? 'has-error' : '';
  let hasGray = hasGrayBack ? 'background-gray' : '';

  const handleDateChange = date => date && onChange(Array.isArray(date) ? date : moment(date).format(returnFormat));

  return (
    <div className="date-input-wrapper">
      {hidden ? (
        <DatePicker
          className={`form-control hidden`}
          selected={value ? new Date(value) : null}
          onChange={handleDateChange}
          timeIntervals={15}
          dateFormat={showTime ? 'yyyy/MM/dd h:mm aa' : 'yyyy/MM/dd'}
          disabled={disabled}
          showTimeInput={showTime}
          onFocus={() => setFocus(true)}
          startDate={selectRange?.startDate}
          endDate={selectRange?.endDate}
          selectsRange={selectRange?.range}
          showMonthDropdown
          showYearDropdown
          minDate={disablePastDates && moment().toDate()}
          maxDate={disableFutureDates && new Date()}
        />
      ) : showYearMonthPicker ? (
        <DatePicker
          className="form-control"
          selected={value ? new Date(value) : null}
          onChange={handleDateChange}
          dateFormat="MM-yyyy"
          showMonthYearPicker
          minDate={disablePastDates && moment().toDate()}
          maxDate={disableFutureDates && new Date()}
        />
      ) : (
        <div className={`input-group date-input ${hasError} ${hasGray} `}>
          <DatePicker
            className="form-control"
            selected={value ? new Date(value) : null}
            onChange={handleDateChange}
            timeIntervals={15}
            dateFormat={showTime ? 'yyyy/MM/dd h:mm aa' : 'yyyy/MM/dd'}
            disabled={disabled}
            showTimeInput={showTime}
            onFocus={() => setFocus(true)}
            startDate={selectRange?.startDate}
            endDate={selectRange?.endDate}
            selectsRange={selectRange?.range}
            showMonthDropdown
            showYearDropdown
            minDate={disablePastDates && moment().toDate()}
            maxDate={disableFutureDates && new Date()}
          />
          <label
            className={`${
              value
                ? 'label-has-value'
                : '' || (isFocused && error)
                ? 'label-has-error label-has-value'
                : '' || isFocused
                ? 'label-focused label-has-value'
                : ''
            }`}
          >
            {placeholder}
          </label>
          {icon ? <span className="input-icon">{icon}</span> : <></>}
          {error ? <p className="assistive-text error-text">{error}</p> : <></>}
        </div>
      )}
    </div>
  );
};
export default DateInput;
