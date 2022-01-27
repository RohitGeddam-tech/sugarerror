import React, { useState, useEffect, useContext, useCallback } from 'react';
import { downloadFileIcon, More } from '../../../assets/icons';
import { TextButton } from '../../../components/Buttons/Button';
import Card from '../../../components/Common/Card/Card';
import Notification from '../../../components/Notification/Notification';
import Table from '../../../components/Table/Table';
import { ProfileContext } from '../../../context/context';
import { fetchRequest, makeRequest } from '../../../utils/api';
import { rupeeSymbol } from '../../../utils/constants';

// const actionList = [
//   { key: 'edit', label: 'Edit details' },
//   { key: 'deactivate', label: 'Temporarily De-activate User' },
//   { key: 'activate', label: 'Activate User' },
//   { key: 'delete', label: 'Permanently Delete User' },
// ];

function sanityCheck(param) {
  return Array.isArray(param) && param.length === 0 ? null : param;
}

const PackageDetails = props => {
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);
  const [labId, setLabId] = useState(null); //lab_group uuid from profile api
  const [packageHistory, setPackageHistory] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);

  const headers = [
    {
      label: 'Package Type',
      width: '15%',
      cellRenderer: row => (row.package.category === 'custom' ? 'Custom Package' : row.package.formatted_type),
    },
    {
      label: 'Price of Package',
      isAmount: true,
      width: '15%',
      cellRenderer: row => rupeeSymbol + ' ' + (row?.package?.amount || 0),
    },
    {
      label: 'Patients',
      width: '10%',
      cellRenderer: row => row?.package?.credits || '0',
    },
    {
      label: 'Start Date',
      accessKey: 'package_active_on',
      width: '18%',
    },
    {
      label: 'End Date',
      accessKey: 'package_expire_on',
      width: '18%',
    },
    {
      label: '',
      accessKey: 'actions',
      width: '20%',
      renderIcon: More,
      cellRenderer: row => (
        <TextButton
          blue
          className="text-uppercase download-receipt-btn"
          onClick={() => row?.receipt_url && downloadReceipt(row.receipt_url, row.package.formatted_type)}
        >
          <div className="d-flex align-items-center">
            {downloadFileIcon}
            <p className="ml-2">Download Receipt</p>
          </div>
        </TextButton>
      ),
    },
  ];

  useEffect(() => {
    const { labId } = props.location.state ? props.location.state : {};
    if (labId) {
      setLabId(labId);
    }
  }, [props]);

  useEffect(() => {
    if (profile && loginAs === 'lab-admin') {
      setLabId(profile.selectedRole.uuid);
    } else if (profile && (loginAs === 'super-admin' || loginAs === 'assistant-admin')) {
      setLabId(profile.selectedLabId);
    }
  }, [profile, loginAs]);

  const checkCart = async () =>{
    const {data, status} = await makeRequest({
      url: `/lab_group/${labId}/cart`,
      method: 'GET',
      isAuth: true,
    });
    if (status === 200 && data && data.data) {
      if(data.data?.uuid) props.history.push({pathname : '/checkout', state : { disableCancel : true }});
      else props.history.push({ pathname: '/packages', state: { lab_id: labId } });
    }
    return;
  }

  const downloadReceipt = useCallback(async (url, name) => {
    const res = await fetchRequest({ url, method: 'GET', isAuth: true, withBaseUrl: 'true' });
    if (res && res.status === 200) {
      const data = await res.blob();
      const file = new Blob([data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      const downloadLink = document.createElement('a');
      const fileName = `${name}.pdf`;
      downloadLink.href = fileURL;
      downloadLink.download = fileName;
      downloadLink.click();
      return data;
    }
  }, []);

  const getPackageHistory = useCallback(async () => {
    setLoading(true);
    const res = await fetchRequest({ url: `/lab_group/${labId}/package_history`, method: 'GET', isAuth: true });
    res && setLoading(false);
    if (res && res.status === 200) {
      const { data } = await res.json();
      setPackageHistory(data);
      return data;
    }
    return;
  }, [labId]);

  useEffect(() => {
    labId && getPackageHistory();
  }, [labId, getPackageHistory]);

  const addPackageToCart = selectedPackage => {
    setNotification({ show: false, message: '', type: '' });
    (async () => {
      const res = await fetchRequest({
        url: `/lab_group/${labId}/cart`,
        method: 'POST',
        isAuth: true,
        body: { package: selectedPackage.uuid },
      });
      if (res && res.status === 200) {
        const { data, message } = await res.json();
        setNotification({
          show: true,
          message : "Package renewed successfully",
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
    })();
  };
  const creditsLeft = sanityCheck(packageHistory.current_package) ? packageHistory.current_package.credits_left : '-';
  const daysLeft = sanityCheck(packageHistory.current_package) ? packageHistory.current_package.package_validity : '-';
  const isRenewable = sanityCheck(packageHistory.current_package) ? packageHistory.current_package.package.renewable : false;
  const trialPackage = sanityCheck(packageHistory.current_package) ? packageHistory.current_package.package.trial_package : false;

  const upgradePackagePath = `/${loginAs}/upgrade-package`;
  return (
    <div className="row w-100">
      <Notification {...notification} />
      <div className="col-md-9">
        <div className={`paper paper-card`}>
          <div className={`content-header d-flex align-items-baseline justify-content-between`}>
            <p className="semi-bold title">Current Package</p>
          </div>
          <Table
            columnDefs={headers}
            tableData={sanityCheck(packageHistory.current_package) ? [{ ...packageHistory.current_package }] : []}
            isLoading={loading}
          />
          <div className={`content-header d-flex align-items-baseline justify-content-between mt-4`}>
            <p className="semi-bold title">Previous Packages</p>
          </div>
          <Table columnDefs={headers} tableData={packageHistory.previous_packages} isLoading={loading} />
        </div>
      </div>
      <div className="col-md-3">
        <Card title="My Account" cardType="number" centerHeader={true}>
          <div className="flex-column text-center">
            <div className="flex-column">
              <p>{creditsLeft}</p>
              <p className="unit">credits remaining</p>
            </div>
            <hr />
            <div className="flex-column">
              <p>{daysLeft}</p>
              <p className="unit">days remaining</p>
            </div>
            <hr className="my-account-divider" />
            <div className="flex-column text-center">
              {isRenewable && !trialPackage && packageHistory.current_package && (
                <>
                  <TextButton blue className="text-uppercase mb-2"
                  onClick={() => ['lab-admin'].includes(loginAs) ? addPackageToCart(packageHistory.current_package.package) : props.history.push({ pathname: upgradePackagePath, state: { lab_id: labId, action_status: "renew", current_package: packageHistory.current_package.package } })}
                  >
                    Renew CURRENT Package
                  </TextButton>
                  <br />
                </>
              )}
              <TextButton
                blue
                className="text-uppercase"
                onClick={() => ['lab-admin'].includes(loginAs) ? checkCart() : props.history.push({ pathname: upgradePackagePath, state: { lab_id: labId, status: "upgrade"  } })}
              >
                upgrade package
              </TextButton>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default PackageDetails;
