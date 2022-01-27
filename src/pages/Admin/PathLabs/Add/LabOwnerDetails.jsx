import React, { useEffect, useState } from 'react';
import { ContainedButton, OutlinedButton } from '../../../../components/Buttons/Button';
import TextInput from '../../../../components/FormInputs/TextInput/TextInput';
import { DoneIcon } from '../../../../assets/icons';
import { fetchRequest } from '../../../../utils/api';
import Notification from '../../../../components/Notification/Notification';

const LabOwnerDetails = ({ data, setData, error, setError }) => {
  const [initials, setInitials] = useState({
    isOtpGenerated: false,
  });
  const [mobileError, setMobileError] = useState({});
  const [disabledInput, setDisabledInput] = useState(false);
  const [isMobileValid, SetIsMobileValid] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    setInitials({ ...data });
  }, [data]);

  const generateOTP = async resend => {
    setMobileError({});
    setError({});
    setNotification({ show: false, message: '', type: '' });
    let url = resend ? '/resend_otp_for_registration' : '/otp_for_registration';
    let postObj = { mobile: initials.mobile };
    const res = await fetchRequest({ url, method: 'POST', isAuth: false, body: postObj });
    if (res && res.status === 200) {
      const data = await res.json();
      if (data.success) {
        data.message && setNotification({ show: true, message: data.message || 'OTP generated successfully.', type: 'success' });
        let obj = { ...initials };
        obj['isOtpGenerated'] = true;
        setInitials({ ...obj });
      }
    } else {
      const errObj = await res.json();
      setMobileError({ ...errObj.errors });
      res.status !== 422 &&
        !Object.keys(errObj.error ? errObj.error : {}).length &&
        errObj.message &&
        setNotification({ show: true, message: errObj.message, type: 'error' });
    }
    return;
  };

  const getDetailsFromMobile = async mobile => {
    setDisabledInput(false);
    setError({});
    const res = await fetchRequest({ url: `/get_user_details?mobile=${mobile}`, method: 'GET', isAuth: true });
    if (res && res.status === 200) {
      const { data } = await res.json();
      if (data && data.length !== 0) {
        setInitials({ ...initials, ...data });
        setDisabledInput(true);
      } else {
        setInitials({ ...initials, first_name: '', last_name: '', email: '', otp: '', isOtpGenerated: false, mobile });
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
        setData({ ...obj });
        if (value && value.length === 10) SetIsMobileValid(true);
        else SetIsMobileValid(false);
      }
    } else {
      let obj = { ...initials };
      obj[key] = value;
      setInitials({ ...obj });
      setData({ ...obj });
    }
    if (key === 'mobile' && value.toString().length === 10) getDetailsFromMobile(value);
    else setDisabledInput(false);
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
    setMobileError({ ...errObj.errors });
  };

  const { isOtpGenerated, mobile, email, otp, first_name, last_name } = initials;
  return (
    <div className="form-content">
      <Notification {...notification} />
      <div className="paper">
        <label className="paper-label">Add lab owner details</label>
        <div className="row mb-4">
          <div className="form-group col-md-5 col-12">
            <TextInput
              placeholder="Mobile No. *"
              value={mobile || ''}
              onChange={e => onHandleChange(e.target.value, 'mobile')}
              onBlur={e => onHandleBlur(e.target.value, 'mobile')}
              error={(error && error['user_details.mobile']) || (mobileError && mobileError['mobile'])}
              maxLength={10}
            />
          </div>
          <div className="form-group col-md-7 col-12 text-left">
            {isOtpGenerated ? (
              <div className="d-flex align-items-end">
                <OutlinedButton blue className="otp-sent" disabled>
                  <div className="d-flex">
                    <p className="done-icon">{DoneIcon}</p> OTP Sent
                  </div>
                </OutlinedButton>
                <p className="resend-otp ml-1">
                  Didn’t receive code?{' '}
                  <span onClick={() => generateOTP(1)} className="blue-link cursor-pointer">
                    Resend OTP
                  </span>
                </p>
              </div>
            ) : (
              <ContainedButton lightBlue className="generate-otp-btn" onClick={() => generateOTP(0)} disabled={!isMobileValid}>
                Generate OTP
              </ContainedButton>
            )}
          </div>
        </div>
        {isOtpGenerated && (
          <div className="row mb-4">
            <div className="form-group col-md-5 col-12">
              <TextInput
                placeholder="Enter OTP*"
                value={otp || ''}
                onChange={e => onHandleChange(e.target.value, 'otp')}
                error={error && error['user_details.otp']}
              />
            </div>
          </div>
        )}
        <div className="row mb-4">
          <div className="form-group col-md-5 col-12">
            <TextInput
              placeholder="Email ID*"
              value={email || ''}
              onChange={e => onHandleChange(e.target.value, 'email')}
              error={error && error['user_details.email']}
              disabled={disabledInput}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="form-group col-md-5 col-12">
            <TextInput
              placeholder="First Name*"
              value={first_name || ''}
              onChange={e => onHandleChange(e.target.value, 'first_name')}
              error={error && error['user_details.first_name']}
              disabled={disabledInput}
            />
          </div>
          <div className="form-group col-md-5 col-12">
            <TextInput
              placeholder="Last Name*"
              value={last_name || ''}
              onChange={e => onHandleChange(e.target.value, 'last_name')}
              error={error && error['user_details.last_name']}
              disabled={disabledInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabOwnerDetails;
