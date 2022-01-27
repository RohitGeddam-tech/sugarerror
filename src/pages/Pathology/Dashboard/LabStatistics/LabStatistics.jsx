import React, { useContext, useEffect, useState } from 'react';
import Table from '../../../../components/Table/Table';
import { More, CalendarFilter } from '../../../../assets/icons';
import Card from '../../../../components/Common/Card/Card';
import LineChart from '../../../../components/Graphs/LineChart';
import PieChart from '../../../../components/Graphs/PieChart';
import { ProfileContext } from '../../../../context/context';
import { fetchRequest } from '../../../../utils/api';
import { rupeeSymbol } from '../../../../utils/constants';
import { compilePieChartData } from '../../../../utils/custom';
// import DateInput from '../../../../components/FormInputs/DateInput/DateInput';
import moment from 'moment';
import Popover from '../../../../components/Popover/Popover';
import EditAmountModal from '../../Patients/List/EditAmountModal';
import Notification from '../../../../components/Notification/Notification';
import { DatePicker } from '@material-ui/pickers';

const bestSellerHeaders = [
  {
    label: 'Sr. No.',
    cellRenderer: (row, ind) => ind + 1 + '. ',
  },
  {
    label: 'Name',
    accessKey: 'name',
  },
  {
    label: 'Quantity',
    accessKey: 'quantity',
  },
];

// const currentYear = {
//   label: 'Apr 2020',
//   year: 2020,
//   data: [3, 12, 18, 26, 40],
//   fill: false,
//   borderColor: '#d34537',
//   pointBackgroundColor: '#d34537',
//   lineTension: 0.5,
//   pointRadius: 4,
//   borderWidth: 2,
// };

// const getData = () => {
//   let data = [];
//   for (let i = 0; i < 5; i++) {
//     data.push({ date_time: 'Apr 29, 2020', name: 'To Alok Labs', amount: '₹ 400' });
//   }
//   return data;
// };

const paymentDropdown = [
  { label: 'Receivable', value: 'receivable' },
  // { label: 'Payable', value: 'paid' },
];

// const yearDropdown = [
//   { label: 'Apr 2019', value: 2019 },
//   { label: 'Apr 2018', value: 2018 },
//   { label: 'Apr 2017', value: 2017 },
// ];

const defaultFilters = {
  paymentFilter: Object.assign({}, paymentDropdown[0]),
  month_filter: moment().format('YYYY-MM'),
  compare_with_filter: moment().subtract(1, 'M').format('YYYY-MM'),
};

