import React, { useState, useCallback, useEffect } from 'react';
import Paginate from '../Paginate/Paginate';
import { TextButton } from '../Buttons/Button';
import useWindowSize from '../../hooks/userWindowSize';
import TableCardModal from '../Modal/TableCardModal';
import { rupeeSymbol } from '../../utils/constants';
import CheckboxInput from '../FormInputs/Checkbox/CheckboxInput';

const Filter = ({ setFilter, renderFilterIcon, filter }) => {
  const [sortOrder, setSortOrder] = useState('desc');
  const handleSort = useCallback(() => {
    let value = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(value);
    let dataToSort = [...filter.sort];
    if (!dataToSort.some(item => item.key === renderFilterIcon.key)) {
      dataToSort.push({ key: renderFilterIcon.key, value });
    } else dataToSort = dataToSort.map(item => (item.key === renderFilterIcon.key ? { key: renderFilterIcon.key, value } : item));
    setFilter({ ...filter, sort: dataToSort });
  }, [sortOrder, filter]); // eslint-disable-line react-hooks/exhaustive-deps

  let ind = filter && filter.sort && filter.sort.findIndex(item => item.key === renderFilterIcon.key);
  let isSorted = ind !== -1 ? true : false;
  return (
    <p
      className={`table-icon d-inline ${isSorted ? 'is-sorted ' + (filter && filter.sort && filter.sort[ind].value) || '' : ''}`}
      onClick={handleSort}
    >
      {renderFilterIcon.icon}
    </p>
  );
};

