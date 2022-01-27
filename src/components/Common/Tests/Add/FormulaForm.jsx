import React, { useState, useCallback, useContext } from 'react';
import AsyncSelectInput from '../../../../components/FormInputs/AsyncSelectInput/AsyncSelectInput';
import TagInput from '../../../../components/FormInputs/TagInput/TagInput';
import { ProfileContext } from '../../../../context/context';
import { makeRequest } from '../../../../utils/api';

const FormulaForm = ({ dependentTests, setDependentTests, formula, setFormula, error, reportTypeId }) => {
  const [masterTestList, setMasterTestList] = useState([]);
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);

  let testMasterBaseUrl = '/super_admin/';
  if(loginAs == "lab-admin") testMasterBaseUrl = `/lab_group/${profile?.selectedRole?.uuid}/`;
  else if(loginAs == "lab") testMasterBaseUrl = `/lab/${profile?.selectedRole?.uuid}/`;

  const getMasterTestList = useCallback(
    async search => {
      const {data, status} = await makeRequest({
        url: `${testMasterBaseUrl}tests?${search ? `search=${search}&` : ''}${reportTypeId ? `report_type=${reportTypeId}` : ''}`,
        method: 'GET',
        isAuth: true,
      });
      if (status === 200 && data) {
        const newData =
          data.data &&
          data.data.length &&
          [...data.data]
            .filter(test => test.type === 'test')
            .map(test => ({ label: test.name, value: test.uuid, text: test.name, id: test.name, type: 'test' }));
        setMasterTestList(newData);
        return newData;
      }
      return;
    },
    [reportTypeId],
  );

  const handleDelete = i => {
    formula.splice(i, 1);
    setFormula(formula);
  };

  const handleAddition = tag => {
    setFormula([...formula, { ...tag }]);
  };

  return (
    <div className="paper">
      <label className="paper-label semi-bold mb-3">Formula</label>
      <div className="row mb-4">
        <div className="form-group col-12">
          <label className="gray-label">Search & Select Dependent Tests</label>
          <AsyncSelectInput
            isMulti
            options={masterTestList}
            noOptionsMessage="Search & Select Tests"
            FilterData={getMasterTestList}
            value={dependentTests}
            onChange={option => (option && option.length ? setDependentTests([...option]) : setDependentTests())}
            error={error && error['formula.test_dependent_on']}
          />
        </div>
      </div>
      <div className="row mb-4">
        <div className="form-group col-12">
          <label className="gray-label">Formula : </label> <br />
          <TagInput
            tags={formula}
            suggestions={dependentTests}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            error={error && error['formattedFormulaError']}
          ></TagInput>
        </div>
      </div>
    </div>
  );
};

export default FormulaForm;