const defaultLoadingState = {
  all: false,
  stateData: false,
  paymentData: false,
  revenueComparisonData: false,
};
const LabStatistics = props => {
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);
  const [statsData, setStatsData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [filter, setFilters] = useState({ ...defaultFilters });
  const { paymentFilter } = filter;
  const [loading, setLoading] = useState({ ...defaultLoadingState });
  const [editAmountObject, setEditAmountObject] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [paymentHeaders, setPaymentHeaders] = useState([
    {
      label: 'Date / Time',
      accessKey: 'created_at',
      classes: 'main-content semi-bold',
      width: '20%',
    },
    {
      label: 'Name',
      accessKey: 'name',
      width: '30%',
    },
    {
      label: 'Amount',
      width: '25%',
      cellRenderer: ({ total_balance, total_paid }) =>
        filter.paymentFilter.value === 'receivable' ? `${rupeeSymbol} ${total_balance}` : `${rupeeSymbol} ${total_paid}`,
    },
    {
      label: '',
      accessKey: 'actions',
      renderIcon: More,
      width: '4%',
      cellRenderer: ({ total_balance, uuid, total_paid, total_payable, branch_uuid }) => (
        <div className="d-flex justify-content-end">
          {/* {editAmount ? (
            <></>
          ) : (
            <span style={parseInt(total_balance) > 0 ? {} : { marginRight: '27px' }}>
              {rupeeSymbol} {total_balance}
            </span>
          )} */}
          {parseInt(total_balance) > 0 && (
            <Popover button={<p className="table-icon">{More}</p>} className="edit-patient-popover">
              <div
                onClick={() => {
                  setEditAmountObject({
                    title: '',
                    confirmAction: 'Save',
                    isModalOpen: true,
                    url: `/lab/${
                      loginAs === 'lab-admin' && branch_uuid ? branch_uuid : profile.selectedRole.uuid
                    }/patient_entry/${uuid}/payments`,
                    method: 'PUT',
                    isEdit: true,
                    data: {
                      total_balance,
                      total_paid,
                      total_payable,
                    },
                    setNotification: setNotification,
                    handleSuccess: data => {
                      data.message &&
                        setNotification({
                          show: true,
                          message: data.message,
                          type: 'success',
                        });
                      setTimeout(() => getPaymentsData(), 2000);
                    },
                  });
                }}
                className="small-text py-1 cursor-pointer"
              >
                Edit Amount
              </div>
            </Popover>
          )}
        </div>
      ),
    },
  ]);
  const [revenueComparisonData, setRevenueComparisonData] = useState({});

  const { month_filter, compare_with_filter } = filter;

  useEffect(() => {
    /* eslint-disable no-unused-vars */
    let temp =
      loginAs === 'lab-admin'
        ? paymentHeaders.splice(2, 0, {
            label: 'Branch',
            accessKey: 'branch',
            width: '20%',
          })
        : paymentHeaders;
    setPaymentHeaders(paymentHeaders => [...paymentHeaders]);
  }, [loginAs]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (profile) {
      updateLoadingState('paymentData', true);
      // getRevenueComparisonData();
      // getStatsData();
      // getPaymentsData();
    }
  }, [profile]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (profile) {
      getStatsData();
      getRevenueComparisonData();
      getPaymentsData();
    }
  }, [month_filter, profile]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (profile) {
      getRevenueComparisonData();
    }
  }, [compare_with_filter, profile]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateLoadingState = (key, isLoading) => {
    const tempLoader = { ...loading };
    tempLoader[key] = isLoading;
    setLoading(tempLoader);
  };

  const getStatsData = () => {
    (async () => {
      updateLoadingState('stateData', true);
      const res = await fetchRequest({
        url: `${loginAs === 'lab-admin' ? '/lab_group' : '/lab'}/${profile.selectedRole.uuid}/dashboard/stats?month_filter=${
          filter.month_filter
        }`,
        method: 'GET',
        isAuth: true,
      });
      if (res) {
        updateLoadingState('paymentData', false);
        updateLoadingState('stateData', false);
      }
      if (res && res.status === 200) {
        const data = await res.json();
        setStatsData(data.data);
        data.data.payment.data.length && setPaymentData([...data.data.payment.data]);
        if (data.data.revenue_per_branch_graph) {
          data.data.revenue_per_branch_graph = compilePieChartData(data.data.revenue_per_branch_graph);
        }
        return data;
      }
      return;
    })();
  };

  const getRevenueComparisonData = () => {
    (async () => {
      setNotification({ show: false, message: '', type: '' });
      if (filter.month_filter !== filter.compare_with_filter) {
        updateLoadingState('revenueComparisonData', true);
        const res = await fetchRequest({
          url: `${loginAs === 'lab-admin' ? '/lab_group' : '/lab'}/${
            profile.selectedRole.uuid
          }/dashboard/stats/revenue_comparison?month_filter=${filter.month_filter}&compare_with_filter=${filter.compare_with_filter}`,
          method: 'GET',
          isAuth: true,
        });
        if (res) {
          updateLoadingState('revenueComparisonData', false);
        }
        if (res && res.status === 200) {
          const { data } = await res.json();
          if (data.dataset?.length && data.labels) {
            let chartData = {
              datasets: [
                {
                  label: data.dataset[0]?.label || '',
                  year: 2018,
                  data: data.dataset[0]?.data || null,
                  fill: false,
                  borderColor: '#d34537',
                  pointBackgroundColor: '#d34537',
                  lineTension: 0.5,
                  pointRadius: 4,
                  borderWidth: 2,
                },
                {
                  label: data.dataset[1]?.label,
                  year: 2019,
                  data: data.dataset[1]?.data || null,
                  fill: false,
                  borderColor: '#ebaba4',
                  pointBackgroundColor: '#ebaba4',
                  lineTension: 0.5,
                  pointRadius: 4,
                  borderWidth: 2,
                },
              ],
              labels: data.labels,
            };
            setRevenueComparisonData(chartData);
          }

          return data;
        }
      } else {
        setNotification({
          show: true,
          message: 'Cannot compare Revenue Comparison with same month.',
          type: 'error',
        });
      }
      return;
    })();
  };

  const getPaymentsData = () => {
    (async () => {
      const res = await fetchRequest({
        url: `${loginAs === 'lab-admin' ? '/lab_group' : '/lab'}/${profile.selectedRole.uuid}/dashboard/stats/payments?month_filter=${
          filter.month_filter
        }&payment_filter=${paymentFilter.value}`,
        method: 'GET',
        isAuth: true,
      });
      res && updateLoadingState('paymentData', false);
      if (res && res.status === 200) {
        const data = await res.json();
        setPaymentData(data.data);
        return data;
      }
      return;
    })();
  };

  const handleChange = (value, key) => {
    let data = { ...filter };
    data[key] = value;
    setFilters({ ...data });
  };

  return (
    <div className="dashboard-container lab-stats-container">
      <Notification {...notification} />
      <div className="row mb-3">
        <div className="col-md-3 col-12">
          {/* <DateInput
            placeholder="Preferred Time to call"
            value={filter.month_filter}
            showTime
            onChange={date => setFilters({ ...filter, month_filter: date })}
            showYearMonthPicker={true}
            returnFormat={'YYYY-MM'}
          /> */}
          <DatePicker
            inputVariant="outlined"
            value={filter.month_filter || null}
            onChange={date => setFilters({ ...filter, month_filter: moment(date).format('YYYY-MM') })}
            views={['year', 'month']}
            openTo="year"
            format="MM-yyyy"
            maxDate={new Date()}
            autoOk
            disableFuture
          />
          <div className="patient-calenderIcon">
            <label className="table-icon d-inline">{CalendarFilter}</label>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-5 col-12">
          <div className="flex-column">
            <Card
              title="Payments"
              list={paymentDropdown}
              value={paymentFilter}
              onSelectInputChange={value => handleChange(value, 'paymentFilter')}
            >
              <Table columnDefs={paymentHeaders} tableData={paymentData} isLoading={loading['paymentData']} />
              <EditAmountModal actionObject={editAmountObject} />
            </Card>
            <Card
              title="Revenue Comparison"
              input={
                // <DateInput
                //   placeholder="Preferred Time to call"
                //   value={filter.compare_with_filter}
                //   showTime
                //   onChange={date => setFilters({ ...filter, compare_with_filter: date })}
                //   showYearMonthPicker={true}
                //   returnFormat={'YYYY-MM'}
                // /
                <React.Fragment>
                  <DatePicker
                    inputVariant="outlined"
                    value={filter.compare_with_filter || null}
                    onChange={date => setFilters({ ...filter, compare_with_filter: moment(date).format('YYYY-MM') })}
                    openTo="year"
                    views={['year', 'month']}
                    format="MM-yyyy"
                    maxDate={new Date()}
                    autoOk
                    disableFuture
                  />
                  <div className="patient-calenderIcon statistics-calenderIcon">
                    <label className="table-icon d-inline">{CalendarFilter}</label>
                  </div>
                </React.Fragment>
              }
            >
              {/* <LineChart data={{ datasets: [currentYear, revenueData.data[0]], labels: revenueData.labels }}></LineChart> */}
              <LineChart data={revenueComparisonData}></LineChart>
            </Card>
          </div>
        </div>
        <div className="col-md-7 col-12">
          <div className={`d-flex ${loginAs === 'lab-admin' ? 'flex-column' : 'flex-column-reverse'}`}>
            {loginAs === 'lab-admin' ? (
              <div className="d-flex">
                <Card title="Revenue per branch" cardName="revenue-per-branch" className="mr-4" isLoading={loading['stateData']}>
                  <PieChart data={statsData.revenue_per_branch_graph} height="220" width="320"></PieChart>
                </Card>
                <div className={`d-flex ${loginAs === 'lab-admin' ? 'flex-column' : 'flex-row'}`}>
                  <Card title="Total Revenue " cardType="number" centerHeader={true} isLoading={loading['stateData']}>
                    {rupeeSymbol} {statsData.total_revenue}
                  </Card>
                  <Card title="Average revenue per patient" cardType="number" centerHeader={true} isLoading={loading['stateData']}>
                    {rupeeSymbol} {statsData.average_revenue}
                  </Card>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-row">
                <Card title="Total Revenue" cardType="number" centerHeader={true} className="mr-4" isLoading={loading['stateData']}>
                  {rupeeSymbol} {statsData.total_revenue}
                </Card>
                <Card title="Average revenue per patient" cardType="number" centerHeader={true} isLoading={loading['stateData']}>
                  {rupeeSymbol} {statsData.average_revenue}
                </Card>
              </div>
            )}
            <Card title="Best Sellers">
              <Table columnDefs={bestSellerHeaders} tableData={statsData.best_seller} isLoading={loading['stateData']} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabStatistics;
