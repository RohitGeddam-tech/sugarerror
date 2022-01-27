import React, { useEffect, useState } from 'react';
import { SectionWrapper } from '../../components/Wrappers/SectionWrapper';
import TextInput from '../../components/FormInputs/TextInput/TextInput';
import { ContainedButton } from '../../components/Buttons/Button';
import { Link, NavLink } from 'react-router-dom';
import { makeRequest } from '../../utils/api';
import { Cancel } from '../../assets/icons';
import ResetPasswordModal from '../../components/Modal/ResetPasswordModal';
import Notification from '../../components/Notification/Notification';
import { getNewRoles } from '../../utils/custom';

function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); //123456
  // const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState();
  const [message, setMessage] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const [resendPassModal, toggleResendPassModal] = useState({ isModalOpen: false, api: '' });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  //login api call
  const login = async e => { //TODO :  getRequest(url,headers,body,)
    e.preventDefault();
    setBtnLoading(true);
    setMessage(null);

    const { data, status, errors, message } = await makeRequest({
      url: '/login',
      method: 'POST',
      body: { username: email || '', password: password || '' },
    });
    setBtnLoading(false);

    if (status === 200) {
      const { token_type, access_token, refresh_token } = data;
      localStorage.setItem('token', `${token_type} ${access_token}`);
      localStorage.setItem('refresh_token', `${refresh_token}`);

      //checks profile
      (async () => {
        const { data, status } = await makeRequest({ url: `/user_profile?include=roles,lab_access`, method: 'GET', isAuth: true });
        if (status === 200) {
          const { roles } = data;
          let newRoles = [];
          if (roles && roles.length) {
            newRoles = getNewRoles({ ...data });
          }
          if (newRoles && newRoles.length === 1) {
            localStorage.setItem('loginAs', newRoles[0].role.name.split('_').join('-'));
            localStorage.setItem('selectedRole', JSON.stringify(newRoles[0]));
            props.history.push(`/${newRoles[0].role.name.split('_').join('-')}`);
          } else props.history.push({ pathname: '/login-as', state: { roles } });
        }
        return;
      })();
    } else if (status === 422) {
      setBtnLoading(false);
      setErrors(errors);
    } else if (status === 400) {
      setBtnLoading(false);
      message && setMessage(message);
    }
  };

  return (
    <SectionWrapper sectionClass="sign-in">
      <Notification {...notification} />
      <div className="col-md-12">
        <div className="content-wrapper">
          <span className="black-heading">Sign in to your account</span>
          <form onSubmit={login} className="sign-in-form mt-4 text-center">
            {message && (
              <div className="err-msg mb-3">
                {Cancel}
                <p>{message}</p>
              </div>
            )}
            <div className="form-group mb-3">
              <TextInput
                placeholder="Mobile No. / Email ID"
                value={email}
                onChange={e => setEmail(e.target.value)}
                error={errors && errors['username']}
              ></TextInput>
            </div>
            <div className="form-group mb-4">
              <TextInput
                placeholder="Password"
                value={password}
                type="password"
                onChange={e => setPassword(e.target.value)}
                error={errors && errors['password']}
                showPass
              ></TextInput>
            </div>
            <div className="d-flex justify-content-between px-1 mb-4">
              <div className="d-flex">
                {/* <div className="ml-2">
                  <Checkbox
                    name="remember-me"
                    label="Remember Me"
                    checked={rememberMe}
                    onClick={() => setRememberMe(!rememberMe)}
                  ></Checkbox>
                </div> */}
              </div>
              <div>
                <Link
                  className="forget-pass mt-1"
                  to={'#'}
                  onClick={() => toggleResendPassModal({ isModalOpen: true, setErrors, setNotification })}
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="form-group mb-4">
              <ContainedButton type="submit" red className="login-btn" disabled={btnLoading}>
                {btnLoading ? (
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <span>Login</span>
                )}
              </ContainedButton>
            </div>
            <p>
              Don’t have an account? Register{' '}
              <NavLink to="/packages" className="red-text text-underline">
                <u>here</u>
              </NavLink>{' '}
              for free
            </p>
          </form>
        </div>
      </div>
      <ResetPasswordModal actionObject={resendPassModal} />
    </SectionWrapper>
  );
}

export default Login;
