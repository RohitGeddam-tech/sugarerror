import React, { useCallback, useContext } from 'react';
import Table from '../../../../components/Table/Table';
import { More, Checkbox, Filter, DownArrow } from '../../../../assets/icons';
import Popover from '../../../../components/Popover/Popover';
import { Link } from 'react-router-dom';
import { ProfileContext } from '../../../../context/context';

const PathLabTable = ({ setFilter, selectedFilters, openFilterAction, list, filter, isLoading, getSelectedData }) => {
  const { profile, setProfileData } = useContext(ProfileContext);

  const columnDefs = [
    {
      labelAsIcon: Checkbox,
      accessKey: 'checked',
      keyToCheck: 'uuid',
      renderIcon: Checkbox,
      isCheckbox: true,
      isMobile: false, // Show this content on mobile or not
    },
    {
      label: 'Date',
      accessKey: 'date',
      dateFilter: { show: true, selectDateRange: true },
      selectsDateRange: true,
    },
    {
      label: 'Lab ID',
      accessKey: 'lab_id',
      isMobile: false,
    },
    {
      label: 'Lab Name',
      accessKey: 'name',
      classes: 'main-content semi-bold',
    },
    {
      label: 'Mobile No.',
      accessKey: 'mobile_number',
      isMobile: false,
    },
    {
      label: 'Package Type',
      cursor:'pointer',
      renderFilterIcon: { icon: Filter, key: 'pac' },
      accessKey: 'package_type',
      isMobile: false,
    },
    {
      label: 'Source',
      accessKey: 'source',
      isMobile: false,
    },
    {
      label: 'Days Left',
      isMobile: false,
      cellRenderer: ({ days_left }) => days_left || '0',
    },
    {
      label: 'Credits Left',
      isMobile: false,
      cellRenderer: ({ credit_left }) => credit_left || '0',
    },
    {
      label: 'City',
      cursor:'pointer',
      renderFilterIcon: { icon: Filter, key: 'city' },
      accessKey: 'city',
      isMobile: false,
    },
    {
      label: 'Status',
      cursor:'pointer',
      renderFilterIcon: { icon: Filter, key: 'status' },
      cellRenderer: row =>
        row.formatted_status === 'Active' ? (
          <span className="status-active">Active</span>
        ) : (
          <span className="status-in active">Package Expired</span>
        ),
    },
    {
      label: '',
      accessKey: 'more',
      isMobile: false,
      cellRenderer: row => (
        <div className="d-flex align-items-center">
          <Popover button={<p className="table-icon">{More}</p>} className="view-detail-popover">
            <Link
              to={{ pathname: `/${localStorage.getItem('loginAs')}/lab-details/main-office-details` }}
              className={`hover-black py-1`}
              onClick={() => {
                localStorage.setItem('selectedLabId', row.uuid);
                setProfileData({ ...profile, selectedLabId: row.uuid });
              }}
            >
              View Lab Details
            </Link>
          </Popover>
        </div>
      ),
    },
  ];

  const getListPerPage = useCallback(pg => {
    setFilter({ ...filter, ...pg });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Table
      columnDefs={columnDefs}
      tableData={list.data}
      selectedFilters={selectedFilters}
      openFilterAction={openFilterAction}
      pagination={{ ...list.pagination, getListPerPage }}
      renderCheckbox={Checkbox}
      isButtonCard={<span className="next-arrow">{DownArrow}</span>}
      setFilter={setFilter}
      filter={filter}
      isLoading={isLoading}
      listName="labs"
      getSelectedData={getSelectedData}
    ></Table>
  );
};

export default PathLabTable;
