import React, { useEffect, useState } from 'react';
import Container from '../../../../components/Wrappers/Container';
import { SectionWrapper } from '../../../../components/Wrappers/SectionWrapper';
import { ContainedButton, OutlinedButton } from '../../../../components/Buttons/Button';
import CheckboxInput from '../../../../components/FormInputs/Checkbox/CheckboxInput';
import TextInput from '../../../../components/FormInputs/TextInput/TextInput';
import PackageCard from '../../../../components/Common/PackageCard/PackageCard';
import { CheckedCircleSuccess, DoneIcon } from '../../../../assets/icons';
import { fetchRequest } from '../../../../utils/api';
import Notification from '../../../../components/Notification/Notification';
import { validateForm } from '../../../../utils/custom';

const defaultState = {
  lab_name: '',
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirm_password: '',
  mobile: '',
  otp: '',
  is_otp_generated: false,
  accept_terms: '',
};

const defaultPackage = {
  id: undefined,
  amount: '',
  value: '',
  validity: '',
  credits: '',
  description: '',
  trial_package: '',
};

const RegisterForm = props => {
  const [initials, setInitials] = useState(defaultState);
  const [errors, setError] = useState({});
  const { lab_name, first_name, last_name, email, password, confirm_password, mobile, accept_terms, is_otp_generated, otp } = initials;
  const [formLoading, setFormLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(defaultPackage);
  const registerDisabled = is_otp_generated ? (selectedPackage && selectedPackage.id ? false : true) : true;
  const generateOtpDisabled = (!first_name || !last_name || !email || mobile.length !== 10);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [validation, setvalidations] = useState([{ minimunLength: false }, { containMix: false }, { containNumber: false }]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (props.location.state && props.location.state.uuid) {
      const { uuid, amount, label, type, credits, description, trial_package } = props.location.state;
      let currentPackage = {
        id: uuid,
        // name: amount,   //Commenting this as this value is not been taken anywher
        name: trial_package ? 'Free trial' : amount ? `₹ ${amount}` : '-',
        value: label,
        expiary: type,
        patients: credits,
        details: description,
        isRed: trial_package,
      };
      setSelectedPackage({ ...currentPackage });
    } else {
      window.location.href = '/packages';
    }
    return;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onHandleChange = (value, key) => {
    let obj = { ...initials };
    obj[key] = value;
    if (key === 'password') validatePassword(value);
    setInitials({ ...obj });
  };

  const generateOTP = async resend => {
    setError({});
    const errors = validateForm({ lab_name, first_name, last_name, email, mobile, password, confirm_password });
    setError({ ...errors });
    if (!Object.keys(errors).length) {
      let url = resend ? '/resend_otp_for_registration' : '/otp_for_registration';
      let postObj = {
        mobile: initials.mobile.trim(),
        first_name: initials.first_name.trim(),
        last_name: initials.last_name.trim(),
        email: initials.email.trim(),
        type: 'pre_login_lab_registration',
      };
      const res = await fetchRequest({ url, method: 'POST', isAuth: false, body: postObj });
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
        setError({ ...errObj.errors });
        res.status !== 422 &&
          !Object.keys(errObj.error ? errObj.error : {}).length &&
          setNotification({ show: false, message: '', type: '' });
        errObj.message && setNotification({ show: true, message: errObj.message, type: 'error' });
      }
      return;
    }
  };

  const validatePassword = password => {
    const tempValidation = { ...validation };
    var mixExp = /(?=.*[a-z])(?=.*[A-Z])/,
      numberExp = /(?=.*\d)/;

    tempValidation['minimunLength'] = password.length >= 8;

    tempValidation['containMix'] = mixExp.test(password);

    tempValidation['containNumber'] = numberExp.test(password);

    setvalidations(tempValidation);
  };

  const registerLab = () => {
    setError({});
    setNotification({ show: false, message: '', type: '' });
    setFormLoading(true);

    const errors = validateForm({ lab_name, first_name, last_name, email, mobile, password, confirm_password });
    setError({ ...errors });

    if (!Object.keys(errors).length) {
      let postObj = {
        lab_details: {
          lab_name,
        },
        user_details: {
          first_name:first_name.trim(),
          last_name:last_name.trim(),
          email:email.trim(),
          password:password.trim(),
          confirm_password:confirm_password.trim(),
          mobile,
          otp
        },
        package: selectedPackage && selectedPackage.id,
      };
      (async () => {
        const res = await fetchRequest({ url: '/lab_registration', method: 'POST', isAuth: false, body: postObj });
        res && setFormLoading(false);
        if (res && res.status === 200) {
          const data = await res.json();
          if (data.success) {
            const { reg_status, uuid } = data.data;
            setInitials(defaultState);
            data.message && setNotification({ show: true, message: data.message, type: 'success' });
            if (reg_status === 'incomplete_payment') {
              login(uuid, mobile, password);
            }
          }
        } else if (res && res.status === 422) {
          const errObj = await res.json();
          const _errors = {};
          for (let key in { ...errObj.errors }) {
            if (key.indexOf('.') !== -1) {
              var arr = key.split('.');
              var index = arr[1];
              _errors[index] = { ...errObj.errors }[key];
            } else {
              _errors[key] = { ...errObj.errors }[key];
            }
          }
          setError({ ..._errors });
        } else if (res && res.status === 400) {
          const { message } = await res.json();
          setNotification({ show: true, message, type: 'error' });
        }

        return;
      })();
    } else {
      setFormLoading(false);
    }
  };

  const login = async (lab_id, mobile, password) => {
    const res = await fetchRequest({ url: '/login', method: 'POST', body: { username: mobile || '', password: password || '' } });
    if (res && res.status === 200) {
      const { token_type, access_token, refresh_token } = await res.json();
      localStorage.setItem('token', `${token_type} ${access_token}`);
      localStorage.setItem('refresh_token', `${refresh_token}`);
      props.history.push({ pathname: '/checkout', state: { lab_id } });
    }
  };

  return (
    <div className="register-section">
      <Notification {...notification} />
      <div className="clip-image-wrapper register-wrapper">
        <div className="package-container-headings">
          <Container>
            <h2 className="black-heading text-uppercase pt-5 pb-3">CREATE YOUR SUGARLOGGER ACCOUNT</h2>
          </Container>
        </div>
        <div className="register-form text-center">
          <Container>
            <div className="row row-wrapper">
              <div className="col-md-8">
                <form>
                  <div className="paper">
                    <p className="semi-bold text-left mb-3">Please enter your details</p>
                    <div className="row mb-4">
                      <div className="form-group col-md-6 col-12">
                        <TextInput
                          placeholder="Lab Name *"
                          value={lab_name || ''}
                          onChange={e => onHandleChange(e.target.value, 'lab_name')}
                          error={errors && errors['lab_name']}
                        />
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="form-group col-md-6 col-12">
                        <TextInput
                          placeholder="Your First Name *"
                          value={first_name || ''}
                          onChange={e => onHandleChange(e.target.value, 'first_name')}
                          error={errors && errors['first_name']}
                        />
                      </div>
                      <div className="form-group col-md-6 col-12">
                        <TextInput
                          placeholder="Last Name *"
                          value={last_name || ''}
                          onChange={e => onHandleChange(e.target.value, 'last_name')}
                          error={errors && errors['last_name']}
                        />
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="form-group col-md-6 col-12">
                        <TextInput
                          placeholder="Email ID *"
                          value={email || ''}
                          onChange={e => onHandleChange(e.target.value, 'email')}
                          error={errors && errors['email']}
                        />
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="form-group col-md-6 col-12">
                        <TextInput
                          placeholder="Set a password *"
                          value={password || ''}
                          onChange={e => onHandleChange(e.target.value, 'password')}
                          type="password"
                          error={errors && errors['password']}
                          showPass
                        />
                      </div>
                      <div className="form-group col-md-6 col-12">
                        <TextInput
                          placeholder="Confirm Password *"
                          value={confirm_password || ''}
                          onChange={e => onHandleChange(e.target.value, 'confirm_password')}
                          type="password"
                          error={errors && errors['confirm_password']}
                          showPass
                        />
                      </div>
                    </div>
                    <div className="ml-1 mb-4 d-flex password-validation">
                      Password should contain :
                      <ul className="ml-3">
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
                    <div className="row mb-4">
                      <div className="form-group col-md-6 col-12">
                        <TextInput
                          placeholder="Mobile No. *"
                          value={mobile || ''}
                          onChange={e => onHandleChange(e.target.value, 'mobile')}
                          error={errors && errors['mobile']}
                        />
                      </div>
                      <div className="form-group col-md-6 col-12 text-left">
                        {is_otp_generated ? (
                          <div className="d-flex align-items-end">
                            <OutlinedButton className="otp-sent" disabled>
                              <div className="d-flex">
                                <p className="mr-1 done-icon">{DoneIcon}</p> OTP Sent
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
                          <ContainedButton black className="generate-otp-btn" onClick={() => generateOTP(0)} disabled={generateOtpDisabled}>
                            Generate OTP
                          </ContainedButton>
                        )}
                      </div>
                    </div>
                    {is_otp_generated && (
                      <div className="row mb-4">
                        <div className="form-group col-md-6 col-12">
                          <TextInput
                            placeholder="Enter OTP"
                            value={otp || ''}
                            onChange={e => onHandleChange(e.target.value, 'otp')}
                            error={errors && errors['otp']}
                          />
                        </div>
                      </div>
                    )}
                    <div className="row mb-2">
                      <div className="form-group col-md-6 col-12">
                        <CheckboxInput
                          name="trial_package"
                          label="I accept the <a className='red-link' target='_blank' href='/terms-and-conditions'>Terms & Conditions</a>"
                          checked={accept_terms}
                          blue
                          value={accept_terms}
                          onClick={() => onHandleChange(!accept_terms, 'accept_terms')}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <ContainedButton
                      black
                      onClick={registerLab}
                      disabled={
                        registerDisabled ||
                        formLoading ||
                        !(validation.minimunLength && validation.containMix && validation.containNumber) ||
                        !accept_terms
                      }
                    >
                      {formLoading ? (
                        <div className="spinner-border" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      ) : (
                        <div className="d-flex">
                          Register <span className="arrow-forward-icon ml-2"></span>
                        </div>
                      )}
                    </ContainedButton>
                  </div>
                </form>
              </div>
              <div className="col-md-3">
                {selectedPackage && selectedPackage.id ? (
                  <>
                    <p className="semi-bold text-left mb-2">Your chosen package:</p>
                    <PackageCard
                      data={{
                        ...selectedPackage,
                      }}
                      className={selectedPackage.trial_package ? 'active' : ''}
                    />
                    {/* <OutlinedButton onClick={() => props.history.push({ pathname: '/packages' })} className="mt-4 mr-3">
                      Change Package
                    </OutlinedButton> */}
                  </>
                ) : (
                  <>
                    <p className="semi-bold">No chosen package</p>
                    <OutlinedButton onClick={() => props.history.push({ pathname: '/packages' })} className="mt-4">
                      Choose Package
                    </OutlinedButton>
                  </>
                )}
              </div>
            </div>
          </Container>
        </div>
      </div>
      <SectionWrapper sectionClass="contact-us">
        <div className="col-md-12">
          <div className="contact-us">
            <div className="text-content-wrapper text-center">
              <p className="section-top-hr mx-auto" />
              <h3 className="content-heading white-heading mb-4">Need help in registering yourself? Call us and we’ll help you.</h3>
            </div>
            <div className="btn-wrapper text-center">
              <ContainedButton red link to="/contact">
                Contact Us
              </ContainedButton>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default RegisterForm;
