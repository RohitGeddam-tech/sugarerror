import React, { useContext, useEffect, useState } from 'react';
import Card from '../../../components/Common/Card/Card';
import TextInput from '../../../components/FormInputs/TextInput/TextInput';
import SelectInput from '../../../components/FormInputs/SelectInput/SelectInput';
import { OutlinedButton } from '../../../components/Buttons/Button';
import UpcomingAppointments from '../Dashboard/Appointments/UpcomingAppointments';
import { ProfileContext } from '../../../context/context';
import { fetchRequest } from '../../../utils/api';
// import DateInput from '../../../components/FormInputs/DateInput/DateInput';
import moment from 'moment';
import Notification from '../../../components/Notification/Notification';
import { DateTimePicker } from '@material-ui/pickers';
import { CalendarFilter } from '../../../assets/icons';

const defaultState = {
  mobile: '',
  email: '',
  first_name: '',
  last_name: '',
  appointmentDate: '',
};

const AddAppointment = props => {
  const { profile } = useContext(ProfileContext);
  const [initials, setInitials] = useState(defaultState);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [btnLoading, setBtnLoading] = useState(false);
  const [branchList, setBranchList] = useState([]);
  const [branch, setSelectedBranch] = useState({});
  const [labId, setLabId] = useState();
  const [disabledInput, setDisabledInput] = useState(false);
  const [refreshAppointmentList, setRefreshAppointmentList] = useState(false);

  useEffect(() => {
    if (profile) setLabId(profile.selectedRole.uuid);
  }, [profile]);

  useEffect(() => {
    if (labId && profile.selectedRole.role.name === 'lab_admin') {
      (async () => {
        const statusRes = await fetchRequest({ url: `/lab_group/${labId}/get_labs`, method: 'GET', isAuth: true });
        if (statusRes && statusRes.status === 200) {
          const { data } = await statusRes.json();
          setBranchList(data.map(item => ({ value: item.uuid, label: item.name })));
        }
        return;
      })();
    }
  }, [labId, profile.selectedRole]);

  const getDetailsFromMobile = async mobile => {
    setDisabledInput(false);
    setErrors({});
    setNotification({ show: false, message: '', type: '' });
    const res = await fetchRequest({ url: `/get_user_details?mobile=${mobile}`, method: 'GET', isAuth: true });
    if (res && res.status === 200) {
      const { data } = await res.json();
      if (data && data.length !== 0) {
        setInitials({ ...initials, ...data });
        setDisabledInput(true);
      } else {
        setInitials({ ...initials, first_name: '', last_name: '', email: '', mobile });
      }
      return data;
    }
    return;
  };

  const onHandleChange = (value, key) => {
    if (key === 'mobile') {
      const re = /^[0-9\b]+$/;
      if (value === '' || re.test(value)) {
        let obj = { ...initials };
        obj[key] = value;
        setInitials({ ...obj });
        if (value.toString().length === 10) getDetailsFromMobile(value);
      }
    } else {
      let obj = { ...initials };
      obj[key] = value;
      setInitials({ ...obj });
    }
  };

  const onHandleBlur = (event, field) => {
    const errObj = { errors: {} };
    if (!event && field === 'mobile') {
      errObj.errors = {
        mobile: [`Mobile field is required`],
      };
    } else if (event.length !== 10 && field === 'mobile') {
      errObj.errors = {
        mobile: ['Enter valid mobile no'],
      };
    }
    setErrors({ ...errObj.errors });
  };

  const handleSubmit = e => {
    setRefreshAppointmentList(false);
    e.preventDefault();
    setErrors({});
    setBtnLoading(true);
    setNotification({ show: false, message: '', type: '' });
    const { mobile, email, first_name, last_name, appointmentDate } = initials;
    let date_of_appointment = moment(appointmentDate).format('YYYY-MM-DD');
    let time_of_appointment = moment(appointmentDate).format('hh:mm A');
    let postObj = { mobile, email, first_name, last_name, date_of_appointment, time_of_appointment };
    (async () => {
      const res = await fetchRequest({
        url: `/lab/${branch && branch.value ? branch.value : labId}/appointment_booking`,
        method: 'POST',
        body: postObj,
        isAuth: true,
      });
      res && setBtnLoading(false);
      if (res && res.status === 200) {
        const data = await res.json();
        data.message && setNotification({ show: true, message: data.message, type: 'success' });
        setRefreshAppointmentList(true);
        setInitials(defaultState) || setSelectedBranch({});
      } else {
        const errObj = await res.json();
        setErrors({ ...errObj.errors });
        res.status !== 422 &&
          !Object.keys(errObj.error ? errObj.error : {}).length &&
          errObj.message &&
          setNotification({ show: true, message: errObj.message, type: 'error' });
      }
      return;
    })();
  };

  const { mobile, email, first_name, last_name, appointmentDate } = initials;

  return (
    <div className="dashboard-container">
      <Notification {...notification} />
      <div className="row add-appointment">
        <div className="col-md-5 col-12">
          <Card title="Please fill the required details">
            <form onSubmit={handleSubmit}>
              <div className="row mb-4">
                <div className="form-group col-md-6 col-12">
                  <TextInput
                    placeholder="Mobile No.*"
                    value={mobile}
                    onChange={e => onHandleChange(e.target.value, 'mobile')}
                    onBlur={e => onHandleBlur(e.target.value, 'mobile')}
                    error={errors && errors['mobile']}
                    maxLength={10}
                  />
                </div>
                <div className="form-group col-md-6">
                  <TextInput
                    placeholder="Email"
                    value={email}
                    onChange={e => onHandleChange(e.target.value, 'email')}
                    error={errors && errors['email']}
                    disabled={disabledInput}
                  />
                </div>
              </div>
              <div className="row mb-4">
                <div className="form-group col-md-6 col-12">
                  <TextInput
                    placeholder="First Name*"
                    value={first_name}
                    onChange={e => onHandleChange(e.target.value, 'first_name')}
                    error={errors && errors['first_name']}
                    disabled={disabledInput}
                  />
                </div>
                <div className="form-group col-md-6">
                  <TextInput
                    placeholder="Last Name*"
                    value={last_name}
                    onChange={e => onHandleChange(e.target.value, 'last_name')}
                    error={errors && errors['last_name']}
                    disabled={disabledInput}
                  />
                </div>
              </div>
              <div className="row mb-4">
                <div className="form-group col-12">
                  <DateTimePicker
                    label="Appointment Date And Time*"
                    inputVariant="outlined"
                    ampm={true}
                    value={appointmentDate || null}
                    minDate={new Date()}
                    maxDate={moment().add(1, 'months').format('MM/DD/YYYY')}
                    onChange={date => onHandleChange(date, 'appointmentDate')}
                    error={errors && (errors['date_of_appointment'] || errors['time_of_appointment']) ? true : false}
                    helperText={errors && (errors['date_of_appointment'] || errors['time_of_appointment'])}
                    format="dd-MM-yyyy hh:mm a"
                    autoOk={true}
                    hideTabs={true}
                  />
                  <div className="patient-calenderIcon">
                    <label className="table-icon d-inline">{CalendarFilter}</label>
                  </div>
                  {/* <DateInput
                    placeholder="Appointment Date And Time*"
                    value={appointmentDate}
                    showTime
                    onChange={date => onHandleChange(date, 'appointmentDate')}
                    error={errors && (errors['date_of_appointment'] || errors['time_of_appointment'])}
                    disablePastDates
                  /> */}
                </div>
              </div>
              {profile.selectedRole.role.name === 'lab_admin' && (
                <div className="row">
                  <div className="form-group col-md-6">
                    <SelectInput
                      placeholder="Select a Branch"
                      options={branchList}
                      value={branch}
                      onChange={data => setSelectedBranch(data)}
                      error={errors && errors['branch']}
                    />
                  </div>
                </div>
              )}

              <div className="row mt-5 mb-4">
                <div className="col-12">
                  <div className="w-100 d-flex justify-content-center">
                    <OutlinedButton
                      className="mr-2"
                      onClick={() => setInitials(defaultState) || setSelectedBranch({})}
                      red
                      disabled={!Object.keys(initials).some(i => initials[i]) || btnLoading}
                    >
                      Cancel
                    </OutlinedButton>
                    <OutlinedButton className="" blue type="submit" loading={btnLoading} disabled={btnLoading}>
                      Save
                    </OutlinedButton>
                  </div>
                </div>
              </div>
            </form>
          </Card>
        </div>
        <div className="col-md-7 col-12">
          <UpcomingAppointments refreshAppointmentList={refreshAppointmentList} branchList={branchList} />
        </div>
      </div>
    </div>
  );
};

export default AddAppointment;
