import React, { useState, useEffect, useContext } from 'react';
import { CustomModal, ModalHeader, ModalBody, ModalFooter } from './Modal';
import TextInput from '../FormInputs/TextInput/TextInput';
import { ContainedButton, OutlinedButton } from '../Buttons/Button';
import { fetchRequest } from '../../utils/api';
import RadioButton from '../FormInputs/RadioButton/RadioButton';
import { ProfileContext } from '../../context/context';

const defaultState = {
  isModalOpen: false,
};
const ResetPasswordModal = ({ actionObject = defaultState }) => {
  const { isModalOpen, setErrors, setNotification } = actionObject;
  const profileContext = useContext(ProfileContext);
  const [modal, handleModalToggle] = useState(isModalOpen);
  const [sendTo, setSendTo] = useState('mobile');
  const [mobileToSendLink, setMobileToSendLink] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    handleModalToggle(isModalOpen);
  }, [actionObject, isModalOpen]);

  const handleForgetPass = async e => {
    setErrors({});
    setBtnLoading(true);
    setNotification({ show: false, message: '', type: '' });
    e.preventDefault();
    const res = await fetchRequest({
      url: profileContext ? '/user_profile/forgot_password' : '/forgot_password',
      method: profileContext ? 'PUT' : 'POST',
      isAuth: profileContext ? true : false,
      body: profileContext ? { send_to: sendTo } : { mobile: mobileToSendLink },
    });
    res && setBtnLoading(false);
    if (res && res.status === 200) {
      const data = await res.json();
      if (data.success) {
        handleModalToggle(false);
        data.message && setNotification({ show: true, message: data.message, type: 'success' });
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

  // const onHandleChange = (value, key) => {
  //   let obj = { ...initials };
  //   obj[key] = value;
  //   // setInitials({ ...obj });
  // };

  const { mobile } = profileContext ? (profileContext.profile ? profileContext.profile : {}) : {};
  return (
    <CustomModal className="my-profile-modal" modalIsOpen={modal} closeModal={handleModalToggle}>
      <ModalHeader className="text-center">
        <h6 className="black-heading">{profileContext ? 'Reset Current Password' : 'Forgot Password'}</h6>
      </ModalHeader>
      <ModalBody className="mb-2">
        {profileContext ? (
          <>
            <p className="modal-msg">You will receive a link to reset your current password. Where would you like to receive that link?</p>
            <form className="book-demo-form pl-2 pr-4">
              <div className="d-flex my-3">
                {/* <div>
                  <RadioButton
                    className="mr-5"
                    label="On Email ID"
                    checked={sendTo === 'email'}
                    onClick={() => setSendTo('email')}
                  ></RadioButton>
                  <span className="modal-info">{email}</span>
                </div> */}
                <div>
                  <RadioButton
                    className="mr-5"
                    label="On Mobile No."
                    checked={sendTo === 'mobile'}
                    onClick={() => setSendTo('mobile')}
                  ></RadioButton>
                  <span className="modal-info">{mobile}</span>
                </div>
              </div>
            </form>
          </>
        ) : (
          <>
            <p className="modal-msg">You will receive a link to reset your password. Please enter your mobile no.</p>
            <form className="book-demo-form pl-2 pr-4">
              <div className="d-flex my-3">
                <div className="form-group mb-3 w-75">
                  <TextInput
                    placeholder="Mobile No."
                    value={mobileToSendLink || ''} // Its taking null if no value is passed. Hence empty string passed
                    onChange={e => setMobileToSendLink(e.target.value)}
                    // error={errors && errors['mobile']}
                  ></TextInput>
                </div>
              </div>
            </form>
          </>
        )}
      </ModalBody>
      <ModalFooter className={profileContext ? 'justify-content-center' : 'justify-content-end'}>
        <OutlinedButton className="close-modal-btn" onClick={() => handleModalToggle(false)} disabled={btnLoading}>
          Cancel
        </OutlinedButton>
        <ContainedButton
          onClick={handleForgetPass}
          lightBlue={profileContext ? true : false}
          red={!profileContext ? true : false}
          disabled={btnLoading}
          loading={btnLoading}
        >
          Send Link
        </ContainedButton>
      </ModalFooter>
    </CustomModal>
  );
};
export default ResetPasswordModal;
