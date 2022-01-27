import React, { useState, useEffect, useContext } from 'react';
import Card from '../../components/Common/Card/Card';
import { OutlinedButton, ContainedButton } from '../../components/Buttons/Button';
import { fetchRequest } from '../../utils/api';
import { ProfileContext } from '../../context/context';
import Notification from '../../components/Notification/Notification';
import { getUpdatedRoleData } from '../../utils/custom';

const Checkout = props => {
  const { profile, setProfileData } = useContext(ProfileContext);
  const [labId, setLabId] = useState(); //lab_group uuid from profile api
  const [cartDetails, setCartDetails] = useState('');
  const { cart_id, package_name, package_credits, package_amount } = cartDetails;
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const loginAs = localStorage.getItem('loginAs');
  const selectedRole = localStorage.getItem('selectedRole') ? JSON.parse(localStorage.getItem('selectedRole')) : null;
  const { disableCancel = false } = props.location.state || {};

  useEffect(() => {
    if (profile?.selectedRole) {
      setLabId(profile.selectedRole.uuid);
    }
  }, [profile]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    let url = null;
    // if (!props?.history?.location?.state?.title) {
    //   props.history.push(`/${profile.selectedRole.role.name.split('_').join('-')}`);
    // }
    if (props.history.location?.state?.lab_id){
      url = `/lab_group/${props.history.location.state.lab_id}/cart`;
    } else if (loginAs === 'lab-admin' && profile?.selectedRole?.uuid) {
      url = `/lab_group/${profile.selectedRole.uuid}/cart`;
    } else if ((loginAs === 'super-admin' || loginAs === 'assistant-admin') && (props.history.location?.state?.lab_id || false)) {
      url = `/lab_group/${props.history.location.state.lab_id}/cart`;
    }
    if (url) {
      (async () => {
        const statusRes = await fetchRequest({ url, method: 'GET', isAuth: true });
        if (statusRes && statusRes.status === 200) {
          let { data } = await statusRes.json();
          data = Array.isArray(data) && data.length === 0 ? null : data;
          if (data) {
            const packageData = {
              cart_id: data.uuid,
              package_name: data.package.formatted_type,
              package_credits: data.package.credits,
              package_amount: data.package.amount,
            };
            setCartDetails(packageData);
          } else {
            props.history.push('/packages');
          }
        }
        return;
      })();
    }
  }, [props.history]);
  // labId, loginAs, props.history

  const handlePayment = async () => {
    setNotification({ show: false, message: '', type: '' });
    let url = null;
    if (loginAs === 'lab-admin' && labId) {
      url = `/lab_group/${labId}/checkout/${cart_id}`;
    } else if ((loginAs === 'super-admin' || loginAs === 'assistant-admin') && (props.history.location?.state?.lab_id || false)) {
      url = `/lab_group/${props.history.location.state.lab_id}/checkout/${cart_id}`;
    }

    if (url) {
      const statusRes = await fetchRequest({ url, method: 'GET', isAuth: true });
      if (statusRes && statusRes.status === 200) {
        const data = await statusRes.json();
        const options = {
          key: data.key,
          amount: data.amount,
          name: data.name,
          description: data.description,
          order_id: data.order_id,
          handler: async response => {
            const captureRes = await fetchRequest({
              url: '/razorPay/callback_handler',
              method: 'POST',
              body: { ...response },
              isAuth: true,
            });
            const data = await captureRes.json();
            if (captureRes && captureRes.status === 200) {
              data.message &&
                setNotification({
                  show: true,
                  message: data.message,
                  type: 'success',
                });

              const updatedRoleData = await getUpdatedRoleData(profile.selectedRole.uuid);
              setProfileData({ selectedRole: updatedRoleData });
              localStorage.setItem('selectedRole', JSON.stringify(updatedRoleData));

              let redirectTo = null;
              if (profile?.selectedRole && profile.selectedRole.uuid && profile.selectedRole.role.name === 'lab_admin') {
                redirectTo = '/lab-admin/setting/lab-details/package-details';
              } else if ((loginAs === 'super-admin' || loginAs === 'assistant-admin') && (props.history.location?.state?.lab_id || false)) {
                redirectTo = `/${loginAs}/lab-details/package-details`;
                localStorage.setItem('selectedLabId', props.history.location.state.lab_id);
              }
              redirectTo && setTimeout(() => props.history.push(redirectTo), 1500);
            } else {
              const errObj = await captureRes.json();
              if (errObj.message) {
                setNotification({
                  show: true,
                  message: errObj.message,
                  type: 'error',
                });
              }
            }
          },
          theme: {
            color: '#F37254',
          },
        };
        var rzp = new window.Razorpay(options);
        rzp.open();
      }
    }
    return;
  };

  return (
    <div className="checkout-container">
      <Notification {...notification} />
      <div className="checkout-wrapper">
        <p className="black-heading checkout-big-text mb-4">Checkout</p>
        <Card>
          <div className="d-flex justify-content-between selected-package">
            <div className="flex-column text-left">
              <p className="package-name mb-1">{package_name}</p>
              <p className="package-validity">{package_credits} patients</p>
            </div>
            <p className="black-heading checkout-big-text">₹ {package_amount}</p>
          </div>
          {/* <div className="d-flex justify-content-between discount">
            <p>Discount</p>
            <p>- 10% off</p>
          </div> */}
          <div className="d-flex justify-content-between final-price">
            <p className="black-heading checkout-big-text">Total</p>
            <p className="black-heading checkout-big-text">₹ {package_amount}</p>
          </div>
        </Card>
        <div className="d-flex justify-content-end">
          <OutlinedButton black className="mr-2" onClick={() => props.history.push('/packages')} disabled={disableCancel || selectedRole?.reg_status === 'incomplete_payment'}>
            Cancel
          </OutlinedButton>
          {/* <ContainedButton black color="primary" withIcon onClick={handlePayment}> */}
          <ContainedButton black color="primary" onClick={handlePayment} withIcon>
            <div className="d-flex">
              <p>Proceed to Payment Gateway</p>
              <span className="arrow-forward-icon ml-2"></span>
            </div>
          </ContainedButton>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
