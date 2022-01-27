import React, { useContext, useEffect, useState } from 'react';
import { OutlinedButton } from '../../../../components/Buttons/Button';
import Card from '../../../../components/Common/Card/Card';
import SelectInput from '../../../../components/FormInputs/SelectInput/SelectInput';
import TextInput from '../../../../components/FormInputs/TextInput/TextInput';
import Notification from '../../../../components/Notification/Notification';
import { ProfileContext } from '../../../../context/context';
import { fetchRequest } from '../../../../utils/api';
import { validateForm } from '../../../../utils/custom';
import { PatientGenderList } from '../../../../utils/masters';

const defaultState = {
  first_name: '',
  last_name: '',
  mobile: '',
  email: null,
  address: null,
  pincode: '',
  city: '',
  state: '',
  gender: '',
  degree: '',
  blood_group: null,
};

const AddDoctor = props => {
  const { profile } = useContext(ProfileContext);
  const [initials, setInitials] = useState({ ...defaultState });
  const [error, setError] = useState({});
  const [disabledInput, setDisabledInput] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [btnLoading, setBtnLoading] = useState(false);
  const [branchList, setBranchList] = useState([]);
  const [branch, setSelectedBranch] = useState({});
  const [updateDoctor, setUpdateDoctor] = useState(false);

  useEffect(() => {
    if (props.location.state) {
      const { lab_id, lab_name } = props.location.state;
      setInitials({ ...props.location.state });
      setUpdateDoctor(true);
      setSelectedBranch({ label: lab_name, value: lab_id });
    } else setUpdateDoctor(false);
  }, [props.location.state]);

  useEffect(() => {
    if (profile.selectedRole.uuid && profile.selectedRole.role.name === 'lab_admin') {
      (async () => {
        const statusRes = await fetchRequest({ url: `/lab_group/${profile.selectedRole.uuid}/get_labs`, method: 'GET', isAuth: true });
        if (statusRes && statusRes.status === 200) {
          const { data } = await statusRes.json();
          setBranchList(data.map(item => ({ value: item.uuid, label: item.name })));
        }
        return;
      })();
    }
  }, [profile.selectedRole]);

  const getDetailsFromMobile = async mobile => {
    setDisabledInput(false);
    setError({});
    setNotification({ show: false, message: '', type: '' });
    const res = await fetchRequest({ url: `/get_user_details?mobile=${mobile}`, method: 'GET', isAuth: true });
    if (res && res.status === 200) {
      const { data } = await res.json();
      if (data && data.length !== 0) {
        setInitials({
          ...initials,
          address: '',
          pincode: '',
          city: '',
          state: '',
          gender: '',
          specialist_in: '',
          degree: '',
          uuid: null,
          ...data,
        });
        setDisabledInput(true);
      } else {
        setInitials({
          ...initials,
          first_name: '',
          last_name: '',
          email: '',
          address: '',
          pincode: '',
          city: '',
          state: '',
          gender: '',
          specialist_in: '',
          degree: '',
          mobile,
          uuid: null,
        });
      }
      return data;
    }
    return;
  };

  const onHandleChange = (value, key) => {
    let obj = { ...initials };
    obj[key] = value;
    setInitials({ ...obj });
    if (key === 'mobile' && value.toString().length === 10) getDetailsFromMobile(value);
    else setDisabledInput(false);
  };

  const handleSubmit = async e => {
    setBtnLoading(true);
    setError({});
    setNotification({ show: false, message: '', type: '' });
    e.preventDefault();

    const errors = validateForm({ first_name, last_name, mobile, pincode, city, state, gender, branch });
    setError({ ...errors });

    if (!Object.keys(errors).length) {
      let postObj = {
        ...initials,
        gender: initials.gender && initials.gender.value,
      };
      delete postObj.uuid;
      let url = `/lab/${branch && branch.value ? branch.value : profile.selectedRole.uuid}/referred_by${updateDoctor ? `/${initials.uuid}` : ''}`;
      const res = await fetchRequest({
        url,
        method: updateDoctor ? 'PUT' : 'POST',
        isAuth: true,
        body: postObj,
      });
      res && setBtnLoading(false);
      if (res && res.status === 200) {
        const data = await res.json();
        if (data.success) {
          data.message && setNotification({ show: true, message: data.message, type: 'success' });
          setTimeout(() => props.history.goBack(), 2000);
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
    } else {
      setBtnLoading(false);
    }
  };

  const { first_name, last_name, mobile, email, address, pincode, city, state, degree, gender, specialist_in } = initials;
  return (
    <div className="add-package-container">
      <Notification {...notification} />
      <div className="row">
        <div className="col-md-8 col-12">
          <form onSubmit={handleSubmit}>
            <Card title="Doctor's Details">
              <div className="row mb-4">
                <div className="form-group col-md-6 col-12">
                  <TextInput
                    placeholder="Mobile No.*"
                    value={mobile || ''}
                    onChange={e => onHandleChange(e.target.value, 'mobile')}
                    error={error && error['mobile']}
                  />
                </div>
                <div className="form-group col-md-6 col-12">
                  <TextInput
                    placeholder="Email"
                    value={email || ''}
                    onChange={e => onHandleChange(e.target.value, 'email')}
                    error={error && error['email']}
                    disabled={disabledInput}
                  />
                </div>
              </div>
              <div className="row mb-4">
                <div className="form-group col-md-6 col-12">
                  <TextInput
                    placeholder="First Name*"
                    value={first_name || ''}
                    onChange={e => onHandleChange(e.target.value, 'first_name')}
                    error={error && error['first_name']}
                    disabled={disabledInput}
                  />
                </div>
                <div className="form-group col-md-6 col-12">
                  <TextInput
                    placeholder="Last Name*"
                    value={last_name || ''}
                    onChange={e => onHandleChange(e.target.value, 'last_name')}
                    error={error && error['last_name']}
                    disabled={disabledInput}
                  />
                </div>
              </div>
              <div className="row mb-4">
                <div className="form-group col-md-12 col-12">
                  <TextInput
                    placeholder="Address"
                    value={address || ''}
                    onChange={e => onHandleChange(e.target.value, 'address')}
                    error={error && error['address']}
                  />
                </div>
              </div>
              <div className="row mb-4">
                <div className="form-group col-md-4 col-12">
                  <TextInput
                    placeholder="Pincode*"
                    value={pincode || ''}
                    onChange={e => onHandleChange(e.target.value, 'pincode')}
                    error={error && error['pincode']}
                  />
                </div>
                <div className="form-group col-md-4 col-12">
                  <TextInput
                    placeholder="City*"
                    value={city || ''}
                    onChange={e => onHandleChange(e.target.value, 'city')}
                    error={error && error['city']}
                  />
                </div>
                <div className="form-group col-md-4 col-12">
                  <TextInput
                    placeholder="State*"
                    value={state || ''}
                    onChange={e => onHandleChange(e.target.value, 'state')}
                    error={error && error['state']}
                  />
                </div>
              </div>
              <div className="row mb-4">
                <div className="form-group col-md-4 col-12">
                  <SelectInput
                    placeholder="Gender*"
                    options={PatientGenderList}
                    value={gender}
                    onChange={data => onHandleChange(data, 'gender')}
                    error={error && error['gender']}
                  />
                </div>
                <div className="form-group col-md-4 col-12">
                  <TextInput
                    placeholder="Degree"
                    value={degree || ''}
                    onChange={e => onHandleChange(e.target.value, 'degree')}
                    error={error && error['degree']}
                  />
                </div>
                <div className="form-group col-md-4 col-12">
                  <TextInput
                    placeholder="Specialization"
                    value={specialist_in || ''}
                    onChange={e => onHandleChange(e.target.value, 'specialist_in')}
                    error={error && error['specialist_in']}
                  />
                </div>
              </div>
              {profile.selectedRole.role.name === 'lab_admin' && (
                <div className="row">
                  <div className="form-group col-md-6">
                    <SelectInput
                      placeholder="Select Branch*"
                      options={branchList}
                      value={branch}
                      onChange={data => setSelectedBranch(data)}
                      disabled={updateDoctor}
                      error={error && error['branch']}
                    />
                  </div>
                </div>
              )}
              <div className="row mt-5 mb-4">
                <div className="col-12">
                  <div className="w-100 d-flex justify-content-center">
                    <OutlinedButton
                      className="mr-2"
                      onClick={() => (updateDoctor ? props.history.goBack() : setInitials(defaultState))}
                      red
                      disabled={btnLoading}
                    >
                      Cancel
                    </OutlinedButton>
                    <OutlinedButton className="" blue type="submit" loading={btnLoading} disabled={btnLoading}>
                      Save
                    </OutlinedButton>
                  </div>
                </div>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDoctor;
