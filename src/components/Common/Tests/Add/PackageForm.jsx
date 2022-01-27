import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { OutlinedButton } from '../../../../components/Buttons/Button';
import AsyncSelectInput from '../../../../components/FormInputs/AsyncSelectInput/AsyncSelectInput';
import SelectInput from '../../../../components/FormInputs/SelectInput/SelectInput';
import TextInput from '../../../../components/FormInputs/TextInput/TextInput';
import Notification from '../../../../components/Notification/Notification';
import { ProfileContext } from '../../../../context/context';
import { fetchRequest } from '../../../../utils/api';
import { validateForm } from '../../../../utils/custom';
import { GenderList } from '../../../../utils/masters';
import { useParams } from 'react-router-dom';

const defaultState = {
  name: '',
  gender: null,
  cost: '',
  tests: [],
};

const PackageForm = props => {
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);
  const { testId } = useParams();
  const [packageData, setPackageData] = useState({ ...defaultState });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [btnLoading, setBtnLoading] = useState(false);
  const [masterTestList, setMasterTestList] = useState([]);
  const [tests, setTests] = useState([]);
  const { name, gender, cost } = packageData;

  let testMasterBaseUrl = '';
  if (loginAs == 'lab-admin') testMasterBaseUrl = `/lab_group/${profile?.selectedRole?.uuid}/`;
  else if (loginAs == 'lab') testMasterBaseUrl = `/lab/${profile?.selectedRole?.uuid}/`;

  useEffect(() => {
    if (props.obj && props.obj.testData) {
      setPackageData({ ...props.obj.testData });
      let temp = props.obj.testData.sub_tests?.length ? props.obj.testData.sub_tests.map(test => ({ label: test.name, value: test.uuid })) : [];
      setTests(temp);
    }
  }, [props]);

  useEffect(() => {
    if (packageData?.gender?.value) {
      getMasterTestList();
    }
  }, [packageData.gender]); // eslint-disable-line react-hooks/exhaustive-deps

  const getMasterTestList = async search => {
    const res = await fetchRequest({ url: `${testMasterBaseUrl}tests${search ? `?search=${search}` : ''}`, method: 'GET', isAuth: true });
    if (res && res.status === 200) {
      const { data } = await res.json();
      const newData =
        data &&
        data.length &&
        [...data].filter(test => test.type === 'test' || test.type === 'panel').map(test => ({ label: test.name, value: test.uuid }));
      setMasterTestList([...newData]);
      return newData;
    }
    return;
  };

  const handleCancel = () => {
    if (testId) {
      const viewTestLink = ['lab-admin','lab'].includes(loginAs) ? `/${loginAs}/setting/view-test/${testId}` : `/${loginAs}/view-test/${testId}`;
      props.history.push(viewTestLink);
    } else {
    setPackageData({ ...defaultState });
      setTests([]);
    }
  };
console.log(tests)
  const onHandleChange = (value, key) => {
    let obj = { ...packageData };
    if (key === 'gender' && value !== packageData.gender) {
      obj.tests = [];
    }
    obj[key] = value;
    setPackageData({ ...obj });
  };

  const handleAddPackage = async e => {
    setBtnLoading(true);
    setErrors({});
    setNotification({ show: false, message: '', type: '' });
    e.preventDefault();

    const errors = validateForm({ name, gender: gender && gender.value, tests: tests?.length ? [...tests].map(val => val.value) : null });
    setErrors({ ...errors });

    if (!Object.keys(errors).length) {
      let body = {
        type: 'package',
        name: packageData.name,
        cost: packageData.cost,
        gender: packageData.gender && packageData.gender.value,
        tests: [...tests].map(val => val.value),
      };

      let url = `${testMasterBaseUrl}tests`,
        method = 'POST';

      if (testId) {
        url = `${url}/${testId}`;
        method = 'PUT';
      }
      if (url) {
        const res = await fetchRequest({
          url,
          method,
          isAuth: true,
          body,
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
    } else {
      setBtnLoading(false);
    }
  };

  return (
    <div className="form-content">
      <Notification {...notification} />
      <div className="paper">
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
              placeholder="Cost (in ₹)"
              value={cost || ''}
              onChange={e => onHandleChange(e.target.value, 'cost')}
              error={errors && errors['cost']}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="form-group col-md-12 col-12">
            <label className="gray-label mb-1">Select Tests*</label>
            <AsyncSelectInput
              isMulti
              options={masterTestList}
              FilterData={getMasterTestList}
              noOptionsMessage="Search & Select Tests"
              value={tests}
              onChange={option => (option && option.length ? setTests([...option]) : setTests())}
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
            onClick={handleCancel}
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

export default PackageForm;
