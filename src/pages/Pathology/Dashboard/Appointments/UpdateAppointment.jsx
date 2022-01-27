import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { CustomModal, ModalBody, ModalFooter, ModalHeader } from '../../../../components/Modal/Modal';
import { ContainedButton, OutlinedButton } from '../../../../components/Buttons/Button';
import { fetchRequest } from '../../../../utils/api';
import { CalendarFilter } from '../../../../assets/icons';
import { DateTimePicker } from '@material-ui/pickers';

const defaultState = {
  method: '',
  url: '',
  handleSuccess: '',
  isModalOpen: false,
  data: {},
};

const UpdateAppointment = ({ actionObject = defaultState }) => {
  const { isModalOpen, data, setNotification, labId, getListData, setUpdateAppointment } = actionObject;
  const [modal, handleModalToggle] = useState(isModalOpen);
  const [errors, setError] = useState({});
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    handleModalToggle(isModalOpen);
  }, [isModalOpen]);

  const handleConfirmAction = useCallback(
    async e => {
      e.preventDefault();
      setError({});
      setBtnLoading(true);
      setNotification({ show: false, message: '', type: '' });
      let date_of_appointment = moment(appointmentDate).format('YYYY-MM-DD');
      let time_of_appointment = moment(appointmentDate).format('hh:mm A');
      let postObj = { date_of_appointment, time_of_appointment };
      (async () => {
        const res = await fetchRequest({
          url: `/lab/${data.lab_id ? data.lab_id : labId}/appointment_booking/${data.uuid}`,
          method: 'PUT',
          body: postObj,
          isAuth: true,
        });
        res && setBtnLoading(false);
        if (res && res.status === 200) {
          const data = await res.json();
          data.message && setNotification({ show: true, message: data.message, type: 'success' });
          handleModalToggle(false);
          getListData({});
          setUpdateAppointment({ isModalOpen: false, data: {} });
        } else {
          const errObj = await res.json();
          setError({ ...errObj.errors });
          res.status !== 422 &&
            !Object.keys(errObj.error ? errObj.error : {}).length &&
            errObj.message &&
            setNotification({ show: true, message: errObj.message, type: 'error' });
        }
        return;
      })();
    },
    [data, setNotification, labId, getListData, setUpdateAppointment, appointmentDate],
  );

  const { mobile, email, first_name, last_name, date_of_appointment, time_of_appointment } = data;
  return (
    <CustomModal className="add-user-modal" modalIsOpen={modal} closeModal={handleModalToggle}>
      <ModalHeader className="text-center">
        <p className="semi-bold">Update Appointment</p>
      </ModalHeader>
      <ModalBody className="mb-2">
        <form className="add-details-form pl-2 pr-4">
          <div className="edit-user-data-card">
            <div className="d-flex card-row mb-2">
              <div className="semi-bold label">Name : </div>
              <div className={`value`}>{`${first_name} ${last_name}`}</div>
            </div>
            <div className="d-flex card-row mb-2">
              <div className="semi-bold label">Mobile No. : </div>
              <div className={`value`}>{mobile}</div>
            </div>
            <div className="d-flex card-row mb-2">
              <div className="semi-bold label">Email : </div>
              <div className={`value`}>{email || '-'}</div>
            </div>
            <div className="d-flex card-row mb-2">
              <div className="semi-bold label">Date : </div>
              <div className={`value`}>{date_of_appointment || '-'}</div>
            </div>
            <div className="d-flex card-row mb-2">
              <div className="semi-bold label">Time : </div>
              <div className={`value`}>{time_of_appointment || '-'}</div>
            </div>
          </div>
          <div className="form-group col-12 mt-3">
            <DateTimePicker
              label="Appointment Date And Time*"
              inputVariant="outlined"
              ampm={true}
              value={appointmentDate || null}
              minDate={new Date()}
              maxDate={moment().add(1, 'months').format('MM/DD/YYYY')}
              onChange={date => setAppointmentDate(date)}
              error={errors && (errors['date_of_appointment'] || errors['time_of_appointment']) ? true : false}
              helperText={errors && (errors['date_of_appointment'] || errors['time_of_appointment'])}
              format="dd-MM-yyyy hh:mm a"
              autoOk={true}
              hideTabs={true}
            />
            <div className="patient-calenderIcon">
              <label className="table-icon d-inline">{CalendarFilter}</label>
            </div>
          </div>
        </form>
      </ModalBody>
      <ModalFooter className="justify-content-center">
        <OutlinedButton
          onClick={() => {
            handleModalToggle(false);
            setError({});
            setUpdateAppointment({ isModalOpen: false, data: {} });
          }}
          disabled={btnLoading}
        >
          Cancel
        </OutlinedButton>
        <ContainedButton lightBlue onClick={handleConfirmAction} loading={btnLoading} disabled={btnLoading}>
          Update
        </ContainedButton>
      </ModalFooter>
    </CustomModal>
  );
};

export default UpdateAppointment;