const Table = ({
  title,
  columnDefs,
  tableData,
  selectedFilters,
  openFilterAction,
  pagination,
  footerLink,
  renderCheckbox,
  isButtonCard,
  getListData,
  setFilter,
  filter,
  blankDataMessage = 'No Records Found !',
  isLoading = false,
  listName = '',
  getSelectedData,
  tableClassName = '',
  MobileCardComponent,
}) => {
  const [width] = useWindowSize();
  const [actionObject, setActionObject] = useState();
  const [StatusFilterAction, setStatusFilterAction] = useState(false);
  // const [date, setDate] = useState(null);
  // const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [selectedData, setSelectedData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (selectAll || selectedData.length) getSelectedData(selectAll ? selectAll : selectedData);
  }, [selectAll, selectedData, getSelectedData]);

  const setCheckedData = useCallback(
    val => {
      let arr = [...selectedData];
      if (!arr.some(item => item === val)) {
        arr.push(val);
      } else {
        arr = arr.filter(item => item !== val);
      }
      setSelectedData([...arr]);
      if (arr.length >= 0 && arr.length !== tableData.length) {
        setSelectAll(false);
      } else {
        setSelectAll(true);
      }
    },
    [selectedData], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const setSelectAllData = useCallback(() => {
    const data = tableData.map(item => item.uuid);
    selectAll ? setSelectedData([]) : setSelectedData(data);
    setSelectAll(!selectAll);
  }, [selectAll]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {width > 768 ? (
        <table className={`custom-table ${tableClassName}`}>
          <thead>
            <tr>
              {columnDefs.map(({ label, cursor, labelAsIcon, renderFilterIcon, width, dateFilter, isCheckbox, keyToCheck }, key) => (
                <th key={key} width={width}>
                  {label ? (
                    selectedFilters && selectedFilters.includes(label) ? (
                      <span
                        onClick={() => openFilterAction(true, label)}
                        style={{
                          backgroundColor: 'rgba(166, 219, 252, 0.3)',
                          fontSize: 12,
                          padding: 5,
                          borderRadius: 5,
                          cursor: 'pointer',
                        }}
                      >
                        {label}{' '}
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M0.833452 1.74002C2.18012 3.46669 4.66679 6.66669 4.66679 6.66669V10.6667C4.66679 11.0334 4.96678 11.3334 5.33345 11.3334H6.66679C7.03345 11.3334 7.33345 11.0334 7.33345 10.6667V6.66669C7.33345 6.66669 9.81345 3.46669 11.1601 1.74002C11.5001 1.30002 11.1868 0.666687 10.6335 0.666687H1.36012C0.806785 0.666687 0.493452 1.30002 0.833452 1.74002Z"
                            fill="#B7B7B7"
                          />
                        </svg>
                      </span>
                    ) : (
                      <span style={{ cursor: cursor ? cursor : '' }} onClick={() => (openFilterAction ? openFilterAction(true, label) : '')}>
                        {label}
                      </span>
                    )
                  ) : isCheckbox ? (
                    <CheckboxInput
                      checked={selectAll}
                      value={selectAll}
                      blue
                      className={!selectAll && selectedData.length > 0 ? 'checkbox-some-checked' : ''}
                      onClick={() => setSelectAllData()}
                    />
                  ) : (
                    <p>{labelAsIcon}</p>
                  )}{' '}
                  {renderFilterIcon ? <Filter filter={filter} setFilter={setFilter} renderFilterIcon={renderFilterIcon} /> : ''}
                  {dateFilter?.show ? <label></label> : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columnDefs.length} className="text-center mb-4">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : tableData && tableData.length ? (
              tableData.map((data, key) => (
                <tr key={Math.random()}>
                  {columnDefs.map(({ accessKey, renderIcon, cellRenderer, defaultValue, isAmount = false, isCheckbox, keyToCheck }) => {
                    let keys = accessKey ? accessKey.split('.') || [] : null,
                      dataValue = Array.isArray(keys) ? (keys.length > 1 ? data[`${keys[0]}`][`${keys[1]}`] : data[`${keys[0]}`]) : null;
                    return cellRenderer ? (
                      <td key={Math.random()}>{cellRenderer(data, key)}</td>
                    ) : dataValue || defaultValue ? (
                      <td key={Math.random()}>
                        {isAmount ? rupeeSymbol + ' ' : ''}
                        {dataValue || defaultValue}
                      </td>
                    ) : isCheckbox ? (
                      <td key={Math.random()}>
                        {/* <p className="table-icon">{renderIcon}</p> */}
                        <CheckboxInput
                          checked={selectAll ? selectAll : selectedData.some(item => item === data[keyToCheck])}
                          value={selectAll ? selectAll : selectedData.some(item => item === data[keyToCheck])}
                          blue
                          onClick={() => setCheckedData(data[keyToCheck])}
                        />
                      </td>
                    ) : renderIcon ? (
                      <td key={Math.random()}>
                        <p className="table-icon">{renderIcon}</p>
                      </td>
                    ) : (
                      <td key={Math.random()}>-</td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columnDefs.length} className="text-center">
                  {blankDataMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <div className="table-mobile">
          {isLoading ? (
            <div className="text-center mb-4">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : tableData && tableData.length ? (
            tableData.map((data, ind) => (
              <div key={ind} className="data-card d-flex align-items-center" onClick={() =>
                isButtonCard && setActionObject({
                  columnDefs,
                  tableData: data,
                  isModalOpen: true,
                })
              }>
                {renderCheckbox ? <p className="table-icon card-mobile-checkbox mr-4">{renderCheckbox}</p> : <></>}
                <div className="w-100">
                  {columnDefs.map(
                    (
                      {
                        label,
                        cellRenderer,
                        accessKey,
                        renderIcon,
                        renderIconText = '',
                        classes = '',
                        isMobile = true,
                        isCheckbox = false,
                        defaultValue,
                        isAmount = false,
                      },
                      key,
                    ) => {
                      let keys = accessKey ? accessKey.split('.') || [] : null,
                        dataValue = Array.isArray(keys) ? (keys.length > 1 ? data[`${keys[0]}`][`${keys[1]}`] : data[`${keys[0]}`]) : null;
                      return (
                        <React.Fragment key={key}>
                          {!renderIcon && isMobile ? (
                            <ul className="card-row single-detail">
                              <li className="label">{`${label} : `}</li>
                              {cellRenderer ? (
                                <li className={`value ${classes}`}>{cellRenderer(data, key)}</li>
                              ) : dataValue || defaultValue ? (
                                <li className={`value ${classes}`}>
                                  {isAmount ? rupeeSymbol + ' ' : ''}
                                  {dataValue || defaultValue}
                                </li>
                              ) : null}
                            </ul>
                          ) : renderIcon && !isCheckbox && isMobile ? (
                            <div className="data-card-action pt-2 mt-3">
                              <p className="table-icon d-flex justify-content-center align-items-center">
                                {renderIcon} {renderIconText ? <p className="icon-text">{renderIconText}</p> : ''}
                              </p>
                            </div>
                          ) : null}
                        </React.Fragment>
                      );
                    },
                  )}
                </div>
                {isButtonCard ? (
                  <p
                    className="table-icon card-mobile-button ml-auto modal-link"
                  >
                    {isButtonCard}
                  </p>
                ) : (
                  <></>
                )}
              </div>
            ))
          ) : (
            <table>
              <tbody>
                <tr>
                  <td colSpan={columnDefs.length} className="text-center">
                    {blankDataMessage}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}
      {pagination && pagination.total ? <Paginate width={width} data={pagination} filter={filter} listName={listName}></Paginate> : <></>}
      {footerLink && tableData && tableData.length ? (
        <div className="d-flex justify-content-center table-footer">
          <TextButton
            blue
            withIcon
            className="semi-bold"
            link
            to={{
              pathname: footerLink,
              title: title,
            }}
            title={title}
          >
            VIEW ALL
          </TextButton>
        </div>
      ) : (
        ''
      )}
      <TableCardModal actionObject={actionObject} MobileCardComponent={MobileCardComponent}></TableCardModal>
    </>
  );
};
export default Table;
