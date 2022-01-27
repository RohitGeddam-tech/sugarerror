import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { OutlinedButton } from '../../../../components/Buttons/Button';
import AsyncSelectInput from '../../../../components/FormInputs/AsyncSelectInput/AsyncSelectInput';
import SelectInput from '../../../../components/FormInputs/SelectInput/SelectInput';
import TextInput from '../../../../components/FormInputs/TextInput/TextInput';
import Notification from '../../../../components/Notification/Notification';
import { ProfileContext } from '../../../../context/context';
import { fetchRequest } from '../../../../utils/api';
import { GenderList } from '../../../../utils/masters';

const defaultState = {
  name: '',
  gender: null,
  cost: '',
  tests: [],
};

const AddTestPackage = props => {
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);
  const [initials, setInitials] = useState({ ...defaultState });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [btnLoading, setBtnLoading] = useState(false);
  const [masterTestList, setMasterTestList] = useState([]);
  const [updateTestPackage, setUpdateTestPackage] = useState(false);
  const { branchId } = useLocation().state;

  useEffect(() => {
    if (props.location.state && props.location.state.packageData) {
      const data = { ...props.location.state.packageData };
      data.tests = data.tests.map(test => ({ label: test.name, value: test.uuid }));
      data.gender = GenderList.find(gender => gender.value === data.gender);
      setInitials({ ...data });
      setUpdateTestPackage(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (initials?.gender?.value) {
      getMasterTestList();
      setInitials(initials => ({ ...initials }));
    } else {
      // getMasterTestList();
    }
  }, [initials.gender]); // eslint-disable-line react-hooks/exhaustive-deps

  const getMasterTestList = useCallback(
    async search => {
      let url = null;
      if (loginAs === 'lab-admin') {
        url = `/lab/${branchId}/test_master`;
      } else if (loginAs === 'lab' && profile?.selectedRole?.uuid) {
        url = `/lab/${profile.selectedRole?.uuid}/test_master`;
      }
      if (url) {
        const res = await fetchRequest({
          url: `${url}?${search ? `search=${search}` : ''}${initials.gender?.value ? `&gender=${initials.gender.value}` : ''}`,
          method: 'GET',
          isAuth: true,
        });
        if (res && res.status === 200) {
          const { data } = await res.json();
          const newData =
            data &&
            data.length &&
            [...data].filter(test => test.type === 'test' || test.type === 'panel').map(test => ({ label: test.name, value: test.uuid }));
          setMasterTestList(newData);
          return newData;
        }
        return;
      }
    },
    [loginAs, branchId, profile, initials],
  );

  const onHandleChange = (value, key) => {
    let obj = { ...initials };
    if (key === 'gender' && value !== initials.gender) {
      obj.tests = [];
    }
    obj[key] = value;
    setInitials({ ...obj });
  };

  const handleAddPackage = async e => {
    setBtnLoading(true);
    setErrors({});
    setNotification({ show: false, message: '', type: '' });
    e.preventDefault();
    let postObj = {
      name : initials.name,
      cost : initials.cost,
      gender: initials.gender && initials.gender.value,
      tests: [...initials.tests].map(val => val.value),
    };
    let url = null;
    if ((loginAs === 'lab-admin' || loginAs === 'super-admin' || loginAs === 'assistant-admin') && branchId) {
      url = `/lab/${branchId}/test_packages${updateTestPackage ? `/${initials.uuid}` : ''}`;
    } else if (loginAs === 'lab') {
      url = `/lab/${profile.selectedRole.uuid}/test_packages${updateTestPackage ? `/${initials.uuid}` : ''}`;
    }
    if (url) {
      const res = await fetchRequest({
        url,
        method: updateTestPackage ? 'PUT' : 'POST',
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
        setErrors({ ...errObj.errors });
        res.status !== 422 &&
          !Object.keys(errObj.error ? errObj.error : {}).length &&
          errObj.message &&
          setNotification({ show: true, message: errObj.message, type: 'error' });
      }
      return;
    }
  };

  const { name, gender, cost, tests } = initials;
  return (
    <div className="form-content-with-space">
      <Notification {...notification} />
      <div className="paper">
        <label className="paper-label semi-bold mb-3">Please enter the required details</label>
        <div className="row mb-4">
          <div className="form-group col-md-5 col-12">
            <TextInput
              placeholder="Package Name*"
              value={name || ''}
              onChange={e => onHandleChange(e.target.value, 'name')}
              error={errors && errors['name']}
            />
          </div>
          <div className="form-group col-md-4 col-12">
            <SelectInput
              placeholder="Gender*"
              options={GenderList}
              value={gender}
              onChange={data => onHandleChange(data, 'gender')}
              error={errors && errors['gender']}
            />
          </div>
          <div className="form-group col-md-3 col-12">
            <TextInput
              placeholder="Cost (in ₹)*"
              value={cost || ''}
              onChange={e => onHandleChange(e.target.value, 'cost')}
              error={errors && errors['cost']}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="form-group col-md-12 col-12">
            <label className="gray-label mb-1">Select Tests</label>
            <AsyncSelectInput
              isMulti
              options={masterTestList}
              FilterData={getMasterTestList}
              noOptionsMessage="Search & Select Tests"
              value={tests}
              onChange={option => (option && option.length ? onHandleChange([...option], 'tests') : onHandleChange([], 'tests'))}
              error={errors && errors['tests']}
            />
          </div>
        </div>
      </div>
      <div className="row mb-4 text-center">
        <div className="col-md-12">
          <OutlinedButton
            red
            className="mr-2"
            onClick={() => {
              setInitials(defaultState);
              props.history.goBack();
            }}
            disabled={btnLoading}
          >
            Cancel
          </OutlinedButton>
          <OutlinedButton blue onClick={handleAddPackage} disabled={btnLoading} btnLoading={btnLoading}>
            Save
          </OutlinedButton>
        </div>
      </div>
    </div>
  );
};

export default AddTestPackage;
