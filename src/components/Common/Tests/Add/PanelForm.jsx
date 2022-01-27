import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OutlinedButton } from '../../../../components/Buttons/Button';
import TextEditor from '../../../../components/Common/TextEditor/TextEditor';
import AsyncSelectInput from '../../../../components/FormInputs/AsyncSelectInput/AsyncSelectInput';
import RadioButton from '../../../../components/FormInputs/RadioButton/RadioButton';
import SelectInput from '../../../../components/FormInputs/SelectInput/SelectInput';
import Textarea from '../../../../components/FormInputs/Textarea/Textarea';
import TextInput from '../../../../components/FormInputs/TextInput/TextInput';
import Notification from '../../../../components/Notification/Notification';
import { ProfileContext } from '../../../../context/context';
import { fetchRequest } from '../../../../utils/api';
import { validateForm } from '../../../../utils/custom';
import { GenderList } from '../../../../utils/masters';

const defaultState = {
  type: 'test',
  test_category: null,
  name: '',
  short_name: '',
  gender: null,
  cost: '',
};

const PanelForm = props => {
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);
  const [categories, setCategories] = useState([]);
  const { testId } = useParams();
  const [errors, setErrors] = useState({});
  const [panelData, setPanelData] = useState({ ...defaultState });
  const [masterTestList, setMasterTestList] = useState([]);
  const [tests, setTests] = useState([]);
  const { test_category, name, short_name, gender, cost } = panelData;
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [btnLoading, setBtnLoading] = useState(false);
  //Editor initials
  const [technique, setTechnique] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [method, setMethod] = useState('');
  const [remark, setRemark] = useState('');
  const [note, setNote] = useState('');
  const [loadSelectInput, setLoadSelectInput] = useState(false);

  let testMasterBaseUrl = '/super_admin/';
  if(loginAs == "lab-admin") testMasterBaseUrl = `/lab_group/${profile?.selectedRole?.uuid}/`;
  else if(loginAs == "lab") testMasterBaseUrl = `/lab/${profile?.selectedRole?.uuid}/`;

  useEffect(() => {
    getCategories();
    setTimeout(() => {
      setLoadSelectInput(true);
    }, 1000);
  }, []);

  useEffect(() => {
    if (props.obj && props.obj.testData) {
      setPanelData({ ...props.obj.testData });
      let temp = props.obj.testData.sub_tests?.length ? props.obj.testData.sub_tests.map(test => ({ label: test.name, value: test.uuid })) : [];
      setTests(temp);
      //Editor state
      setTechnique(props.obj.testData.technique);
      setInterpretation(props.obj.testData.interpretation);
      setMethod(props.obj.testData.method);
      setRemark(props.obj.testData.remark);
      setNote(props.obj.testData.note);
    }
  }, [props]);

  const handleCancel = () => {
    if (testId) {
      const viewTestLink = ['lab-admin','lab'].includes(loginAs) ? `/${loginAs}/setting/view-test/${testId}` : `/${loginAs}/view-test/${testId}`;
      props.history.push(viewTestLink);
    } else {
      setPanelData({ ...defaultState });
      setTests([]);
      //Editor state
      setTechnique('');
      setInterpretation('');
      setMethod('');
      setRemark('');
      setNote('');
    }
  };

  const getCategories = async () => {
    const res = await fetchRequest({ url: `${testMasterBaseUrl}test_categories`, method: 'GET', isAuth: true });
    if (res && res.status === 200) {
      const { data } = await res.json();
      const newData = data && data.length && [...data].map(test_category => ({ label: test_category.name, value: test_category.uuid }));
      setCategories(newData);
      return data;
    }
    return;
  };

  const getMasterTestList = async search => {
    const res = await fetchRequest({ url: `${testMasterBaseUrl}tests${search ? `?search=${search}` : ''}`, method: 'GET', isAuth: true });
    if (res && res.status === 200) {
      const { data } = await res.json();
      const newData =
        data &&
        data.length &&
        [...data].filter(test => test.type === 'test' || test.type === 'group').map(test => ({ label: test.name, value: test.uuid }));
      setMasterTestList([...newData]);
      return newData;
    }
    return;
  };

  const onHandleChange = (value, key) => {
    let obj = { ...panelData };
    obj[key] = value;
    setPanelData({ ...obj });
  };

  const handleAddPanel = async () => {
    setErrors({});
    setBtnLoading(true);
    setNotification({ show: false, message: '', type: '' });

    const errors = validateForm({ name, test_categories_id : test_category && test_category.value, gender : gender && gender.value, test_ids: tests?.length });
    setErrors({ ...errors });

    if (!Object.keys(errors).length) {
      let body = {
        type: 'panel',
        test_categories_id: test_category && test_category.value,
        name,
        short_name,
        gender: gender && gender.value,
        cost,
        test_ids: [...tests].map(val => val.value),
        technique,
        interpretation,
        method,
        remark,
        note,
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
            <SelectInput
              options={categories}
              value={test_category}
              placeholder="Category*"
              onChange={value => onHandleChange(value, 'test_category')}
              error={errors && errors['test_categories_id']}
            ></SelectInput>
          </div>
        </div>
        <div className="row mb-4">
          <div className="form-group col-md-5 col-12">
            <TextInput
              placeholder="Panel Name*"
              value={name || ''}
              onChange={e => onHandleChange(e.target.value, 'name')}
              error={errors && errors['name']}
            />
          </div>
          <div className="form-group col-md-3 col-12">
            <TextInput
              placeholder="Short Name"
              value={short_name || ''}
              onChange={e => onHandleChange(e.target.value, 'short_name')}
              error={errors && errors['short_name']}
            />
          </div>
          <div className="form-group col-md-3 col-12">
            <SelectInput
              options={GenderList}
              value={gender}
              placeholder="Gender*"
              onChange={value => onHandleChange(value, 'gender')}
              error={errors && errors['gender']}
            ></SelectInput>
          </div>
        </div>
        <div className="row mb-4">
          <div className="form-group col-md-3 col-12">
            <TextInput
              placeholder="Cost"
              value={cost || ''}
              onChange={e => onHandleChange(e.target.value, 'cost')}
              error={errors && errors['cost']}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="form-group col-md-12 col-12">
            <label className="gray-label mb-1">Select Tests or Groups*</label>
            {loadSelectInput ? (
              <AsyncSelectInput
                isMulti
                options={masterTestList}
                FilterData={getMasterTestList}
                noOptionsMessage="Search & Select Tests"
                value={tests}
                onChange={option => (option && option.length ? setTests([...option]) : setTests())}
                error={errors && errors['test_ids']}
              />
            ) : (
              <SelectInput isLoading></SelectInput>
            )}
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-md-3 col-12 text-right gray-label">Technique :</div>
          <div className="form-group col-md-8 col-12">
            <TextEditor value={technique || ''} onChange={data => setTechnique(data)} error={errors && errors['technique']} />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-md-3 col-12 text-right gray-label">Interpretation :</div>
          <div className="form-group col-md-8 col-12">
            <TextEditor value={interpretation || ''} onChange={data => setInterpretation(data)} error={errors && errors['interpretation']} />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-md-3 col-12 text-right gray-label">Method :</div>
          <div className="form-group col-md-8 col-12">
            <TextEditor value={method || ''} onChange={data => setMethod(data)} error={errors && errors['method']} />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-md-3 col-12 text-right gray-label">Remark :</div>
          <div className="form-group col-md-8 col-12">
            <TextEditor value={remark || ''} onChange={data => setRemark(data)} error={errors && errors['remark']} />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-md-3 col-12 text-right gray-label">Note :</div>
          <div className="form-group col-md-8 col-12">
            <TextEditor value={note || ''} onChange={data => setNote(data)} error={errors && errors['note']} />
          </div>
        </div>
      </div>
      <div className="row mb-4 text-center">
        <div className="col-md-12">
          <OutlinedButton red className="mr-2" onClick={handleCancel}>
            Cancel
          </OutlinedButton>
          <OutlinedButton blue onClick={handleAddPanel} disabled={btnLoading} loading={btnLoading}>
            Save
          </OutlinedButton>
        </div>
      </div>
    </div>
  );
};

export default PanelForm;
