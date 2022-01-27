import React, { useCallback, useEffect, useState } from 'react';
import SelectInput from '../../../../components/FormInputs/SelectInput/SelectInput';
import Card from '../../../../components/Common/Card/Card';
import Table from '../../../../components/Table/Table';
import { More, Restore, CalendarFilter } from '../../../../assets/icons';
import { fetchRequest } from '../../../../utils/api';
// import DateInput from '../../../../components/FormInputs/DateInput/DateInput';
import moment from 'moment';
import Popover from '../../../../components/Popover/Popover';
import Notification from '../../../../components/Notification/Notification';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

const conversionList = [
  { key: 'converted', label: 'Converted' },
  { key: 'not_converted', label: 'Not Converted' },
  { key: 'trial_given', label: 'Trial Given' },
  { key: 'unable_to_contact', label: 'Unable to Contact' },
];

const defaultLoadingState = {
  all: false,
  statusList: false,
  demoRequestList: false,
};

const DemoRequest = () => {
  /* eslint-disable no-unused-vars */
  const [statusList, setStatusList] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [filter, setFilter] = useState({
    date_from: moment().format('YYYY-MM-DD'),
    date_to: moment().format('YYYY-MM-DD'),
  });
  const [stats, setStats] = useState([]);
  const [demoRequestList, setDemoRequest] = useState([]);
  const [loading, setLoading] = useState({
    ...defaultLoadingState,
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const columnDefs = [
    {
      label: 'Date',
      dateFilter: { show: true, selectDateRange: true },
      accessKey: 'preferred_date',
    },
    {
      label: 'Time',
      accessKey: 'preferred_time',
    },
    {
      label: 'Lab Name',
      accessKey: 'lab_name',
    },
    {
      label: 'Name',
      accessKey: 'first_name',
      cellRenderer: row => `${row.first_name} ${row.last_name}`,
    },
    {
      label: 'Mobile No.',
      accessKey: 'contact_number',
    },
    {
      label: 'City',
      accessKey: 'city',
    },
    {
      label: 'Conversion',
      accessKey: 'conversion',
      cellRenderer: row => <span className={`status-${row.status.name}`}>{row.status.formatted_name}</span>,
    },
    {
      label: 'Action',
      accessKey: 'more',
      renderIcon: More,
      cellRenderer: row => (
        <div className="d-flex align-items-center">
          {Restore}
          <Popover button={<p className="table-icon">{More}</p>}>
            {conversionList.map(
              (item, key) =>
                item.key !== row.status.name && (
                  <div
                    key={key}
                    onClick={() => (item.key ? handleUpdateStatus(row.uuid, item.key) : null)}
                    className={`conversion status-${item.key} py-1`}
                  >
                    {item.label}
                  </div>
                ),
            )}
          </Popover>
        </div>
      ),
    },
  ];
  const [state, setState] = useState({ start: moment(), end: moment() });

  useEffect(() => {
    getStatus();
    getStats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateLoadingState = (key, isLoading) => {
    const tempLoader = { ...loading };
    tempLoader[key] = isLoading;
    setLoading(tempLoader);
  };

  const getStatus = () => {
    updateLoadingState('statusList', true);
    (async () => {
      const statusRes = await fetchRequest({ url: '/super_admin/demo_statuses', method: 'GET', isAuth: true });
      if (statusRes && statusRes.status === 200) {
        updateLoadingState('statusList', false);

        const { data } = await statusRes.json();
        let statusList = [];
        statusList = [
          { label: 'All Demos', value: ' ' },
          ...data.map(item => ({
            label: item.formatted_name,
            value: item.name,
            ...item,
          })),
        ];
        setStatusList(statusList);
        setSelectedStatus();
      } else {
        updateLoadingState('statusList', false);
      }
      return;
    })();
  };

  const getStats = () => {
    updateLoadingState('all', true);
    (async () => {
      const res = await fetchRequest({
        url: `/super_admin/todays_book_demo_stats`,
        method: 'GET',
        isAuth: true,
      });

      if (res && res.status === 200) {
        updateLoadingState('all', false);
        const data = await res.json();
        setStats(data.data);
        return data;
      } else {
        updateLoadingState('all', false);
      }
      return;
    })();
  };

  const getDemoRequest = useCallback(async () => {
    updateLoadingState('demoRequestList', true);
    const { date_from, date_to } = filter;
    let url = `/super_admin/demo_requests${date_from ? `?date_from=${date_from}` : ''}${
      date_to && date_to !== 'Invalid date' ? `&date_to=${date_to}` : ''
    }&status=${selectedStatus ? selectedStatus.value : ''}`;
    const demoRequestRes = await fetchRequest({
      url,
      method: 'GET',
      isAuth: true,
    });
    if (demoRequestRes && demoRequestRes.status === 200) {
      updateLoadingState('demoRequestList', false);
      const { data } = await demoRequestRes.json();
      setDemoRequest(data);
    } else {
      updateLoadingState('demoRequestList', false);
    }
  }, [filter, selectedStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (filter) getDemoRequest();
  }, [filter, getDemoRequest]);

  useEffect(() => {
    if (selectedStatus && selectedStatus.value) getDemoRequest();
  }, [selectedStatus, getDemoRequest]);

  const handleUpdateStatus = async (id, status) => {
    setNotification({ show: false, message: '', type: '' });
    const demoRequestRes = await fetchRequest({
      url: `/super_admin/demo_request/${id}`,
      method: 'PUT',
      isAuth: true,
      body: { status },
    });
    if (demoRequestRes && demoRequestRes.status === 200) {
      setNotification({ show: true, message: 'Demo request status updated successfully.', type: 'success' });
      getDemoRequest(filter);
    } else {
      const errObj = await demoRequestRes.json();
      demoRequestRes.status !== 422 && errObj.message && setNotification({ show: true, message: errObj.message, type: 'error' });
    }
  };

  const handleCallback = (start, end) => {
    setState({ start, end });
    setFilter({ ...filter, date_from: moment(start._d).format('YYYY-MM-DD'), date_to: moment(end._d).format('YYYY-MM-DD') });
  };

  const label = filter.date_from && moment(filter.date_from).format('DD-MM-YYYY') + ' to ' + moment(filter.date_to).format('DD-MM-YYYY');

  const ranges = {
    Today: [moment().toDate(), moment().toDate()],
    Yesterday: [moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()],
    'Last 7 Days': [moment().subtract(6, 'days').toDate(), moment().toDate()],
    Tomorrow: [moment().add(1, 'days').toDate(), moment().add(1, 'days').toDate()],
    'Next 7 Days': [moment().add(1, 'days').toDate(), moment().add(7, 'days').toDate()],
  };

  return (
    <div className="dashboard-container">
      <Notification {...notification} />
      <div className="row mb-3">
        <div className="col-md-3 col-12">
          <DateRangePicker
            className="customDatePicker"
            initialSettings={{
              maxDate: moment().add(1, 'months').format('MM/DD/YYYY'),
              startDate: moment().toDate(),
              endDate: moment().toDate(),
              ranges: ranges,
            }}
            onCallback={handleCallback}
          >
            <div className="customDatePicker-innerwrapper">
              <span className={label ? 'range-value' : 'range-placeholder'}>{label ? label : 'Select Range'}</span>
              <label className="table-icon d-inline">{CalendarFilter}</label>
            </div>
          </DateRangePicker>
          {/* <DateInput value={selectedDate} onChange={date => setDate(date)} returnFormat={'YYYY-MM-DD'} /> */}
        </div>
        <div className="col-md-3 col-12">
          <SelectInput
            options={statusList}
            value={selectedStatus || statusList[0]}
            onChange={value => setSelectedStatus(value)}
            isClearable={false}
            isLoading={loading['statusList']}
            isSearchable={false}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-9 col-12">
          <Card title="Demo Request">
            <Table columnDefs={columnDefs} tableData={demoRequestList} isLoading={loading['all'] || loading['demoRequestList']} />
          </Card>
        </div>
        <div className="col-md-3 col-12">
          <Card title="Converted Demos today" cardType="number" centerHeader={true} isLoading={loading['all']}>
            {stats.converted}
          </Card>
          <Card title="Total Demo’s given today" cardType="number" centerHeader={true} isLoading={loading['all']}>
            {stats.total_demo_given_count}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DemoRequest;
