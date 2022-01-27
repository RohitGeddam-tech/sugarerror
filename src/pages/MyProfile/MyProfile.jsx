import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TextButton } from '../../components/Buttons/Button';
import Card from '../../components/Common/Card/Card';
import CheckboxInput from '../../components/FormInputs/Checkbox/CheckboxInput';
import TextInput from '../../components/FormInputs/TextInput/TextInput';
import Notification from '../../components/Notification/Notification';
import { ProfileContext } from '../../context/context';
import Details from './Details';
import DetailsModal from './DetailsModal';
import ResetPasswordModal from '../../components/Modal/ResetPasswordModal';

function MyProfile() {
  const { profile } = useContext(ProfileContext);
  const [showPass, setShowPass] = useState(false);
  const [initials, setInitials] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [modal, setModal] = useState({ isModalOpen: false, api: '', title: '', field: { label: '', value: '', name: '' } });
  const [resendPassModal, toggleResendPassModal] = useState({ isModalOpen: false, api: '' });
  const [isEdit, setEdit] = useState({});
  const { changePassword } = useLocation().state || false;

  useEffect(() => {
    changePassword && setEdit({ password: true });
  }, [changePassword]);

  useEffect(() => {
    setInitials(initials => ({ ...initials, ...profile.data, current_password: '', new_password: '', confirm_password: '' }));
  }, [profile]);

  const { first_name, last_name, mobile, email, current_password, new_password, confirm_password } = initials;
  const onHandleChange = (value, key) => {
    let obj = { ...initials };
    obj[key] = value;
    setInitials({ ...obj });
  };

  return (
    <div className="my-profile">
      <Notification {...notification} />
        <Card>
          <Details
            id={'name'}
            isEdit={isEdit}
            setEdit={setEdit}
            label="Name"
            value={`${first_name} ${last_name}`}
            form={
              <div className="row mb-4">
                <div className="form-group col-md-6 col-12">
                  <TextInput
                    hasGrayBack={true}
                    placeholder="First Name*"
                    value={first_name || ''}
                    onChange={e => onHandleChange(e.target.value, 'first_name')}
                    error={errors && errors['first_name']}
                  />
                </div>
                <div className="form-group col-md-6 col-12">
                  <TextInput
                    hasGrayBack={true}
                    placeholder="Last Name*"
                    value={last_name || ''}
                    onChange={e => onHandleChange(e.target.value, 'last_name')}
                    error={errors && errors['last_name']}
                  />
                </div>
              </div>
            }
            api={'/user_profile/name'}
            dataToSave={{ first_name, last_name }}
            setErrors={setErrors}
            notification={notification}
            setNotification={setNotification}
          />
          <Details
            id={'mobile'}
            isEdit={isEdit}
            setEdit={setEdit}
            label="Mobile Number"
            value={mobile}
            form={
              <div className="row mb-4 d-flex justify-content-end">
                <div className="form-group col-md-6 col-12">
                  <TextInput
                    hasGrayBack={true}
                    placeholder="Mobile No."
                    value={mobile || ''}
                    onChange={e => onHandleChange(e.target.value, 'mobile')}
                    error={errors && errors['mobile']}
                    disabled={true}
                  />
                </div>
                <div className="col-sm-12 col-md-3 mr-2 text-right">
                  <TextButton
                    blue
                    onClick={() =>
                      setModal({
                        isModalOpen: true,
                        api: '/user_profile/mobile',
                        title: 'Change Mobile No.',
                        field: { label: 'New Mobile No.', value: mobile, name: 'mobile' },
                      })
                    }
                  >
                    CHANGE NUMBER
                  </TextButton>
                </div>
              </div>
            }
            // api={'/user_profile/mobile'}
            dataToSave={{ mobile, type: 'send_otp' }}
            setErrors={setErrors}
            notification={notification}
            setNotification={setNotification}
            noEdit
          />
          <Details
            id={'email'}
            isEdit={isEdit}
            setEdit={setEdit}
            label="Email"
            value={email}
            form={
              <div className="row mb-4 d-flex justify-content-end">
                <div className="form-group col-md-6 col-12">
                  <TextInput
                    hasGrayBack={true}
                    placeholder="Email"
                    value={email || ''}
                    onChange={e => onHandleChange(e.target.value, 'email')}
                    error={errors && errors['email']}
                    disabled={true}
                  />
                </div>
                <div className="col-sm-12 col-md-3 mr-2 text-right">
                  <TextButton
                    blue
                    onClick={() =>
                      setModal({
                        isModalOpen: true,
                        api: '/user_profile/email',
                        title: 'Change Email',
                        field: { label: 'New Email', value: email, name: 'email' },
                      })
                    }
                  >
                    CHANGE EMAIL
                  </TextButton>
                </div>
              </div>
            }
            api={'/user_profile/email'}
            dataToSave={{ email, type: 'send_otp' }}
            setErrors={setErrors}
            notification={notification}
            setNotification={setNotification}
            noEdit
          />
          <Details
            id={'password'}
            isEdit={isEdit}
            setEdit={setEdit}
            label="Password"
            value={'**********'}
            form={
              <div className="change-password-div d-flex justify-content-center">
                <div className="display-width">
                  <div className="row mb-2 mb-md-4 w-100">
                    <div className="form-group col-md-12 col-12">
                      <TextInput
                        hasGrayBack={true}
                        placeholder="Current Password"
                        value={current_password || ''}
                        type={showPass ? 'text' : 'password'}
                        onChange={e => onHandleChange(e.target.value, 'current_password')}
                        error={errors && errors['current_password']}
                      />
                    </div>
                  </div>
                  <div className="row mb-2 w-100">
                    <div className="form-group col-md-12 col-12">
                      <TextInput
                        hasGrayBack={true}
                        placeholder="New Password"
                        value={new_password || ''}
                        type={showPass ? 'text' : 'password'}
                        onChange={e => onHandleChange(e.target.value, 'new_password')}
                        error={errors && errors['new_password']}
                      />
                    </div>
                  </div>
                  <div className="row mb-2 w-100">
                    <div className="form-group col-md-12 col-12">
                      <TextInput
                        hasGrayBack={true}
                        placeholder="Confirm New Password"
                        value={confirm_password || ''}
                        type={showPass ? 'text' : 'password'}
                        onChange={e => onHandleChange(e.target.value, 'confirm_password')}
                        error={errors && errors['confirm_password']}
                      />
                    </div>
                  </div>
                  <div className="row mb-4 w-100">
                    <div className="change-password-footer col-md-12 col-12 d-flex justify-content-between">
                      <Link
                        className="forget-pass mt-1"
                        to={'#'}
                        onClick={() => toggleResendPassModal({ isModalOpen: true, setErrors, setNotification })}
                      >
                        Forgot Password?
                      </Link>
                      <div className="ml-1">
                        <CheckboxInput
                          blue
                          name="show-pass"
                          label="Show Password"
                          value={showPass}
                          checked={showPass}
                          onClick={() => setShowPass(!showPass)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            api={'/user_profile/password'}
            dataToSave={{ current_password, new_password, confirm_password }}
            setErrors={setErrors}
            notification={notification}
            setNotification={setNotification}
          />
        </Card>
      <DetailsModal actionObject={modal} setNotification={setNotification} />
      <ResetPasswordModal actionObject={resendPassModal} />
    </div>
  );
}
export default MyProfile;
