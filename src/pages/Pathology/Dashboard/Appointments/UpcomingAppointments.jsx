import React, { useCallback, useContext, useEffect, useState } from 'react';
import Table from '../../../../components/Table/Table';
import SelectInput from '../../../../components/FormInputs/SelectInput/SelectInput';
import { AddPersonBlue, Check, DisLikeRed, Restore, CalendarFilter } from '../../../../assets/icons';
import Card from '../../../../components/Common/Card/Card';
import { fetchRequest } from '../../../../utils/api';
import { ProfileContext } from '../../../../context/context';
import moment from 'moment';
// import DateInput from '../../../../components/FormInputs/DateInput/DateInput';
import { OutlinedButton } from '../../../../components/Buttons/Button';
import ConfirmationModal from '../../../../components/Modal/ConfirmationModal';
import Notification from '../../../../components/Notification/Notification';
import UpdateAppointment from './UpdateAppointment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

const UpcomingAppointments = ({ refreshAppointmentList, branchList = [] }) => {
  const { profile } = useContext(ProfileContext);
  const [labId, setLabId] = useState();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [filter, setFilter] = useState({
    selectedDate: moment().format('YYYY-MM-DD'),
    lab: {},
    date_from: moment().format('YYYY-MM-DD'),
    date_to: moment().format('YYYY-MM-DD'),
  });
  const [branchListData, setBranchList] = useState([{ value: 'all', label: 'All' }]);
  const [actionObject, setActionObject] = useState({});
  const [updateAppointment, setUpdateAppointment] = useState({ isModalOpen: false, data: {} });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({ start: moment(), end: moment() });
  const [upcomingURL, setUpcomingURL] = useState(false);
  const { start, end } = state;
  const [appointmentsColumnDefs, setAppointmentsColumnDefs] = useState([
    {
      label: 'Date',
      accessKey: 'date_of_appointment',
      classes: 'main-content semi-bold',
      width: '12%',
    },
    {
      label: 'Time Slot',
      accessKey: 'time_of_appointment',
      width: '12%',
    },
    {
      label: 'Name',
      accessKey: 'full_name',
      classes: 'main-content semi-bold',
      width: '15%',
    },
    {
      label: 'Mobile No',
      accessKey: 'mobile',
      width: '15%',
    },
    {
      label: 'Action',
      accessKey: 'actions',
      width: '40%',
      cellRenderer: row => {
        return (
          <div className="d-flex align-items-center action-div">
            {!row.patient_entry && (
              <>
                {' '}
                <span
                  className="mr-2 cursor-pointer"
                  onClick={() => {
                    setNotification({ show: false, message: '', type: '' });
                    setActionObject({
                      title: 'Confirmation',
                      msg: 'Are you sure you want to delete this appointment? It will be erased completely and you cannot undo it.',
                      cancelAction: 'Go Back',
                      confirmAction: 'Delete',
                      method: 'DELETE',
                      url: `/lab/${row.lab_id}/appointment_booking/${row.uuid}`,
                      handleSuccess: handleDeleteAppointment,
                      handleFailure: handleDeleteAppointment,
                      isModalOpen: true,
                    });
                  }}
                >
                  {DisLikeRed}
                </span>
                <span
                  className="mr-2 cursor-pointer"
                  onClick={() =>
                    setUpdateAppointment({ isModalOpen: true, data: row, setNotification, labId, getListData, setUpdateAppointment })
                  }
                >
                  {Restore}
                </span>
              </>
            )}
            {!row.patient_entry ? (
              <OutlinedButton
                blue
                link
                to={{
                  pathname: `/${localStorage.getItem('loginAs')}/patients/add`,
                  state: { appointmentId: row.uuid, mobileNo: row.mobile, branchId: row.lab_id, ...row },
                }}
                className="add-patient-btn"
              >
                {AddPersonBlue} Add as a Patient
              </OutlinedButton>
            ) : (
              <OutlinedButton disabled>{Check} Added as a patient</OutlinedButton>
            )}
          </div>
        );
      },
    },
  ]);

  const { selectedRole } = profile || {};
  const getListData = useCallback(
    ({ date_from, date_to, lab }) => {
      if (selectedRole.uuid)
        (async () => {
          setLoading(true);
          let url = '';
          if (selectedRole.role.name === 'lab_admin')
            url = `/lab_group/${selectedRole.uuid}/appointment_booking${date_from ? `?date_from=${date_from}` : ''}${
              date_to && date_to !== 'Invalid date' ? `&date_to=${date_to}` : ''
            }${lab && lab !== 'all' ? `&lab=${lab}` : ''}`;
          else
            url = `/lab/${selectedRole.uuid}/appointment_booking${date_from ? `?date_from=${date_from}` : ''}${
              date_to && date_to !== 'Invalid date' ? `&date_to=${date_to}` : ''
            }`;
          const res = await fetchRequest({ url, method: 'GET', isAuth: true });
          res && setLoading(false);
          if (res && res.status === 200) {
            const { data } = await res.json();
            setUpcomingAppointments({ data });
            return data;
          }
          return;
        })();
    },
    [selectedRole],
  );

  const handleDeleteAppointment = useCallback(
    data => {
      if (data.success) {
        getListData({});
        setNotification({ show: true, message: data.message, type: 'success' });
      } else setNotification({ show: true, message: data.message, type: 'error' });
    },
    [getListData],
  );

  useEffect(() => {
    if (selectedRole) {
      setLabId(selectedRole.uuid);
      if (selectedRole.role.name === 'lab_admin'){
        appointmentsColumnDefs.splice(4, 0, {
          label: 'Branch',
          accessKey: 'lab_name',
          width: '20%',
        });
      setAppointmentsColumnDefs(appointmentsColumnDefs => [...appointmentsColumnDefs]);
      }
    }
  }, [selectedRole]);

  useEffect(() => {
    if (labId) getListData({});
  }, [labId, getListData]);

  useEffect(() => {
    if (refreshAppointmentList) getListData({});
  }, [refreshAppointmentList, getListData]);

  const getLabBranchData = useCallback((labId, selectedRole) => {
    if (labId && selectedRole.role.name === 'lab_admin') {
      //change
      (async () => {
        const statusRes = await fetchRequest({ url: `/lab_group/${labId}/get_labs`, method: 'GET', isAuth: true });
        if (statusRes && statusRes.status === 200) {
          const { data } = await statusRes.json();
          let branches = data.map(item => ({ value: item.uuid, label: item.name }));
          setBranchList([...branchListData, ...branches]);
          setFilter(filter => ({ ...filter, lab: { value: 'all', label: 'All' }, isSelect: true })); //added
        }
        return;
      })();
    }
  }, []);

  useEffect(() => {
    setUpcomingURL(window.location.toString().includes('dashboard/appointments'));
    getLabBranchData(labId, selectedRole);
  }, [labId, selectedRole]);

  useEffect(() => {
    const { date_from, date_to, lab } = filter;
    if (date_from || date_to || lab) {
      getListData({ date_from, date_to, lab: lab?.value || null });
    }
  }, [filter, getListData]);

  const { lab } = filter;

  const handleCallback = (start, end) => {
    setState({ start, end });
    setFilter({ ...filter, date_from: moment(start._d).format('YYYY-MM-DD'), date_to: moment(end._d).format('YYYY-MM-DD') });
  };

  const label = filter.selectedDate && start.format('DD-MM-YYYY') + ' to ' + end.format('DD-MM-YYYY');

  const ranges = {
    Today: [moment().toDate(), moment().toDate()],
    Yesterday: [moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()],
    'Last 7 Days': [moment().subtract(6, 'days').toDate(), moment().toDate()],
    Tomorrow: [moment().add(1, 'days').toDate(), moment().add(1, 'days').toDate()],
    'Next 7 Days': [moment().add(1, 'days').toDate(), moment().add(7, 'days').toDate()],
  };

  return (
    <>
      <Notification {...notification} />
      <div className="row mb-3">
        <div className={`${upcomingURL ? 'col-md-3' : 'col-md-5 '} col-12 customDatePicker-wrapper`}>
          {/* <DateInput
            placeholder={selectedDate ? '' : 'Date'}
            value={selectedDate}
            onChange={date => setFilter({ ...filter, selectedDate: date })}
            returnFormat={'YYYY-MM-DD'}
          /> */}
          <DateRangePicker
            className="customDatePicker"
            id="customDatePicker"
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
        </div>
        {profile.selectedRole.role.name === 'lab_admin' ? (
          <div className={`${upcomingURL ? 'col-md-3' : 'col-md-5 '} col-12`}>
            <SelectInput
              placeholder="Branch"
              options={branchListData}
              value={lab}
              onChange={data => setFilter({ ...filter, lab: data })}
              // hasGrayBack
              hidePlaceholder
            />
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="row">
        <div className="col-12">
          <Card title="Upcoming Appointments">
            <Table columnDefs={appointmentsColumnDefs} tableData={upcomingAppointments.data} getListData={getListData} isLoading={loading} tableClassName="upcoming-appointment"></Table>
          </Card>
        </div>
      </div>
      <ConfirmationModal actionObject={actionObject} />
      <UpdateAppointment actionObject={updateAppointment} />
    </>
  );
};
export default UpcomingAppointments;
