import React, { useEffect, useState } from 'react';
import PaymentDetails from '../../Admin/PathLabs/Add/PaymentDetails';
import PackageDetails from '../../Admin/PathLabs/Add/PackageDetails';
import Notification from '../../../components/Notification/Notification';
import { fetchRequest } from '../../../utils/api';

const defaultState = {
  paymentDetails: {
    payment_mode: '',
    received_from: '',
    bank_name: '',
    cheque_number: '',
    notes: null,
  },
};

const UpgradePackage = props => {
  const [userDetails, setUserDetails] = useState({ ...defaultState.userDetails });
  const [labDetails, setLabDetails] = useState({
    ...defaultState.labDetails,
  });
  const [selectedPackage, setPackage] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    ...defaultState.paymentDetails,
  });
  const [customPackage, setCustomPackage] = useState({});
  const [error, setError] = useState({});
  const [cancel, setCancel] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [btnLoading, setBtnLoading] = useState(false);

  const { lab_id, action_status, current_package } = props.history.location?.state || {};

  useEffect(() => {
    if(current_package){
      setPackage({...current_package, label: current_package.amount ? `₹ ${current_package.amount}`:'-', value : current_package.uuid});
    }
  }, [current_package])

  const handlePackageSubmit = async e => {
    setError({});
    setBtnLoading(true);
    setNotification({ show: false, message: '', type: '' });
    e.preventDefault();
    let postObj = {
      ...customPackage,
      category: 'custom',
      // trial_package: false,
    };
    delete postObj.custom;
    const res = await fetchRequest({ url: '/super_admin/package', method: 'POST', isAuth: true, body: postObj });
    res && setBtnLoading(false);
    if (res && res.status === 200) {
      const data = await res.json();
      if (data.success) {
        setPackage({ uuid: data.data.uuid });
        handleSavePathLab({ uuid: data.data.uuid });
      }
    } else {
      const errObj = await res.json();
      setError({ ...errObj.errors });
      res.status !== 422 &&
        !Object.keys(errObj.error ? errObj.error : {}).length &&
        errObj.message &&
        setNotification({ show: true, message: errObj.message, type: 'error' });
    }
    return;
  };

  const handleSavePathLab = selectedPackage => {
    setError({});
    setBtnLoading(true);
    setNotification({ show: false, message: '', type: '' });
    let postObj = {
      package: selectedPackage.uuid ? selectedPackage.uuid : selectedPackage?.uuid,
      payment_details: paymentDetails,
    };
    (async () => {
      const res = await fetchRequest({ url: `/super_admin/labs/${lab_id}/renew_package`, method: 'POST', body: postObj, isAuth: true });
      res && setBtnLoading(false);
      if (res && res.status === 200) {
        const data = await res.json();
        data.message && setNotification({ show: true, message: data.message, type: 'success' });
        setTimeout(() => props.history.goBack(), 2500);
      } else {
        const errObj = await res.json();
        setError({ ...errObj.errors });
        res.status !== 422 &&
          !Object.keys(errObj.error ? errObj.error : {}).length &&
          errObj.message &&
          setNotification({ show: true, message: errObj.message, type: 'error' });
      }
      return;
    })();
  };

  const handleCancel = () => {
    setCancel(true);
    setUserDetails({ ...defaultState.userDetails });
    setLabDetails({ ...defaultState.labDetails });
    setPackage(null);
    setPaymentDetails({ ...defaultState.paymentDetails });
  };
  return (
    <div className="add-path-lab-container">
      <Notification {...notification} />
      <PackageDetails
        data={selectedPackage}
        setData={setPackage}
        customPackageData={customPackage}
        setCustomPackageData={setCustomPackage}
        error={error}
        setError={setError}
        cancel={cancel}
        handleSavePathLab={customPackage.custom ? handlePackageSubmit : () => handleSavePathLab(selectedPackage)}
        handleCancel={handleCancel}
      />
      {selectedPackage && selectedPackage.trial_package ? (
        <></>
      ) : (
        <PaymentDetails
          data={paymentDetails}
          setData={setPaymentDetails}
          handleSavePathLab={customPackage.custom ? handlePackageSubmit : () => handleSavePathLab(selectedPackage)}
          handleCancel={handleCancel}
          error={error}
          btnDisabled={btnLoading}
          btnLoading={btnLoading}
          saveBtnName="Save"
        />
      )}
    </div>
  );
};

export default UpgradePackage;
