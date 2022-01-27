import React, { useState } from 'react';
import PackageDetails from './PackageDetails';
import OfficeDetails from './OfficeDetails';
import LabOwnerDetails from './LabOwnerDetails';
import PaymentDetails from './PaymentDetails';
import { fetchRequest } from '../../../../utils/api';
import Notification from '../../../../components/Notification/Notification';

const defaultState = {
  userDetails: {
    first_name: '',
    last_name: '',
    mobile: '',
    email: '',
    otp: '',
  },
  labDetails: {
    lab_name: '',
    address_line_one: '',
    address_line_two: '',
    city: '',
    state: '',
    pincode: '',
    create_branch: false,
  },
  paymentDetails: {
    payment_mode: '',
    received_from: '',
    bank_name: '',
    cheque_number: '',
    notes: null,
  },
};

const AddPathLab = props => {
  const [userDetails, setUserDetails] = useState({ ...defaultState.userDetails });
  const [labDetails, setLabDetails] = useState({
    ...defaultState.labDetails,
  });
  const [selected_package, setPackage] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    ...defaultState.paymentDetails,
  });
  const [customPackage, setCustomPackage] = useState({});
  const [error, setError] = useState({});
  const [cancel, setCancel] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [btnLoading, setBtnLoading] = useState(false);

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
      lab_details: labDetails,
      user_details: userDetails,
      package: selectedPackage.uuid ? selectedPackage.uuid : selected_package?.uuid,
      payment_details: paymentDetails,
    };
    (async () => {
      const res = await fetchRequest({ url: '/super_admin/labs', method: 'POST', body: postObj, isAuth: true });
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
      <LabOwnerDetails data={userDetails} setData={setUserDetails} error={error} setError={setError} />
      <OfficeDetails data={labDetails} setData={setLabDetails} error={error} />
      <PackageDetails
        data={selected_package}
        setData={setPackage}
        customPackageData={customPackage}
        setCustomPackageData={setCustomPackage}
        error={error}
        setError={setError}
        cancel={cancel}
        handleSavePathLab={customPackage.custom ? handlePackageSubmit : handleSavePathLab}
        handleCancel={handleCancel}
      />
      {selected_package && selected_package.trial_package ? (
        <></>
      ) : (
        <PaymentDetails
          data={paymentDetails}
          setData={setPaymentDetails}
          handleSavePathLab={customPackage.custom ? handlePackageSubmit : handleSavePathLab}
          handleCancel={handleCancel}
          error={error}
          btnDisabled={btnLoading}
          btnLoading={btnLoading}
        />
      )}
    </div>
  );
};

export default AddPathLab;
