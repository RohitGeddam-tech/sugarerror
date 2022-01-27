import React, { useCallback, useContext, useEffect, useState } from 'react';
import { OutlinedButton } from '../../../components/Buttons/Button';
import { CalendarFilter } from '../../../assets/icons';
import Table from '../../../components/Table/Table';
import { ProfileContext } from '../../../context/context';
import { fetchRequest } from '../../../utils/api';
import { rupeeSymbol } from '../../../utils/constants';
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import {  NextArrow } from '../../../assets/icons';
import MobileCard from '../MobileCard';

const ReportBills = () => {
  /* eslint-disable no-unused-vars */
  const { profile } = useContext(ProfileContext);
  const [reportList, setReportList] = useState({ data: [], pagination: {} });
  const [filter, setFilter] = useState({
    per_page: 15,
    current_page: 1,
    sort: [],
    selectedDate: moment().subtract(1, 'year').format('YYYY-MM-DD'),
    date_from: moment().subtract(1, 'year').format('YYYY-MM-DD'),
    date_to: moment().format('YYYY-MM-DD'),
  });
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({ start: moment(), end: moment() });

  const reportsColumnDefs = [
    {
      label: 'Date / Time',
      width: '7%',
      dateFilter: { show: true, selectDateRange: false },
      accessKey: 'created_at',
    },
    {
      label: 'Patient Name',
      width: '12%',
      accessKey: 'patient.full_name',
      classes: 'main-content semi-bold',
      isMobile : false
    },
    {
      label: 'Lab Name',
      width: '18%',
      accessKey: 'lab.formatted_lab_name',
    },
    {
      label: 'Referral',
      width: '12%',
      cellRenderer: ({ referred_by }) => referred_by?.full_name || 'Self',
      isMobile : false
    },
    {
      label: 'Tests',
      width: '20%',
      accessKey: 'package_name',
      cellRenderer: ({ tests }) => tests.map((test, ind) => (ind === tests.length - 1 ? test : test + ', ')),
    },
    {
      label: 'Cost',
      width: '10%',
      cellRenderer: ({ total_amount }) => `${rupeeSymbol} ${total_amount}`,
      isMobile : false
    },
    {
      label: 'Status',
      width: '10%',
      cellRenderer: ({ appointment_status }) => (
        <OutlinedButton className={`patient-status-btn ${appointment_status.name}`}>{appointment_status.formatted_name}</OutlinedButton>
      ),
    },
    {
      label: 'Action',
      width: '12%',
      isMobile : false,
      cellRenderer: row => {
        return (
          <div className="d-flex align-items-center">
            <OutlinedButton
              blue
              link
              to={{
                pathname: `/patient/view-report`,
                state: { reportId: row.uuid },
              }}
              disabled={!row.view_report}
            >
              View Report
            </OutlinedButton>
          </div>
        );
      },
      isActionColumn : true
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const getData = useCallback(() => {
    setLoading(true);
    const { per_page = 15, current_page, date_from, date_to, sort } = filter;
    if (per_page)
      (async () => {
        let url = `/patient/${profile.selectedRole.uuid}/reports${date_from ? `?date_from=${date_from}` : ''}${
          date_to && date_to !== 'Invalid date' ? `&date_to=${date_to}` : ''
        }&per_page=${per_page}${current_page ? `&page=${current_page}` : ''}${
          sort && sort.length ? sort.map(item => `&${item.key}=${item.value}`).join('') : ''
        }`;
        const res = await fetchRequest({ url, method: 'GET', isAuth: true });
        if (res && res.status === 200) {
          setLoading(false);
          const { data, meta } = await res.json();
          setReportList({ data, pagination: meta.pagination });
          return data;
        } else {
          setLoading(false);
        }
        return;
      })();
  }, [filter, profile]);

  useEffect(() => {
    const { date_from, date_to } = filter;
    getData({ date_from, date_to });
  }, [filter, getData]);

  const getListPerPage = useCallback(pg => {
    setFilter(filter => ({ ...filter, ...pg }));
  }, []);

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
    <div className="paper card list-container report-bills-container">
      <div className="content-header">
        <div className="row">
          <div className="col-6 col-md-9">
            <p className="semi-bold title">All Reports</p>
          </div>
          <div className="col-md-3 col-12 customDatePicker-wrapper">
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
        </div>
      </div>
      <div className="content-body">
        <Table
          columnDefs={reportsColumnDefs}
          tableData={reportList.data}
          pagination={{ ...reportList.pagination, getListPerPage }}
          isButtonCard={<span>{NextArrow}</span>}
          MobileCardComponent={MobileCard}
          setFilter={setFilter}
          filter={filter}
          isLoading={loading}
          listName="reports"
        ></Table>
      </div>
    </div>
  );
};

export default ReportBills;
