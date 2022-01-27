import React, { useEffect, useState, useContext } from 'react';
import Card from '../../../components/Common/Card/Card';
import TextInput from '../../../components/FormInputs/TextInput/TextInput';
import { OutlinedButton, ContainedButton } from '../../../components/Buttons/Button';
import { LongBackArrow } from '../../../assets/icons';
import { fetchRequest } from '../../../utils/api';
import { ProfileContext } from '../../../context/context';
import Notification from '../../../components/Notification/Notification';

const BranchAdd = props => {
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);
  const [labId, setLabId] = useState(); //lab_group uuid from profile api
  const [branchDetails, setBranchDetails] = useState({
    name: (props.branchDetails && props.branchDetails.name) || '',
    address_line_one: (props.branchDetails && props.branchDetails.address_line_one) || '',
    address_line_two: (props.branchDetails && props.branchDetails.address_line_two) || '',
    pincode: (props.branchDetails && props.branchDetails.pincode) || '',
    city: (props.branchDetails && props.branchDetails.city) || '',
    state: (props.branchDetails && props.branchDetails.state) || '',
    mobile: (props.branchDetails && props.branchDetails.mobile) || '',
    email: (props.branchDetails && props.branchDetails.email) || '',
  });
  const [errors, setErrors] = useState({});
  const [btnLoading, setBtnLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    if (profile && loginAs === 'lab-admin') {
      setLabId(profile.selectedRole.uuid);
    } else if (profile && (loginAs === 'super-admin' || loginAs === 'assistant-admin')) {
      setLabId(profile.selectedLabId);
    }
  }, [profile, loginAs]);

  const handleChange = (value, key) => {
    let obj = { ...branchDetails };
    obj[key] = value;
    setBranchDetails({ ...obj });
  };

  const saveBranch = async () => {
    setBtnLoading(true);
    setErrors({});
    setNotification({ show: false, message: '', type: '' });
    const body = {
      ...branchDetails,
      lab_name: branchDetails.name,
    };
    let url = null;
    if (props.isEdit) {
      url = loginAs === 'lab' ? `/lab/${profile.selectedRole.uuid}` : `/lab_group/${labId}/lab/${props.branchDetails.uuid}`;
    } else url = `/lab_group/${labId}/lab`;
    if (url) {
      const res = await fetchRequest({
        url,
        method: props.isEdit ? 'PUT' : 'POST',
        isAuth: true,
        body,
      });
      res && setBtnLoading(false);
      if (res && res.status === 200) {
        const { data, message } = await res.json();
        setNotification({ show: true, message, type: 'success' });
        setTimeout(() => {
          props.setIsEditable ? props.setIsEditable(false) : props.history.goBack();
          props.onSuccessCallback && props.onSuccessCallback();
        }, 2000);
        return data;
      } else if (res && res.status === 422) {
        const errObj = await res.json();
        setErrors({ ...errObj.errors });
        res.status !== 422 &&
          !Object.keys(errObj.error ? errObj.error : {}).length &&
          errObj.message &&
          setNotification({ show: true, message: errObj.message, type: 'error' });
      }
    }
  };
  const { name = '', address_line_one, address_line_two, pincode, city, state, mobile, email } = branchDetails;
  return (
    <div className="add-branch-wrapper">
      <Notification {...notification} />
      <Card cardName="add-branch-card">
        <form>
          <div className="row">
            <div className="form-group col-5 mb-3">
              <TextInput
                value={name || ''}
                onChange={e => handleChange(e.target.value, 'name')}
                error={errors && errors['lab_name']}
                placeholder="Branch Name*"
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
            {' '}
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
          onClick={() =>
            (props.setIsEditable && props.setIsEditable(false)) ||
            // (props && props.history && props.history.push('/lab-admin/setting/lab-details/branch-details'))
            (props && props.history && props.history.goBack())
          }
          disabled={btnLoading}
        >
          <div className="d-flex align-items-center">
            {LongBackArrow}
            <p className="ml-1">Go Back</p>
          </div>
        </OutlinedButton>
        <ContainedButton darkBlue className="ml-3" onClick={saveBranch} loading={btnLoading} disabled={btnLoading}>
          Save
        </ContainedButton>
      </div>
    </div>
  );
};

export default BranchAdd;
