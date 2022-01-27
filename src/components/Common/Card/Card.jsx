import React from 'react';
import PropTypes from 'prop-types';
import SelectInput from '../../FormInputs/SelectInput/SelectInput';
import SearchBox from '../SearchBox/SearchBox';

const Card = ({
  title,
  children,
  list = [],
  value,
  cardType = 'table',
  centerHeader = false,
  cardName = '',
  className = '',
  searchBox,
  onSelectInputChange,
  isLoading = false,
  input,
}) => {
  return (
    <div className={`paper paper-card ${cardType === 'number' ? 'number-card' : ''} ${cardName} ${className}`}>
      <div className={`content-header d-flex align-items-baseline ${centerHeader ? 'justify-content-center' : 'justify-content-between'}`}>
        <p className="title">{title}</p>
        {input ? (
          input
        ) : list.length ? (
          <div className="select-wrapper">
            <SelectInput
              options={list}
              value={value}
              onChange={value => onSelectInputChange(value)}
              isClearable={false}
              isSearchable={false}
            />
          </div>
        ) : (
          <></>
        )}
        {searchBox ? <SearchBox /> : <></>}
      </div>
      {isLoading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : cardType === 'number' ? (
        <div className="count font-weight-bold">{children}</div>
      ) : (
        children
      )}
    </div>
  );
};

Card.propTypes = { title: PropTypes.string, content: PropTypes.string, list: PropTypes.array };

export default Card;
