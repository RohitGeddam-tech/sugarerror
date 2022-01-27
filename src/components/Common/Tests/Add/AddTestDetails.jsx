import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProfileContext } from '../../../../context/context';
import { fetchRequest } from '../../../../utils/api';
import { GenderList } from '../../../../utils/masters';
import RadioButton from '../../../FormInputs/RadioButton/RadioButton';
import GroupForm from './GroupForm';
import PackageForm from './PackageForm';
import PanelForm from './PanelForm';
import TestForm from './TestForm';

const AddTestDetails = props => {
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);
  const [detailsType, setDetailsType] = useState('test');
  const { testId } = useParams();
  const [testData, setTestData] = useState(null);
  // const [loading, setLoading] = useState(false);

  let testMasterBaseUrl = '/super_admin/';
  if(loginAs == "lab-admin") testMasterBaseUrl = `/lab_group/${profile?.selectedRole?.uuid}/`;
  else if(loginAs == "lab") testMasterBaseUrl = `/lab/${profile?.selectedRole?.uuid}/`;
  
  const getSignleTestData = useCallback(async () => {
    // setLoading(true);
    if (testId) {
      const res = await fetchRequest({ url: `${testMasterBaseUrl}tests/${testId}`, method: 'GET', isAuth: true });
      if (res && res.status === 200) {
        // setLoading(false);
        const { data } = await res.json();
        setTestData({
          ...data,
          test_category: { label: data.test_category.name, value: data.test_category.uuid },
          report_type: { label: data.report_type.name, value: data.report_type.uuid, ...data.report_type },
          unit: { label: data.unit?.name, value: data.unit?.uuid, ...data.unit },
          sample_type: { label: data.sample_type?.name, value: data.sample_type?.uuid, ...data.sample_type },
          gender: GenderList.find(gender => gender.value === data.gender),
        });
        setDetailsType(data.type);
        return data;
      } // else { setLoading(false); }
      return;
    }
  }, [testId]);

  useEffect(() => {
    if (testId) getSignleTestData();
  }, [testId, getSignleTestData]);

  return (
    <div className="add-test-container">
      <div className="paper select-test-type">
        <label className="paper-label semi-bold mb-3">Select and add details</label>
        <div className="d-flex">
          {!testId ? (
            <>
              <RadioButton label="Test" checked={detailsType == "test"} onClick={() => setDetailsType('test')} className="mr-5"></RadioButton>
              <RadioButton label="Group" checked={detailsType == "group"} onClick={() => setDetailsType('group')} className="mr-5"></RadioButton>
              <RadioButton label="Panel" checked={detailsType == "panel"}onClick={() => setDetailsType('panel')} className="mr-5"></RadioButton>
              {['lab-admin','lab'].includes(loginAs) && <RadioButton label="Package" checked={detailsType == "package"} onClick={() => setDetailsType('package')}></RadioButton>}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
      {/* Form Type Test */}
      {detailsType === 'test' && <TestForm obj={{ setDetailsType, testData }} {...props}></TestForm>}

      {/* Form Group Test */}
      {detailsType === 'group' && <GroupForm obj={{ setDetailsType, testData }} {...props}></GroupForm>}

      {/* Form Panel Test */}
      {detailsType === 'panel' && <PanelForm obj={{ setDetailsType, testData }} {...props}></PanelForm>}

      {/* Form Package Test */}
      {['lab-admin','lab'].includes(loginAs) && detailsType === 'package' && <PackageForm obj={{ setDetailsType, testData }} {...props}></PackageForm>}
      </div>
  );
};

export default AddTestDetails;
