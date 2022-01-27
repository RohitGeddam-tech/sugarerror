import React, { useState, useEffect, useContext } from 'react';
import { CustomModal, ModalHeader, ModalBody, ModalFooter } from '../../components/Modal/Modal';
import TextInput from '../../components/FormInputs/TextInput/TextInput';
import { ContainedButton, OutlinedButton } from '../../components/Buttons/Button';
import { fetchRequest } from '../../utils/api';
import { ProfileContext } from '../../context/context';

const defaultState = {
  isModalOpen: false,
  api: '',
  title: '',
  field: { label: '', value: '', name: '' },
};

const DetailsModal = ({ actionObject = defaultState, setNotification }) => {
  const { profile, setProfileData } = useContext(ProfileContext);
  const { title, isModalOpen, field, api } = actionObject;
  const [modal, handleModalToggle] = useState(isModalOpen);
  const [initials, setInitials] = useState({ is_otp_generated: false, otp: '' });
  const [errors, setErrors] = useState({});
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    handleModalToggle(isModalOpen);
    setInitials({ is_otp_generated: false, otp: '' });
  }, [actionObject, isModalOpen]);

  const handleConfirmAction = async e => {
    e.preventDefault();
    setErrors({});
    setBtnLoading(true);
    setNotification({ show: false, message: '', type: '' });
    let postObj = { type: 'verify_otp', otp: initials.otp };
    postObj[field.name] = initials[field.name];
    const res = await fetchRequest({ url: api, method: 'PUT', isAuth: true, body: postObj });
    setBtnLoading(false);
    if (res && res.status === 200) {
      const data = await res.json();
      if (data.success) {
        data.message && setNotification({ show: true, message: data.message, type: 'success' });
        handleModalToggle(false);
        setProfileData({ ...profile, data: { ...data.data } });
        // setEdit({});
      }
    } else {
      const errObj = await res.json();
      setErrors({ ...errObj.errors });
      res.status !== 422 &&
        !Object.keys(errObj.error ? errObj.error : {}).length &&
        errObj.message &&
        setNotification({ show: true, message: errObj.message, type: 'error' });
    }
    return;
  };

  const generateOTP = async resend => {
    setErrors({});
    setNotification({ show: false, message: '', type: '' });
    let url = resend ? api : api;
    let postObj = { type: resend ? 'resend_otp' : 'send_otp' };
    postObj[field.name] = initials[field.name];
    const res = await fetchRequest({ url, method: 'PUT', isAuth: true, body: postObj });
    if (res && res.status === 200) {
      const data = await res.json();
      if (data.success) {
        data.message && setNotification({ show: true, message: data.message, type: 'success' });
        let obj = { ...initials };
        obj['is_otp_generated'] = true;
        setInitials({ ...obj });
      }
    } else {
      const errObj = await res.json();
      setErrors({ ...errObj.errors });
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

  return (
    <CustomModal className="my-profile-modal" modalIsOpen={modal} closeModal={handleModalToggle}>
      <ModalHeader className="text-center">
        <h6 className="black-heading">{title}</h6>
      </ModalHeader>
      <ModalBody className="mb-2">
        <form className="update-details-modal pl-2 pr-4">
          <div className="row mb-2">
            <div className="col-sm-12 col-md-6 form-group mr-5">
              <TextInput
                placeholder={field.label}
                value={initials[field.name] || ''}
                onChange={e => onHandleChange(e.target.value, field.name)}
                error={errors && errors[field.name]}
              />
            </div>
          </div>
          {initials.is_otp_generated && (
            <div className="row mb-2">
              <div className="col-sm-12 col-md-6 form-group ">
                <TextInput
                  placeholder="Enter OTP"
                  value={initials.otp || ''}
                  onChange={e => onHandleChange(e.target.value, 'otp')}
                  error={errors && errors['otp']}
                />
              </div>
              <div className="col-sm-12 col-md-6 d-flex align-items-end">
                <p className="resend-otp ">
                  Didn’t receive code?{' '}
                  <span onClick={() => generateOTP(1)} className="blue-link cursor-pointer">
                    Resend OTP
                  </span>
                </p>
              </div>
            </div>
          )}
        </form>
      </ModalBody>
      <ModalFooter className="justify-content-end">
        <OutlinedButton className="close-modal-btn" onClick={() => handleModalToggle(false)}>
          Cancel
        </OutlinedButton>
        {!initials.is_otp_generated ? (
          <ContainedButton black className="generate-otp-btn" onClick={() => generateOTP(0)}>
            Generate OTP
          </ContainedButton>
        ) : (
          <ContainedButton onClick={handleConfirmAction} disabled={btnLoading} loading={btnLoading} lightBlue>
            Save
          </ContainedButton>
        )}
      </ModalFooter>
    </CustomModal>
  );
};

export default DetailsModal;
