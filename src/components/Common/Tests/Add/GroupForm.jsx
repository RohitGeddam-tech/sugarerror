import React, { useContext, useEffect, useState } from 'react';
import { OutlinedButton } from '../../../../components/Buttons/Button';
import RadioButton from '../../../../components/FormInputs/RadioButton/RadioButton';
import TextInput from '../../../../components/FormInputs/TextInput/TextInput';
import { fetchRequest } from '../../../../utils/api';
import Notification from '../../../../components/Notification/Notification';
import AsyncSelectInput from '../../../../components/FormInputs/AsyncSelectInput/AsyncSelectInput';
import { useParams } from 'react-router-dom';
import { ProfileContext } from '../../../../context/context';
import { validateForm } from '../../../../utils/custom';

const GroupForm = props => {
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);
  const { testId } = useParams();
  const [masterTestList, setMasterTestList] = useState([]);
  const [tests, setTests] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [btnLoading, setBtnLoading] = useState(false);

  let testMasterBaseUrl = '/super_admin/';
  if(loginAs == "lab-admin") testMasterBaseUrl = `/lab_group/${profile?.selectedRole?.uuid}/`;
  else if(loginAs == "lab") testMasterBaseUrl = `/lab/${profile?.selectedRole?.uuid}/`;

  useEffect(() => {
    if (props.obj && props.obj.testData) {
      setGroupName(props.obj.testData.name);
      let temp = props.obj.testData.sub_tests?.length
        ? props.obj.testData.sub_tests.map(test => ({ label: test.name, value: test.uuid }))
        : [];
      setTests(temp);
    }
  }, [props]);

  const handleCancel = () => {
    if (testId) {
      const viewTestLink = ['lab-admin','lab'].includes(loginAs) ? `/${loginAs}/setting/view-test/${testId}` : `/${loginAs}/view-test/${testId}`;
      props.history.push(viewTestLink);
    } else {
      setGroupName('');
      setTests([]);
    }
  };

  const getMasterTestList = async search => {
    const res = await fetchRequest({ url: `${testMasterBaseUrl}tests${search ? `?search=${search}` : ''}`, method: 'GET', isAuth: true });
    if (res && res.status === 200) {
      const { data } = await res.json();
      const newData =
        data && data.length && [...data].filter(test => test.type === 'test').map(test => ({ label: test.name, value: test.uuid }));
      setMasterTestList(newData);
      return newData;
    }
    return;
  };

  const handleAddGroup = async () => {
    setErrors({});
    setBtnLoading(true);
    setNotification({ show: false, message: '', type: '' });
    
    const errors = validateForm({ name:groupName, test_ids: tests?.length });
    setErrors({ ...errors });

    if (!Object.keys(errors).length) {
      let body = {
        type: 'group',
        name: groupName,
        test_ids: tests?.length ? [...tests].map(val => val.value) : [],
      };

      let url = `${testMasterBaseUrl}tests`, urlMethod = 'POST';
      
      if (testId) {
        url = `${url}/${testId}`;
        urlMethod = 'PUT';
      }
      if (url) {
        const res = await fetchRequest({ url, method: urlMethod, isAuth: true, body });
        setBtnLoading(false);
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
      }
    } else{
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
              placeholder="Group Name*"
              value={groupName || ''}
              onChange={e => setGroupName(e.target.value)}
              error={errors && errors['name']}
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
              error={errors && errors['test_ids']}
            />
          </div>
        </div>
      </div>
      <div className="row mb-4 text-center">
        <div className="col-md-12">
          <OutlinedButton red className="mr-2" onClick={handleCancel}>
            Cancel
          </OutlinedButton>
          <OutlinedButton blue onClick={handleAddGroup} disabled={btnLoading} loading={btnLoading}>
            Save
          </OutlinedButton>
        </div>
      </div>
    </div>
  );
};

export default GroupForm;
