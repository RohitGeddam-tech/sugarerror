import React, { useState } from 'react';
import Notification from '../../../components/Notification/Notification';
import { ContainedButton } from '../../../components/Buttons/Button';
import TextInput from '../../../components/FormInputs/TextInput/TextInput';
import { SectionWrapper } from '../../../components/Wrappers/SectionWrapper';
import { fetchRequest } from '../../../utils/api';
import { useParams } from 'react-router-dom';
import { CheckedCircleSuccess } from '../../../assets/icons';

const defaultState = {
  password: '',
  confirm_password: '',
};

function SetNewPassword(props) {
  const { tokenId } = useParams();
  const [initials, setInitials] = useState(defaultState);
  const [errors, setErrors] = useState();
  const [btnLoading, setBtnLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [validation, setvalidations] = useState([{ minimunLength: false }, { containMix: false }, { containNumber: false }]);

  const onHandleChange = (value, key) => {
    let obj = { ...initials };
    obj[key] = value;
    if (key === 'password') validatePassword(value);
    setInitials({ ...obj });
  };

  const validatePassword = password => {
    const tempValidation = { ...validation };
    var mixExp = /(?=.*[a-z])(?=.*[A-Z])/,
      numberExp = /(?=.*\d)/;

    tempValidation['minimunLength'] = password.length >= 8 ? true : false;

    tempValidation['containMix'] = mixExp.test(password) ? true : false;

    tempValidation['containNumber'] = numberExp.test(password) ? true : false;

    setvalidations(tempValidation);
  };

  //login api call
  const submitNewPassword = async e => {
    e.preventDefault();
    setBtnLoading(true);
    setErrors({});
    const { password, confirm_password } = initials;
    const res = await fetchRequest({
      url: `/create_password/${tokenId}`,
      method: 'POST',
      body: { password: password || '', confirm_password: confirm_password || '' },
    });
    setBtnLoading(false);
    if (res && res.status === 200) {
      const { message } = await res.json();
      message && setNotification({ show: false, message: message, type: 'success' });
      setTimeout(() => {
        props.history.push('/sign-in');
      }, 2000);
    } else if (res && res.status === 422) {
      const { errors } = await res.json();
      setErrors(errors);
    } else if (res && res.status === 400) {
      const { message } = await res.json();
      message && setNotification({ show: false, message: message, type: 'error' });
    }
  };

  const { password, confirm_password } = initials;
  return (
    <SectionWrapper sectionClass="sign-in">
      <Notification {...notification} />
      <div className="col-md-12">
        <div className="content-wrapper">
          <span className="black-heading">Set Your New Password</span>
          <form onSubmit={submitNewPassword} className="sign-in-form mt-4 text-center">
            <div className="form-group mb-3">
              <TextInput
                placeholder="Enter Password"
                value={password}
                type="password"
                onChange={e => onHandleChange(e.target.value, 'password')}
                error={errors && errors['password']}
                showPass
              ></TextInput>
            </div>
            <div className="form-group mb-4">
              <TextInput
                placeholder="Confirm Password"
                value={confirm_password}
                type="password"
                onChange={e => onHandleChange(e.target.value, 'confirm_password')}
                error={errors && errors['confirm_password']}
                showPass
              ></TextInput>
            </div>
            <div className="ml-1 mb-4 text-left password-validation">
              Password should contain :
              <ul>
                <li className={`d-flex ${validation.minimunLength ? 'validated' : ''}`}>
                  <p className="validation-icon">{CheckedCircleSuccess}</p>
                  <p className="validation-text">Minimum 8 Digits</p>
                </li>
                <li className={`d-flex ${validation.containMix ? 'validated' : ''}`}>
                  <p className="validation-icon">{CheckedCircleSuccess}</p>
                  <p className="validation-text">Mix of UPPERCASE and lowercase</p>
                </li>
                <li className={`d-flex ${validation.containNumber ? 'validated' : ''}`}>
                  <p className="validation-icon">{CheckedCircleSuccess}</p>
                  <p className="validation-text">A number (0-9)</p>
                </li>
              </ul>
            </div>
            <div className="form-group mb-4">
              <ContainedButton
                type="submit"
                black
                className="login-btn"
                disabled={btnLoading || !(validation.minimunLength && validation.containMix && validation.containNumber)}
              >
                {btnLoading ? (
                  <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                  </div>
                ) : (
                  <span>Set Password</span>
                )}
              </ContainedButton>
            </div>
          </form>
        </div>
      </div>
    </SectionWrapper>
  );
}

export default SetNewPassword;
