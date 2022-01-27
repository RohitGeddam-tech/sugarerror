import React from 'react';

export const TableFilter = ({ typeData = [], TypeFilter = [] }) => {
  return (
    <div className="filter_container_type">
      <div className="filter_subcontainer_reff">
        {typeData.map(items => {
          return (
            <div key={items.formatted}>
              <label>
                <input
                  onChange={e => pushFilter(e, 'Type', items.formatted)}
                  checked={TypeFilter.includes(items.formatted) ? true : false}
                  type="checkbox"
                />{' '}
                {items.name}
              </label>
            </div>
          );
        })}
      </div>
      <div className="filter_options">
        <span onClick={() => clearAllTypeFilter('remove_filter')} style={{ color: 'rgba(223, 116, 106, 1)' }}>
          Remove filter
        </span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span onClick={() => clearAllTypeFilter('cancel')}>Cancel</span>
          {TypeFilter.length === 0 ? (
            <span style={{ paddingLeft: 10 }}>Apply</span>
          ) : (
            <span onClick={() => getData()} style={{ paddingLeft: 10, color: 'blue' }}>
              Apply
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
