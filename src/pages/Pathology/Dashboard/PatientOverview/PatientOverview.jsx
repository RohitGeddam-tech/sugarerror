import React, { useCallback, useContext, useEffect, useState } from 'react';
import Table from '../../../../components/Table/Table';
import Card from '../../../../components/Common/Card/Card';
import { ProfileContext } from '../../../../context/context';
import { fetchRequest, makeRequest } from '../../../../utils/api';
import { OutlinedButton, TextButton } from '../../../../components/Buttons/Button';
import Notification from '../../../../components/Notification/Notification';

const cardHeaders = [
  {
    label: 'Date/Time',
    accessKey: 'created_at',
    width: '30%',
  },
  {
    label: 'Name',
    accessKey: 'name',
    classes: 'main-content semi-bold',
    width: '40%',
  },
  {
    label: 'Status',
    width: '30%',
    cellRenderer: ({ status, formatted_status }) => (
      <OutlinedButton className={`patient-status-btn ${status}`}>{formatted_status}</OutlinedButton>
    ),
  },
];

const PatientOverview = props => {
  const { profile } = useContext(ProfileContext);
  const [overviewData, setOverviewData] = useState([]);
  const [isLabAdmin, setLabAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const loginAs = localStorage.getItem('loginAs');

  useEffect(() => {
    if (profile?.selectedRole?.role?.name === 'lab_admin') setLabAdmin({ admin: true });
    else setLabAdmin({ admin: false });
  }, [profile.selectedRole]);

  const getOverviewData = useCallback(() => {
    (async () => {
      setLoading(true);
      if (profile?.selectedRole?.uuid && isLabAdmin) {
        const res = await fetchRequest({
          url: `${isLabAdmin.admin ? '/lab_group' : '/lab'}/${profile?.selectedRole?.uuid}/dashboard/patient_overview`,
          method: 'GET',
          isAuth: true,
        });
        res && setLoading(false);
        if (res && res.status === 200) {
          const data = await res.json();
          setOverviewData(data.data);
          return data;
        }
        return;
      }
    })();
  }, [profile, isLabAdmin]);

  useEffect(() => {
    if (profile?.selectedRole?.uuid && isLabAdmin) getOverviewData();
  }, [profile, isLabAdmin, getOverviewData]);

  const addPackageToCart = selectedPackage => {
    setNotification({ show: false, message: '', type: '' });
    (async () => {
      if (profile?.selectedRole?.uuid && isLabAdmin) {
        const res = await fetchRequest({
          url: `/lab_group/${profile?.selectedRole?.uuid}/cart`,
          method: 'POST',
          isAuth: true,
          body: { package: selectedPackage.uuid },
        });
        if (res && res.status === 200) {
          const { data, message } = await res.json();
          setNotification({
            show: true,
            message,
            type: 'success',
            callback: function () {
              props.history.push('/checkout');
            },
          });
          return data;
        } else if (res && res.status === 400) {
          const { message } = await res.json();
          setNotification({ show: true, message, type: 'error' });
        }
        return;
      }
    })();
  };

  const checkCart = async () =>{
    const {data, status} = await makeRequest({
      url: `/lab_group/${profile?.selectedRole?.uuid}/cart`,
      method: 'GET',
      isAuth: true,
    });
    if (status === 200 && data && data.data) {
      if(data.data?.uuid) props.history.push({pathname : '/checkout', state : { disableCancel : true }});
      else props.history.push({ pathname: '/packages', state: { lab_id: profile?.selectedRole?.uuid } });
    }
    return;
  }
  const upgradePackagePath = `/${loginAs}/upgrade-package`;

  const isRenewable = overviewData.package?.package?.renewable;
  const trialPackage = overviewData.package?.package?.trial_package;

  return (
    <div className="dashboard-container patient-overview-container">
      <div className="row">
        <Notification {...notification} />
        <div className="col-md-4 col-12 wd-37">
          <Card title="Recent Patients">
            <Table
              // title="testing_done"
              isLoading={loading}
              columnDefs={cardHeaders}
              tableData={overviewData.recent_patients}
              footerLink={`/${localStorage.getItem('loginAs')}/patients/list`}
            />
          </Card>
        </div>
        <div className="col-md-4 col-12 centered-content wd-37">
          <Card title="Reports Due">
            <Table
              title="testing_done"
              isLoading={loading}
              columnDefs={cardHeaders}
              tableData={overviewData.reports_due}
              footerLink={`/${localStorage.getItem('loginAs')}/patients/list`}
            />
          </Card>
        </div>
        <div className="col-md-4 col-12 wd-25">
          <Card title="Today’s Patient Count" cardType="number" centerHeader={true} isLoading={loading}>
            {overviewData.todays_patient_count}
          </Card>
          <Card title="My Account" cardType="number" centerHeader={true} isLoading={loading}>
            <div className="flex-column text-center">
              <div className="flex-column">
                <p>{(overviewData.package && overviewData.package.credits_left) || '-'}</p>
                <p className="unit">credits remaining</p>
              </div>
              <hr />
              <div className="flex-column">
                <p>{(overviewData.package && overviewData.package.package_validity) || '-'}</p>
                <p className="unit">days remaining</p>
              </div>
              <hr className="my-account-divider" />
              <div className="flex-column text-center mt-4">
                {isLabAdmin?.admin ? (
                  <>
                    {isRenewable && trialPackage && overviewData.package && (
                      <>
                        <TextButton blue className="text-uppercase mb-2" onClick={() => addPackageToCart(overviewData.package.package)}>
                          renew package
                        </TextButton>
                        <br />
                      </>
                    )}
                    <TextButton blue className="text-uppercase" onClick={() => isLabAdmin ? checkCart() : props.history.push({ pathname: upgradePackagePath, state: { lab_id: profile?.selectedRole?.uuid, status: "upgrade"  } })}>
                      upgrade package
                    </TextButton>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientOverview;
