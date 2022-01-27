import React, { useCallback, useEffect, useState } from 'react';
import { Checkbox, DownArrow, Filter, CalendarFilter } from '../../../../assets/icons';
// import PathLabTable from './PathLabTable';
import useWindowSize from '../../../../hooks/userWindowSize';
import SearchBox from '../../../../components/Common/SearchBox/SearchBox';
import Table from '../../../../components/Table/Table';
import { fetchRequest } from '../../../../utils/api';
import ExportExcel from '../../../../components/ExportExcel/ExportExcel';
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

const patientColumnDefs = [
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
    dateFilter: { show: true, selectDateRange: true },
    selectsDateRange: true,
    accessKey: 'date',
  },
  {
    label: 'Name',
    accessKey: 'name',
  },
  {
    label: 'Patients in the account',
    accessKey: 'members',
    cellRenderer: row => row.members + ' members',
  },
  {
    label: 'Mobile No.',
    accessKey: 'mobile',
  },
  {
    label: 'Email ID',
    accessKey: 'email',
  },
];

const PatientList = () => {
  const [width] = useWindowSize();
  const [patientList, setPatientList] = useState({ data: [], pagination: {} });
  const [filter, setFilter] = useState({
    per_page: 15,
    sort: [],
    current_page: 1,
    date_from: moment().subtract(1, 'year').format('YYYY-MM-DD'),
    date_to: moment().format('YYYY-MM-DD'),
  });
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  /* eslint-disable no-unused-vars */
  const [state, setState] = useState({ start: moment(), end: moment() });

  const getPatientList = useCallback(() => {
    setLoading(true);
    const { per_page = 15, current_page, search, date_from, date_to, sort } = filter;
    if (per_page)
      (async () => {
        let url = `/super_admin/patients?per_page=${per_page}${current_page ? `&page=${current_page}` : ''}${
          search ? `&search=${search}` : ''
        }${date_from ? `&date_from=${date_from}` : ''}${date_to ? `&date_to=${date_to}` : ''}${
          sort && sort.length ? sort.map(item => `&${item.key}=${item.value}`) : ''
        }`;
        const res = await fetchRequest({ url, method: 'GET', isAuth: true });

        // Branch Filter
        if (res && res.status === 200) {
          setLoading(false);
          const { data, meta } = await res.json();
          setPatientList({ data, pagination: meta.pagination });
          return data;
        } else {
          setLoading(false);
        }
        return;
      })();
  }, [filter]);

  useEffect(() => {
    getPatientList();
  }, [filter, getPatientList]);

  const getListPerPage = useCallback(pg => {
    setFilter(filter => ({ ...filter, ...pg }));
  }, []);

  const getSelectedData = useCallback(data => setSelectedData(data), []);

  const handleCallback = (start, end) => {
    setState({ start, end });
    setFilter({
      ...filter,
      date_from: moment(start._d).format('YYYY-MM-DD'),
      date_to: moment(end._d).format('YYYY-MM-DD'),
      current_page: 1,
    });
  };

  const label = filter.date_from && moment(filter.date_from).format('DD-MM-YYYY') + ' to ' + moment(filter.date_to).format('DD-MM-YYYY');

  const ranges = {
    Today: [moment().toDate(), moment().toDate()],
    Yesterday: [moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()],
    'This Month': [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
    'Last 7 Days': [moment().subtract(6, 'days').toDate(), moment().toDate()],
    'Last 30 Days': [moment().subtract(29, 'days').toDate(), moment().toDate()],
    'Last 6 Months': [moment().subtract(6, 'months').toDate(), moment().toDate()],
    'Last 1 Year': [moment().subtract(1, 'year').toDate(), moment().toDate()],
  };

  return (
    <div className="paper card list-patient-container list-container">
      <div className="content-header">
        <div className="row">
          <div className="col-6 col-md-2">
            <p className="semi-bold title">All Patients</p>
          </div>
          <div className="col-6 col-md-2">
            <div className="form-group text-right">
              <ExportExcel path={'/super_admin/patients_export'} filter={filter} selectedData={selectedData} />
            </div>
          </div>
          <div className="col-md-4 customDatePicker-wrapper">
            <DateRangePicker
              className="customDatePicker"
              id="customDatePicker"
              initialSettings={{
                maxDate: new Date(),
                startDate: moment().subtract(1, 'year').toDate(),
                endDate: moment().toDate(),
                ranges: ranges,
                autoUpdateInput: true,
              }}
              onCallback={handleCallback}
            >
              <div className="customDatePicker-innerwrapper">
                <span className={label ? 'range-value' : 'range-placeholder'}>{label ? label : 'Select Range'}</span>
                <label className="table-icon d-inline">{CalendarFilter}</label>
              </div>
            </DateRangePicker>
          </div>
          <div className="push-4 col-md-4">
            <SearchBox setFilter={setFilter} filter={filter} placeholder="Search by Name or Mobile No." />
          </div>
        </div>
        {width <= 768 ? (
          <div className="d-flex justify-content-end mr-2 filter">
            <p className="mr-1">{Filter}</p> <p>Filter</p>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="content-body">
        <Table
          columnDefs={patientColumnDefs}
          tableData={patientList.data}
          pagination={{ ...patientList.pagination, getListPerPage }}
          isButtonCard={<span className="next-arrow">{DownArrow}</span>}
          setFilter={setFilter}
          filter={filter}
          isLoading={loading}
          listName="patients"
          getSelectedData={getSelectedData}
        ></Table>
      </div>
    </div>
  );
};
export default PatientList;
