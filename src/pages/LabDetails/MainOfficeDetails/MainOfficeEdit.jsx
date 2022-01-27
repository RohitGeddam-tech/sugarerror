import React, { useEffect, useState, useContext, useCallback } from 'react';
import Card from '../../../components/Common/Card/Card';
import TextInput from '../../../components/FormInputs/TextInput/TextInput';
import { OutlinedButton, ContainedButton } from '../../../components/Buttons/Button';
import { LongBackArrow } from '../../../assets/icons';
import { fetchRequest } from '../../../utils/api';
import { ProfileContext } from '../../../context/context';
import ConfirmationModal from '../../../components/Modal/ConfirmationModal';
import Loader from '../../../components/Loader/Loader';
import Notification from '../../../components/Notification/Notification';
import { getUpdatedRoleData } from '../../../utils/custom';

const defaultState = {
  name: '',
  address_line_one: '',
  address_line_two: '',
  pincode: '',
  city: '',
  state: '',
  mobile: '',
  email: '',
};

function Edit(props) {
  const { profile, setProfileData } = useContext(ProfileContext);
  const [labId, setLabId] = useState(); //lab_group uuid from profile api
  const [actionObject, setActionObject] = useState({});
  const [mainOfficeDetails, setMainOfficeDetails] = useState({ ...defaultState });
  const [unchangedData, setUnchangedData] = useState({ ...defaultState });
  const [errors, setErrors] = useState({});
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const getLabGroupDetails = useCallback(async lab_id => {
    setLoading(true);
    const res = await fetchRequest({ url: `/lab_group/${lab_id}`, method: 'GET', isAuth: true });
    if (res && res.status === 200) {
      setLoading(false);
      const { data } = await res.json();
      setMainOfficeDetails(data);
      setUnchangedData(data);
      return data;
    }
    return;
  }, []);

  useEffect(() => {
    if (!labId && profile?.selectedRole?.uuid) {
      setLabId(profile.selectedRole.uuid);
      getLabGroupDetails(profile.selectedRole.uuid);
    }
  }, [profile, labId, getLabGroupDetails, setLabId]);

  const handleChange = (value, key) => {
    let obj = { ...mainOfficeDetails };
    obj[key] = value;
    if (errors[key] && errors[key].length) {
      let errObj = { ...errors };
      errObj[key] = null;
      setErrors(errObj);
    }

    setMainOfficeDetails({ ...obj });
  };

  const saveBranch = async () => {
    setBtnLoading(true);
    setNotification({ show: false, message: '', type: '' });
    const body = {
      ...mainOfficeDetails,
    };
    const res = await fetchRequest({ url: `/lab_group/${labId}`, method: 'PUT', isAuth: true, body });
    res && setBtnLoading(false);

    if (res && res.status === 200) {
      const { data, message } = await res.json();
      const updatedRoleData = await getUpdatedRoleData(profile.selectedRole.uuid);
      setProfileData({ selectedRole: updatedRoleData });
      localStorage.setItem('selectedRole', JSON.stringify(updatedRoleData));

      setNotification({
        show: true,
        message,
        type: 'success',
        callback: function () {
          props.history.push('/lab-admin/setting/lab-details/main-office-details');
        },
      });
      return data;
    } else if (res && res.status === 422) {
      const errObj = await res.json();
      setErrors({ ...errObj.errors });
      res.status !== 422 &&
        !Object.keys(errObj.error ? errObj.error : {}).length &&
        errObj.message &&
        setNotification({ show: true, message: errObj.message, type: 'error' });
    }
  };

  const handleGoBack = useCallback(
    () => {
      if(unchangedData !== mainOfficeDetails)
        setActionObject({
          title: 'Unsaved Changes',
          msg: 'You have not saved the changes made. Are you sure you want to discard the changes?',
          cancelAction: 'Close',
          confirmAction: 'Yes, discard changes',
          redirect: '/lab-admin/setting/lab-details/main-office-details',
          isModalOpen: true,
          ...props,
        });
      else props.history.push('/lab-admin/setting/lab-details/main-office-details');
    },
    [],
  )

  const { name, address_line_one, address_line_two, pincode, city, state, mobile, email } = mainOfficeDetails;
  return (
    <div className="add-branch-wrapper">
      <Loader loading={loading} />
      <Notification {...notification} />
      {!loading && (
        <>
          <Card cardName="add-branch-card">
            <form>
              <div className="row">
                <div className="form-group col-5 mb-3">
                  <TextInput
                    value={name || ''}
                    onChange={e => handleChange(e.target.value, 'name')}
                    error={errors && errors['name']}
                    placeholder="Office Name*"
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group col-6 mb-3">
                  <TextInput
                    value={address_line_one || ''}
                    onChange={e => handleChange(e.target.value, 'address_line_one')}
                    error={errors && errors['address_line_one']}
                    placeholder="Address Line 1*"
                  />
                </div>
                <div className="form-group col-6 mb-3">
                  <TextInput
                    value={address_line_two || ''}
                    onChange={e => handleChange(e.target.value, 'address_line_two')}
                    error={errors && errors['address_line_two']}
                    placeholder="Address Line 2*"
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group col-4 mb-3">
                  <TextInput
                    value={pincode || ''}
                    onChange={e => handleChange(e.target.value, 'pincode')}
                    error={errors && errors['pincode']}
                    placeholder="Pincode*"
                  />
                </div>
                <div className="form-group col-4 mb-3">
                  <TextInput
                    value={city || ''}
                    onChange={e => handleChange(e.target.value, 'city')}
                    error={errors && errors['city']}
                    placeholder="City*"
                  />
                </div>
                <div className="form-group col-4 mb-3">
                  <TextInput
                    value={state || ''}
                    onChange={e => handleChange(e.target.value, 'state')}
                    error={errors && errors['state']}
                    placeholder="State*"
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group col-4 mb-3">
                  <TextInput
                    value={mobile || ''}
                    onChange={e => handleChange(e.target.value, 'mobile')}
                    error={errors && errors['mobile']}
                    placeholder="Mobile No*"
                  />
                </div>
                <div className="form-group col-4 mb-3">
                  <TextInput
                    value={email || ''}
                    onChange={e => handleChange(e.target.value, 'email')}
                    error={errors && errors['email']}
                    placeholder="Email*"
                  />
                </div>
              </div>
            </form>
          </Card>
          <div className="d-flex justify-content-center">
            <OutlinedButton
              onClick={handleGoBack}
              disabled={btnLoading}
            >
              <div className="d-flex align-items-center">
                {LongBackArrow}
                <p className="ml-1">Go Back</p>
              </div>
            </OutlinedButton>
            <ContainedButton darkBlue className="ml-3" onClick={saveBranch} disabled={btnLoading} loading={btnLoading}>
              Save
            </ContainedButton>
          </div>
        </>
      )}
      <ConfirmationModal actionObject={actionObject}></ConfirmationModal>
    </div>
  );
}
export default Edit;
