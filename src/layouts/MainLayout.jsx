import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import authRoutes from '../routes/authRoutes';

import RouteGenerator from './RouteGenerator';
import PostLoginMenu from '../components/Navigation/PostLoginMenu';
import sideBarRoutes from '../routes/sideBarRoutes';
import Sidebar from '../components/Sidebar/Sidebar';
import CmsHeader from '../components/Common/CmsHeader/CmsHeader';
import useWindowSize from '../hooks/userWindowSize';
import { initialRoutes } from '../routes';
import PreLoginMenu from '../components/Navigation/PreLoginMenu';
import Footer from '../components/Footer/Footer';
import { fetchRequest } from '../utils/api';
import { ProfileContext } from '../context/context';
import { getNewRoles } from '../utils/custom';
import { CustomModal, ModalBody, ModalHeader } from '../components/Modal/Modal';

const whiteList = ['/login-as', '/checkout', '/packages'];
const routesToBeShow = ['/checkout', '/packages'];
function Main(props) {
  const selectedRole = localStorage.getItem('selectedRole') ? JSON.parse(localStorage.getItem('selectedRole')) : null;
  const selectedLabId = localStorage.getItem('selectedLabId');
  const loginAs = localStorage.getItem('loginAs');
  const { pathname, search } = useLocation();
  const [isShowSideBar, setShowSideBar] = useState(false);
  const [open, setOpen] = useState(false);
  const [currComponent, setCurrComponent] = useState('');
  const [isProtected, setProtected] = useState(false);
  const [profile, setProfile] = useState({ selectedRole });
  const [width] = useWindowSize();
  const wrapperRef = useRef(null);

  const setProfileData = useCallback(
    data => {
      setProfile({ ...profile, ...data });
      return;
    },
    [profile],
  );

  useEffect(() => {
    if (selectedLabId) setProfile(profile => ({ ...profile, selectedLabId }));
  }, [selectedLabId]);

  //checks profile
  useEffect(() => {
    if (isProtected) {
      (async () => {
        const profileRes = await fetchRequest({ url: `/user_profile?include=roles,lab_access`, method: 'GET', isAuth: true });
        if (profileRes && profileRes.status === 200) {
          const { data } = await profileRes.json();
          const { roles } = data;
          let newRoles = [];
          if (roles && roles.length) {
            newRoles = getNewRoles({ ...data });
            if (newRoles.length === 1) {
              localStorage.setItem('loginAs', newRoles[0].role.name.split('_').join('-'));
              localStorage.setItem('selectedRole', JSON.stringify(newRoles[0]));
              setProfile({ ...profile, data, selectedRole: newRoles[0] });
            } else {
              localStorage.setItem('roles', JSON.stringify({ roles: [...newRoles] }));
              setProfile({ ...profile, data, roles: [...newRoles] });
            }
          }
          if (!localStorage.getItem('loginAs')) {
            if (!routesToBeShow.includes(pathname)) {
              if (roles && roles.length === 1) {
                localStorage.setItem('loginAs', roles[0].name.split('_').join('-'));
              } else props.history.push('/login-as');
            }
          }
        }
        return;
      })();
    }
  }, [isProtected]); // eslint-disable-line react-hooks/exhaustive-deps

  // checks whether user authenticated or not
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setProtected(false);
      const redirectPath = pathname === '/sign-in' ? '/sign-in' : pathname;
      props.history.push(`${redirectPath}${search}`);
    } else {
      setProtected(true);
      let isSetting = pathname.split('/')[2] === 'setting';
      let component = sideBarRoutes.find(
        link => link.key === pathname.split('/')[isSetting ? 3 : 2] && link.role.includes(localStorage.getItem('loginAs')),
      );
      setCurrComponent(component);
      if (whiteList.includes(pathname)) setShowSideBar(false);
      else setShowSideBar(true);
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const path = pathname.split('/')[1];
    if (whiteList.includes(`/${path}`)) return;

    if (localStorage.getItem('token')) {
      if (loginAs !== path) {
        if (loginAs) {
          setProfileData({ selectedRole });
          props.history.push(`/${loginAs}`);
        } else {
          props.history.push(`/login-as`);
        }
      }
    }
  }, [loginAs, pathname, selectedRole, setProfileData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (
      !['/checkout', `/${localStorage.getItem('loginAs')}/setting/edit-main-office-details`].includes(pathname) &&
      selectedRole?.reg_status &&
      selectedRole.reg_status !== 'complete'
      ) {
        const { reg_status } = selectedRole;
      if (reg_status === 'incomplete_payment') props.history.push('/checkout');
      else if (reg_status === 'incomplete_details')
        props.history.push(`/${localStorage.getItem('loginAs')}/setting/edit-main-office-details`);
    }
  }, [pathname,selectedRole,props.history]); 

  return (
    <div className="main-layout-wrapper" ref={wrapperRef} onClick={() => open && setOpen(!open)}>
      {isProtected && profile ? (
        <>
          <ProfileContext.Provider value={{ profile, setProfileData }}>
            <PostLoginMenu width={width} open={open} setOpen={setOpen} location={props.location} />
            {isShowSideBar && <Sidebar links={sideBarRoutes} sideBarState={open} />}

            {currComponent ? (
              <CmsHeader
                tabData={currComponent.tabData}
                title={currComponent.label}
                actions={currComponent.actions}
                goBack={currComponent.goBack}
                {...props}
              />
            ) : (
              <></>
            )}
            {currComponent ? (
              <main role="main" className="cms-container">
                <div className="cms-body">
                  <RouteGenerator routes={authRoutes} sideBarState={open} mainRole={selectedRole?.role?.actual_role}/>
                </div>
              </main>
            ) : (
              <RouteGenerator routes={authRoutes} sideBarState={open} mainRole={selectedRole?.role?.actual_role}/>
            )}
          </ProfileContext.Provider>
        </>
      ) : (
        <>
          <PreLoginMenu width={width} open={open} setOpen={setOpen} match={props.match}></PreLoginMenu>
          <RouteGenerator routes={initialRoutes} sideBarState={open} />
          <Footer />
        </>
      )}
     {!props.online && 
      <CustomModal className="offline-modal" modalIsOpen={true}>
        {/* <ModalHeader closeBtn={true}></ModalHeader> */}
        <ModalBody>
          <div>It looks like you are offline. Please check your internet connection.</div>
        </ModalBody>
      </CustomModal>}
    </div>
  );
}

export default Main;
