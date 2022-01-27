import React, { useCallback, useContext, useEffect, useState } from 'react';
import { SectionWrapper } from '../../components/Wrappers/SectionWrapper';
import { ProfileContext } from '../../context/context';
import { Link } from 'react-router-dom';
import { getInitials } from '../../utils/custom';
import { fetchRequest } from '../../utils/api';
import { getNewRoles } from '../../utils/custom';

function LoginOptions(props) {
  const { profile, setProfileData } = useContext(ProfileContext);
  const { roles } = profile ? profile : localStorage.getItem('roles') ? JSON.parse(localStorage.getItem('roles')) : {};
  const { first_name, last_name } = (profile && profile.data) || {};
  const [loading, setLoading] = useState(false);
  const firstName = localStorage.getItem('first_name');
  const lastName = localStorage.getItem('last_name');
  
  const checkUserRoleCount = useCallback(async () => {
    setLoading(true);
    const profileRes = await fetchRequest({ url: `/user_profile?include=roles,lab_access`, method: 'GET', isAuth: true });
    if (profileRes && profileRes.status === 200) {
      setLoading(false);
      const { data } = await profileRes.json();
      const { roles } = data;
      let newRoles = [];
      if (roles && roles.length) {
        newRoles = getNewRoles({ ...data });
      }
      if (newRoles && newRoles.length === 1) {
        props.history.push(`/${newRoles[0].role.name.split('_').join('-')}`);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    window.scrollTo(0, 0);
    checkUserRoleCount();
  }, [profile]); // eslint-disable-line react-hooks/exhaustive-deps

  const setSelectedRole = useCallback(
    item => {
      localStorage.setItem('loginAs', item.role.name.split('_').join('-'));
      localStorage.setItem('selectedRole', JSON.stringify(item));
      setProfileData({ selectedRole: { ...item } });
      props.history.push(`/${item.role.name.split('_').join('-')}`);
    },
    [setProfileData, props],
  );

  return (
    <SectionWrapper sectionClass="login-as">
      <div className="col-md-12">
        <div className="content-wrapper">
          <span className="black-heading">Login as:</span>
          <div className="btn-wrapper">
            {loading && (
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            )}
            {roles &&
              roles.map((item, ind) => (
                <div className="flex-column w-100" key={ind}>
                  <Link
                    key={ind}
                    to={`/`}
                    onClick={() => setSelectedRole(item)}
                    className="row login-option d-flex align-items-center mb-3 p-2 mx-0"
                  >
                    <div className="col-3 w-100">
                      <p className={`user-img small role_${item.role.name}`}>
                        {getInitials(`${firstName ?? first_name ?? ''} ${lastName ?? last_name ?? ''}`)}
                      </p>
                    </div>
                    <div className="col-9 w-100 text-left login-as">
                      <p className="user-name">{`${firstName ?? first_name ?? ''} ${lastName ?? last_name ?? ''}`}</p>
                      <p className="lab-name">{item.role.formatted_name}</p>
                      <div className="d-flex">
                        {item.lab_name && <p className="lab-name">{`${item.lab_name} `}</p>}
                        {item.branch_name && <p className="lab-name ml-1">{` - ${item.branch_name}`}</p>}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

export default LoginOptions;
