import React, { useState, useEffect } from 'react';
import { CustomModal, ModalHeader, ModalBody, ModalFooter } from '../../Modal/Modal';
import TextInput from '../../FormInputs/TextInput/TextInput';
import { ContainedButton } from '../../Buttons/Button';
import { fetchRequest } from '../../../utils/api';
// import DateInput from '../../FormInputs/DateInput/DateInput';
import moment from 'moment';
import { DateTimePicker } from '@material-ui/pickers';

const defaultState = {
  title: '',
  confirmAction: '',
  method: '',
  url: '',
  handleSuccess: '',
  isModalOpen: false,
};

const BookDemoModal = ({ actionObject = defaultState, setNotification }) => {
  const { title, confirmAction, isModalOpen, getListData, handleSuccess } = actionObject;

  const [modal, handleModalToggle] = useState(isModalOpen);
  const [initials, setInitials] = useState({
    first_name: '',
    last_name: '',
    lab_name: '',
    contact_number: '',
    city: '',
    preferred_time: null,
  });
  const [errors, setError] = useState({});
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    handleModalToggle(isModalOpen);
  }, [actionObject, isModalOpen]);

  const handleConfirmAction = async () => {
    setError({});
    setBtnLoading(true);
    setNotification({ show: false, message: '', type: '' });
    let url = '/book_demo';
    let postObj = { ...initials, preferred_time: moment(initials.preferred_time).format('YYYY-MM-DD HH:mm:ss') };
    const res = await fetchRequest({ url, method: 'POST', isAuth: false, body: postObj });
    res && setBtnLoading(false);
    if (res && res.status === 200) {
      const data = await res.json();
      if (data.success) {
        handleModalToggle(false);
        handleSuccess();
        getListData && getListData({ date: moment() });
      }
    } else {
      const errObj = await res.json();
      setError({ ...errObj.errors });
      res.status !== 422 &&
        !Object.keys(errObj.error ? errObj.error : {}).length &&
        errObj.message &&
        setNotification({ show: true, message: errObj.message, type: 'error' });
    }
    return;
  };

  const onHandleChange = (value, key) => {
    let obj = { ...initials };
    obj[key] = value;
    setInitials({ ...obj });
  };

  const { first_name, last_name, lab_name, contact_number, city, preferred_time } = initials;
  return (
    <CustomModal className="book-demo-modal" modalIsOpen={modal} closeModal={handleModalToggle}>
      <ModalHeader className="text-center" closeBtn={true} closeModal={handleModalToggle}>
        <h3 className="red-heading">{title}</h3>
      </ModalHeader>
      <ModalBody className="mb-2">
        <form className="book-demo-form pl-2 pr-4">
          <div className="d-flex">
            <div className="form-group mr-3">
              <TextInput
                placeholder="First Name"
                value={first_name}
                onChange={e => onHandleChange(e.target.value, 'first_name')}
                error={errors && errors['first_name']}
              ></TextInput>
            </div>
            <div className="form-group">
              <TextInput
                placeholder="Last Name"
                value={last_name}
                onChange={e => onHandleChange(e.target.value, 'last_name')}
                error={errors && errors['last_name']}
              ></TextInput>
            </div>
          </div>
          <div className="form-group mr-5">
            <TextInput
              placeholder="Lab Name"
              value={lab_name}
              onChange={e => onHandleChange(e.target.value, 'lab_name')}
              error={errors && errors['lab_name']}
            />
          </div>
          <div className="form-group mr-5">
            <TextInput
              placeholder="Mobile Number"
              value={contact_number}
              onChange={e => onHandleChange(e.target.value, 'contact_number')}
              error={errors && errors['contact_number']}
            />
          </div>
          <div className="form-group mr-5">
            <TextInput
              placeholder="City"
              value={city}
              onChange={e => onHandleChange(e.target.value, 'city')}
              error={errors && errors['city']}
            />
          </div>
          <div className="form-group mr-5">
            <DateTimePicker
              label="Preferred Time to call*"
              inputVariant="outlined"
              ampm={true}
              value={preferred_time || null}
              minDate={new Date()}
              maxDate={moment().add(1, 'months').format('MM/DD/YYYY')}
              onChange={date => onHandleChange(date, 'preferred_time')}
              error={errors && errors['preferred_time'] ? true : false}
              helperText={errors && errors['preferred_time']}
              format="dd-MM-yyyy hh:mm a"
              autoOk
            />
            {/* <DateInput
              placeholder="Preferred Time to call"
              value={preferred_time}
              showTime
              onChange={date => onHandleChange(date, 'preferred_time')}
              error={errors && errors['preferred_time']}
            /> */}
          </div>
        </form>
      </ModalBody>
      <ModalFooter className="justify-content-center">
        <ContainedButton red className="book-demo-btn" onClick={handleConfirmAction} loading={btnLoading} disabled={btnLoading}>
          {confirmAction}
        </ContainedButton>
      </ModalFooter>
    </CustomModal>
  );
};

export default BookDemoModal;
