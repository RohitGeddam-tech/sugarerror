import React, { useState, useEffect, useContext } from 'react';
import SelectInput from '../../components/FormInputs/SelectInput/SelectInput';
import Slick from '../../components/Slick/Slick';
import PackageCard from '../../components/Common/PackageCard/PackageCard';
import Container from '../../components/Wrappers/Container';
import useWindowSize from '../../hooks/userWindowSize';
import { ContainedButton, TextButton } from '../../components/Buttons/Button';
import { fetchRequest } from '../../utils/api';
import { ProfileContext } from '../../context/context';
import { LeftArrow } from '../../assets/icons';

const options = [
  { value: 'monthly_package', label: 'Monthly Packs', formatted_label: 'for 1 month' },
  { value: 'quarterly_package', label: 'Quarterly Packs', formatted_label: 'for 3 months' },
  { value: 'half_yearly_package', label: 'Half-Yearly Packs', formatted_label: 'for 6 months' },
  { value: 'yearly_package', label: 'Yearly Packs', formatted_label: 'for 1 year' },
];

const Packages = props => {
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);
  const [width] = useWindowSize();
  const [selectedPackage, setPackage] = useState({
    value: 'monthly_package',
    label: 'Monthly Packs',
  });
  const [labId, setLabId] = useState();
  const [packages, setPackages] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    if (profile && profile.selectedRole) {
      setLabId(profile.selectedRole.uuid);
    }
  }, [profile]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!packages.length) {
      (async () => {
        let url = null,
          isAuth;
        if (profile?.selectedRole && profile.selectedRole.uuid && profile.selectedRole.role.name === 'lab_admin') {
          url = `/lab_group/${profile.selectedRole.uuid}/get_packages`;
          isAuth = true;
        } else if ((loginAs === 'super-admin' || loginAs === 'assistant-admin') && (props.history.location?.state?.lab_id || false)) {
          url = `/lab_group/${props.history.location.state.lab_id}/get_packages`;
          isAuth = true;
        } else {
          props.history.push('/login-as');
        }
        // else {
        //   url = '/packages';
        //   isAuth = false;
        // }

        if (url) {
          const res = await fetchRequest({
            url,
            method: 'GET',
            isAuth,
          });
          if (res && res.status === 200) {
            const data = await res.json();
            setPackages(data);
            return data;
          }
          return;
        }
      })();
    }
  }, [profile, loginAs, packages.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const addPackageToCart = (selectedPackage, ind) => {
    (async () => {
      setBtnLoading({ index: ind, state: true });
      let url = null;
      if (loginAs === 'lab-admin' && labId) {
        url = `/lab_group/${labId}/cart`;
      } else if ((loginAs === 'super-admin' || loginAs === 'assistant-admin') && (props.history.location?.state?.lab_id || false)) {
        url = `/lab_group/${props.history.location.state.lab_id}/cart`;
      }
      if (url) {
        const res = await fetchRequest({
          url,
          method: 'POST',
          isAuth: true,
          body: { package: selectedPackage.uuid },
        });
        res && setBtnLoading({ index: ind, state: false });
        if (res && res.status === 200) {
          const data = await res.json();
          if ((loginAs === 'super-admin' || loginAs === 'assistant-admin') && (props.history.location?.state?.lab_id || false)) {
            props.history.push({ pathname: '/checkout', state: { lab_id: props.history.location.state.lab_id } });
          } else {
            props.history.push({ pathname: '/checkout', state: { title: 'checkout' } });
          }
          return data;
        }
      }
      return;
    })();
  };

  const getPackageCard = packages => {
    return (
      <>
        {packages.length
          ? packages.map(val =>
              val.type === selectedPackage.value && val.packages.length
                ? val.packages.map((item, key) => (
                    <PackageCard
                      key={key}
                      data={{
                        name: item.trial_package ? 'Free trial' : `₹ ${item.amount}`,
                        value: item.label,
                        expiary: item.type,
                        patients: item.credits,
                        details: item.description,
                        isRed: item.trial_package,
                      }}
                      className={item.trial_package ? 'active' : ''}
                      showBtn
                      BtnFooter={() => (
                        <div className="d-flex justify-content-center mb-3">
                          <ContainedButton
                            onClick={() => addPackageToCart(item, key)}
                            black
                            loading={btnLoading && btnLoading.index === key && btnLoading.state}
                            disabled={btnLoading && btnLoading.index === key && btnLoading.state}
                          >
                            {profile ? 'Select' : 'Get Started'}
                          </ContainedButton>
                        </div>
                      )}
                    />
                  ))
                : null,
            )
          : null}
      </>
    );
  };

  return (
    <div className="package-container-content gray-package-container">
      <Container>
        <TextButton
          onClick={() => {
            let redirectTo = null;
            if (profile?.selectedRole && profile.selectedRole.uuid && profile.selectedRole.role.name === 'lab_admin') {
              redirectTo = '/lab-admin/setting/lab-details/package-details';
            } else if ((loginAs === 'super-admin' || loginAs === 'assistant-admin') && (props.history.location?.state?.lab_id || false)) {
              redirectTo = `/${loginAs}/lab-details/package-details`;
            }
            redirectTo && props.history.push(redirectTo);
          }}
          blue
        >
          <div className="d-flex">
            <span className="mr-2">{LeftArrow}</span>
            <p>BACK TO PACKAGE DETAILS</p>
          </div>
        </TextButton>
        <div className="package-header mt-4">
          {width <= 767 ? (
            <div className="form-group">
              <SelectInput options={options} value={selectedPackage} onChange={value => setPackage(value)}></SelectInput>
            </div>
          ) : (
            <ul className="nav package-nav mb-4">
              {options.map((val, ind) => (
                <li className={`nav-item ${selectedPackage.value === val.value ? 'active' : ''}`} key={ind} onClick={() => setPackage(val)}>
                  <span className="nav-link" data-active={val.value}>
                    {val.label}
                  </span>
                  <span className="nav-border"></span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="package-body">
          {width <= 767 ? (
            <>
              <Slick>{getPackageCard(packages)}</Slick>
              {/* <div className="custom-package-wrapper">
                <PackageCard data={customPackage} showBtn showInfoIcon></PackageCard>
              </div> */}
            </>
          ) : (
            <>
              <div className="d-flex package-card-wrapper">
                {getPackageCard(packages)}
                {/* {width >= 992 ? <PackageCard data={customPackage} showBtn></PackageCard> : ''} */}
              </div>
              {/* {width < 992 && width >= 768 ? (
                <div className="custom-package-wrapper">
                  <PackageCard data={customPackage} showBtn></PackageCard>
                </div>
              ) : (
                ''
              )} */}
            </>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Packages;
