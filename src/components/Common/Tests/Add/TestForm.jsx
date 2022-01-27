import React, { useEffect, useState, useContext } from 'react';
import CheckboxInput from '../../../../components/FormInputs/Checkbox/CheckboxInput';
import SelectInput from '../../../../components/FormInputs/SelectInput/SelectInput';
import TextInput from '../../../../components/FormInputs/TextInput/TextInput';
import Textarea from '../../../../components/FormInputs/Textarea/Textarea';
import FormulaForm from './FormulaForm';
import { PossibleTestResult, PreDefinedTestResult, ReferenceRange } from './ReportTypes';
import { fetchRequest } from '../../../../utils/api';
import RadioButton from '../../../../components/FormInputs/RadioButton/RadioButton';
import { GenderList } from '../../../../utils/masters';
import { OutlinedButton } from '../../../../components/Buttons/Button';
import Notification from '../../../../components/Notification/Notification';
import { useParams } from 'react-router-dom';
import AsyncSelectInput from '../../../../components/FormInputs/AsyncSelectInput/AsyncSelectInput';
import { ProfileContext } from '../../../../context/context';
import { validateForm } from '../../../../utils/custom';
import { TextEditor } from '../../../../components/Common/TextEditor/TextEditor';

const operatorsRegExp = /[$&+,:;=?@#|'<>^*()%!-/%]/;
const numberRegExp = /^-?\d+\.?\d*$/;
const defaultState = {
  type: 'test',
  test_category: null,
  report_type: null,
  unit: null,
  name: '',
  short_name: '',
  gender: null,
  cost: '',
  sample_type: null,
  sample_quantity: '',
  listable: true,
  optional: false,
  formula: [],
};

const defaultTestValidation = { gender: GenderList[0], age_from: '', age_to: '', range_from: '', range_to: '', text: '' };
const defaultPossibleTestResult = [{ result: '', abnormal: false }];
const TestForm = props => {
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);
  const [categories, setCategories] = useState([]);
  const [reportTypes, setReportTypes] = useState([]);
  const [units, setUnits] = useState([]);
  const [sampleTypes, setSampleTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const { testId } = useParams();
  // const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState({ ...defaultState });
  const [testValidation, setTestValidation] = useState([{ ...defaultTestValidation }]);
  const [possibleTestResult, setPossibleTestResult] = useState([...defaultPossibleTestResult]);
  const [preDefineResult, setPreDefineResult] = useState();
  const { test_category, report_type, unit, name, short_name, gender, cost, sample_type, sample_quantity, listable, optional, formula } = testData;
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [btnLoading, setBtnLoading] = useState(false);
  const [dependentTests, setDependentTests] = useState([]);
  //Editor initials
  const [technique, setTechnique] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [method, setMethod] = useState('');
  const [remark, setRemark] = useState('');
  const [note, setNote] = useState('');

  let testMasterBaseUrl = '/super_admin/';
  if(loginAs == "lab-admin") testMasterBaseUrl = `/lab_group/${profile?.selectedRole?.uuid}/`;
  else if(loginAs == "lab") testMasterBaseUrl = `/lab/${profile?.selectedRole?.uuid}/`;

  useEffect(() => {
    getCategories();
    getReportTypes();
    getUnits();
    getSampleTypes();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (props.obj && props.obj.testData) {
      const testData = { ...props.obj.testData };
      testData.formula = testData.formula?.length
        ? testData.formula.map(({ type, value, details }) =>
            type === 'test'
              ? { label: details.name, value, id: value, text: details.name, type }
              : { label: value, value, id: value, text: value, type },
          )
        : [];
      let tempDependentTests = testData.test_dependency?.length
        ? testData.test_dependency.map(val => ({ label: val.test.name, value: val.test.uuid, text: val.test.name, id: val.test.uuid, type: 'test' }))
        : [];
      setDependentTests(tempDependentTests);
      setTestData(testData);
      //Editor state
      setTechnique(testData.technique)
      setInterpretation(testData.interpretation)
      setMethod(testData.method)
      setRemark(testData.remark)
      setNote(testData.note);

      testData?.test_validations?.length && setTestValidation(testData.test_validations);
      testData?.possible_test_results?.length && setPossibleTestResult(testData.possible_test_results);
      setPreDefineResult(testData.pre_define_result);
    }
  }, [props]);

  const handleCancel = () => {
    if (testId) {
      const viewTestLink = ['lab-admin','lab'].includes(loginAs) ? `/${loginAs}/setting/view-test/${testId}` : `/${loginAs}/view-test/${testId}`;
      props.history.push(viewTestLink);
    } else {
      setTestData({ ...defaultState });
      //Editor state
      setTechnique('')
      setInterpretation('')
      setMethod('')
      setRemark('')
      setNote('');

      setTestValidation([{ ...defaultTestValidation }]);
      setPossibleTestResult([...defaultPossibleTestResult]);
      setPreDefineResult();
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

  const getReportTypes = async () => {
    const res = await fetchRequest({ url: `${testMasterBaseUrl}report_types`, method: 'GET', isAuth: true });
    if (res && res.status === 200) {
      const { data } = await res.json();
      const newData = data && data.length && [...data].map(report_type => ({ label: report_type.name, value: report_type.uuid }));
      setReportTypes(newData);
      return data;
    }
    return;
  };

  const getUnits = async search => {
    const res = await fetchRequest({
      url: `${testMasterBaseUrl}units${search ? `?search=${search}` : ''}`,
      method: 'GET',
      isAuth: true,
    });
    if (res && res.status === 200) {
      const { data } = await res.json();
      const newData = data && data.length && [...data].map(unit => ({ label: unit.name, value: unit.uuid }));
      setUnits(newData);
      return newData;
    }
  };

  const getSampleTypes = async () => {
    const res = await fetchRequest({ url: `${testMasterBaseUrl}samples`, method: 'GET', isAuth: true });
    if (res && res.status === 200) {
      const { data } = await res.json();
      const newData = data && data.length && [...data].map(sample_type => ({ label: sample_type.name, value: sample_type.uuid }));
      setSampleTypes(newData);
      return data;
    }
    return;
  };

  const onHandleChange = (value, key) => {
    let obj = { ...testData };
    obj[key] = value;
    setTestData(obj);
  };

  const handleAddTest = async () => {
    setErrors({});
    setBtnLoading(true);
    setNotification({ show: false, message: '', type: '' });
    
    const errors = validateForm({ name, test_categories_id : test_category && test_category.value, report_type_id : report_type && report_type.value, unit_id : unit && unit.value, gender : gender && gender.value });
    setErrors({ ...errors });

    if (!Object.keys(errors).length) {
      const formattedDependentTests = dependentTests?.length ? [...dependentTests].map(val => val.value) : [];
      const formattedFormula = [...formula]?.length
        ? [...formula].map(val => {
            if (val.type === 'test') {
              return { type: 'test', value: val.value || val.id };
            } else {
              return numberRegExp.test(parseFloat(val.text)) 
                ? { type: 'int', value: parseFloat(val.text) } 
                : operatorsRegExp.test(val.text)
                ? { type: 'operator', value: val.text }
                : { type: 'none', value: val.text };
            }
          })
        : null;

      let body = {
        type: 'test',
        test_categories_id: test_category && test_category.value,
        report_type_id: report_type && report_type.value,
        unit_id: unit && unit.value,
        name,
        short_name,
        gender: gender && gender.value,
        cost,
        sample_type_id: sample_type && sample_type.value,
        sample_quantity: parseFloat(sample_quantity),
        listable,
        optional,
        technique,
        interpretation,
        method,
        remark,
        note,
        formula: null,
      };

      if (formattedFormula) {
        body = {
          ...body,
          formula: {
            test_dependent_on: formattedDependentTests?.length ? [...formattedDependentTests] : null,
            formula: [...formattedFormula],
          },
        };
      }

      if (report_type && report_type.label === 'Range') {
        let temp =
          testValidation && testValidation.length
            ? [...testValidation].map(range => ({
                ...range,
                gender: range.gender && typeof range.gender === 'string' ? range.gender : range.gender.value,
              }))
            : null;

        body = {
          ...body,
          test_validation: temp,
        };
      }
      if (report_type && report_type.label === 'Possible Test Results') {
        let temp = possibleTestResult && possibleTestResult.length ? [...possibleTestResult] : null;

        body = {
          ...body,
          possible_results: temp,
        };
      }
      if (report_type && report_type.label === 'Pre-Defined Test Result') {
        body = {
          ...body,
          pre_define_result: preDefineResult,
        };
      }

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
          const errors = { ...errObj.errors };
          const formulaErrorKeys = Object.keys(errors).filter(key => key.includes('formula.formula'));
          const tags = formulaErrorKeys?.length
            ? formulaErrorKeys.map((key, ind) => {
                const addComma = ind + 1 === formulaErrorKeys.length ? ', ' : ' ';
                return parseInt(key.split('.')[2]) + 1 + addComma;
              })
            : null;
          if (tags) errors.formattedFormulaError = tags + 'inputs are not valid.';

          setErrors(errors);
          res.status !== 422 &&
            !Object.keys(errObj.error ? errObj.error : {}).length &&
            errObj.message &&
            setNotification({ show: true, message: errObj.message, type: 'error' });
        }
      }
    }else{
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
          <div className="form-group col-md-4 col-12">
            <SelectInput
              options={reportTypes}
              value={report_type}
              placeholder="Report Type*"
              onChange={value => onHandleChange(value, 'report_type')}
              error={errors && errors['report_type_id']}
            ></SelectInput>
          </div>
          <div className="form-group col-md-3 col-12">
            {/* <SelectInput
              options={units}
              value={unit}
              placeholder="Unit"
              onChange={value => onHandleChange(value, 'unit')}
              error={errors && errors['unit_id']}
            ></SelectInput> */}
            <AsyncSelectInput
              placeholder="Unit*"
              options={units}
              FilterData={getUnits}
              value={unit}
              onChange={value => onHandleChange(value, 'unit')}
              error={errors && errors['unit_id']}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="form-group col-md-5 col-12">
            <TextInput
              placeholder="Test Name*"
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
              type="number"
            />
          </div>
          <div className="form-group col-md-5 col-12">
            <SelectInput
              options={sampleTypes}
              value={sample_type}
              placeholder="Sample Type"
              onChange={value => onHandleChange(value, 'sample_type')}
              error={errors && errors['sample_type']}
            ></SelectInput>
          </div>
          <div className="form-group col-md-4 col-12">
            <TextInput
              placeholder="Sample Quantity (Optional)"
              value={sample_quantity || ''}
              onChange={e => onHandleChange(e.target.value, 'sample_quantity')}
              error={errors && errors['sample_quantity']}
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="form-group col-md-3">
            <CheckboxInput name="trial_package" label="Listable" checked={listable} blue onClick={() => onHandleChange(!listable, 'listable')} />
          </div>
          <div className="form-group col-md-3">
            <CheckboxInput name="trial_package" label="Optional" checked={optional} blue onClick={() => onHandleChange(!optional, 'optional')} />
          </div>
        </div>
          <div className="row mb-4">
            <div className="col-md-3 col-12 text-right gray-label">Technique :</div>
            <div className="form-group col-md-8 col-12">
              <TextEditor
                value={technique || ''}
                onChange={data => setTechnique(data)}
                error={errors && errors['technique']}
              />
            </div>
          </div>
        <div className="row mb-4">
          <div className="col-md-3 col-12 text-right gray-label">Interpretation :</div>
          <div className="form-group col-md-8 col-12">
            <TextEditor
              value={interpretation || ''}
              onChange={data => setInterpretation(data)}
              error={errors && errors['interpretation']}
            />
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
      {report_type && (report_type.label === 'Range' || report_type.label === 'Numeric Test Result') && (
        <FormulaForm
          dependentTests={dependentTests}
          setDependentTests={setDependentTests}
          formula={formula}
          setFormula={value => onHandleChange(value, 'formula')}
          error={errors}
          reportTypeId={report_type.value}
        ></FormulaForm>
      )}
      {report_type && report_type.label === 'Range' && (
        <ReferenceRange
          defaultTestValidation={defaultTestValidation}
          testValidation={testValidation}
          setTestValidation={setTestValidation}
          errors={errors}
        ></ReferenceRange>
      )}
      {report_type && report_type.label === 'Possible Test Results' && (
        <PossibleTestResult
          defaultPossibleTestResult={defaultPossibleTestResult}
          possibleTestResult={possibleTestResult}
          setPossibleTestResult={setPossibleTestResult}
          errors={errors}
        ></PossibleTestResult>
      )}
      {report_type && report_type.label === 'Pre-Defined Test Result' && (
        <PreDefinedTestResult preDefineResult={preDefineResult} setPreDefineResult={setPreDefineResult} errors={errors}></PreDefinedTestResult>
      )}
      <div className="row mb-4 text-center">
        <div className="col-md-12">
          <OutlinedButton red className="mr-2" onClick={handleCancel}>
            Cancel
          </OutlinedButton>
          <OutlinedButton blue onClick={handleAddTest} disabled={btnLoading} loading={btnLoading}>
            Save
          </OutlinedButton>
        </div>
      </div>
    </div>
  );
};
export default TestForm;
