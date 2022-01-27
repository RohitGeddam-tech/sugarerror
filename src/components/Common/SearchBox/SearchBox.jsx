import React, { memo, useEffect, useState } from 'react';
import { Search } from '../../../assets/icons';
import useDebounce from '../../../hooks/useDebounce';
import TextInput from '../../FormInputs/TextInput/TextInput';

const SearchBox = ({ setFilter, filter, className = '', placeholder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  // const [results, setResults] = useState([]);
  // const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(
    () => {
      if (setFilter) {
        if (debouncedSearchTerm) {
          setFilter({ ...filter, search: debouncedSearchTerm, current_page: 1 });
          // setIsSearching(true);
          // searchCharacters(debouncedSearchTerm).then(results => {
          //   setIsSearching(false);
          //   setResults(results);
          // });
        } else {
          setFilter({ ...filter, search: '',current_page: 1 });
          // setResults([]);
        }
      }
    },
    [debouncedSearchTerm], // eslint-disable-line react-hooks/exhaustive-deps
    // Only call effect if debounced search term changes
  );

  return (
    <div className={`form-group search-input-wrapper ${className}`}>
      <TextInput
        placeholder={placeholder}
        value={searchTerm || ''} // Its taking null if no value is passed. Hence empty string passed
        onChange={e => setSearchTerm(e.target.value)}
        icon={Search}
        className="search-input"
      ></TextInput>
    </div>
  );
};

export default memo(SearchBox);
