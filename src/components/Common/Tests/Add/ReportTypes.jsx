import React from 'react';
import { AddTestIcon, CloseIcon } from '../../../../assets/icons';
import { TextButton } from '../../../../components/Buttons/Button';
import TextEditor from '../../../../components/Common/TextEditor/TextEditor';
import RadioButton from '../../../../components/FormInputs/RadioButton/RadioButton';
import SelectInput from '../../../../components/FormInputs/SelectInput/SelectInput';
import Textarea from '../../../../components/FormInputs/Textarea/Textarea';
import TextInput from '../../../../components/FormInputs/TextInput/TextInput';
import { GenderList } from '../../../../utils/masters';

const ReferenceRange = ({ testValidation, setTestValidation, defaultTestValidation, errors }) => {
  const addNewRange = () => {
    setTestValidation([...testValidation, { ...defaultTestValidation }]);
  };
  const removeRow = ind => {
    let temp = [...testValidation];
    temp.splice(ind, 1);
    setTestValidation([...temp]);
  };
  const onHandleChange = (value, key, ind) => {
    let obj = [...testValidation];
    obj[ind][key] = value;
    setTestValidation([...obj]);
  };
  return (
    <div className="paper test-range-form">
      <label className="paper-label semi-bold mb-3">Report Type - Reference Range</label>
      <table className="custom-table report-type-table mb-3">
        <thead>
          <tr>
            <th>Gender</th>
            <th>Min. Age (in days)</th>
            <th>Max. Age (in days)</th>
            <th>Lower Value</th>
            <th>Upper Value</th>
            <th>Text</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {testValidation &&
            testValidation.length &&
            testValidation.map((data, ind) => (
              <tr key={ind}>
                <td>
                  <SelectInput
                    options={GenderList}
                    value={
                      data.gender && typeof data.gender === 'string'
                        ? { label: data.gender, value: data.gender }
                        : data.gender || GenderList[0]
                    }
                    onChange={val => onHandleChange(val, 'gender', ind)}
                    error={errors && errors[`test_validation.${ind}.gender`]}
                  ></SelectInput>
                </td>
                <td>
                  <TextInput
                    type="number"
                    value={data.age_from || ''}
                    onChange={e => onHandleChange(e.target.value, 'age_from', ind)}
                    error={errors && errors[`test_validation.${ind}.age_from`]}
                  />
                </td>
                <td>
                  <TextInput
                    type="number"
                    value={data.age_to || ''}
                    onChange={e => onHandleChange(e.target.value, 'age_to', ind)}
                    error={errors && errors[`test_validation.${ind}.age_to`]}
                  />
                </td>
                <td>
                  <TextInput
                    type="number"
                    value={data.range_from || ''}
                    onChange={e => onHandleChange(e.target.value, 'range_from', ind)}
                    error={errors && errors[`test_validation.${ind}.range_from`]}
                  />
                </td>
                <td>
                  <TextInput
                    type="number"
                    value={data.range_to || ''}
                    onChange={e => onHandleChange(e.target.value, 'range_to', ind)}
                    error={errors && errors[`test_validation.${ind}.range_to`]}
                  />
                </td>
                <td>
                  <TextInput
                    value={data.text || ''}
                    onChange={e => onHandleChange(e.target.value, 'text', ind)}
                    error={errors && errors[`test_validation.${ind}.text`]}
                  />
                </td>
                <td>
                  {testValidation.length > 1 ? (
                    <TextButton className="row-remove-btn" onClick={() => removeRow(ind)}>
                      {CloseIcon}
                    </TextButton>
                  ) : (
                    ''
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <TextButton blue withIcon onClick={addNewRange}>
        <div className="d-flex">
          <span className="add-circle-outline  mr-2">{AddTestIcon}</span>
          <p>ADD MORE</p>
        </div>
      </TextButton>
    </div>
  );
};

const PossibleTestResult = ({ defaultPossibleTestResult, possibleTestResult, setPossibleTestResult, errors }) => {
  const addNewRange = () => {
    setPossibleTestResult([...possibleTestResult, ...defaultPossibleTestResult]);
  };
  const removeRow = ind => {
    let temp = [...possibleTestResult];
    temp.splice(ind, 1);
    setPossibleTestResult([...temp]);
  };
  const onHandleChange = (value, key, ind) => {
    let obj = [...possibleTestResult];
    obj[ind] = {
      ...obj[ind],
      [key]: value,
    };
    setPossibleTestResult([...obj]);
  };
  return (
    <div className="paper possible-test-result-form">
      <label className="paper-label semi-bold mb-3">Report Type - Possible Test Results</label>
      <table className="custom-table report-type-table mb-3">
        <thead>
          <tr>
            <th>Possible Test Results</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {possibleTestResult &&
            possibleTestResult.length &&
            possibleTestResult.map((data, ind) => (
              <tr key={ind}>
                <td>
                  <TextInput
                    value={data.result || ''}
                    onChange={e => onHandleChange(e.target.value, 'result', ind)}
                    error={errors && errors[`test_validation.${ind}.age_from`]}
                  />
                </td>
                <td>
                  <div className="d-flex justify-content-center">
                    <RadioButton
                      className="mr-4"
                      label="Normal"
                      checked={!data.abnormal}
                      onClick={() => onHandleChange(false, 'abnormal', ind)}
                    ></RadioButton>
                    <RadioButton
                      label="Abnormal"
                      checked={data.abnormal}
                      onClick={() => onHandleChange(true, 'abnormal', ind)}
                    ></RadioButton>
                  </div>
                </td>
                <td>
                  {possibleTestResult.length > 1 ? (
                    <TextButton className="row-remove-btn" onClick={() => removeRow(ind)}>
                      {CloseIcon}
                    </TextButton>
                  ) : (
                    ''
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <TextButton blue withIcon onClick={addNewRange}>
        <div className="d-flex">
          <span className="add-circle-outline  mr-2"></span>
          <p>ADD MORE</p>
        </div>
      </TextButton>
    </div>
  );
};

const PreDefinedTestResult = ({ preDefineResult, setPreDefineResult, errors }) => {
  return (
    <div className="paper pre-defined-test-result-form">
      <label className="paper-label semi-bold mb-3">Report Type - Pre-defined Test Results</label>
      <table className="custom-table report-type-table mb-3">
        <thead>
          <tr>
            <th width="50%">Pre-defined Test Results</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <TextEditor
                value={preDefineResult || ''}
                onChange={data => setPreDefineResult(data)}
                error={errors && errors['pre_define_result']}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export { ReferenceRange, PossibleTestResult, PreDefinedTestResult };
