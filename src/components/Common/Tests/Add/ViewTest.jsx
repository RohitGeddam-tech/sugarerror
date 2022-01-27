import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Edit } from '../../../../assets/icons';
import { OutlinedButton } from '../../../../components/Buttons/Button';
import { fetchRequest } from '../../../../utils/api';
import { rupeeSymbol } from '../../../../utils/constants';
import Notification from '../../../../components/Notification/Notification';
import ConfirmationModal from '../../../../components/Modal/ConfirmationModal';
import { ProfileContext } from '../../../../context/context';
import parse from 'html-react-parser';

const ViewTest = props => {
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);
  const { testId } = useParams();
  const [testData, setTestData] = useState({});
  const [loading, setLoading] = useState(false);
  const [actionObject, setActionObject] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  let testMasterBaseUrl = '/super_admin/';
  if(loginAs == "lab-admin") testMasterBaseUrl = `/lab_group/${profile?.selectedRole?.uuid}/`;
  else if(loginAs == "lab") testMasterBaseUrl = `/lab/${profile?.selectedRole?.uuid}/`;

  const getSignleTestData = useCallback(async () => {
    setLoading(true);
    if (testId) {
      const res = await fetchRequest({ url: `${testMasterBaseUrl}tests/${testId}`, method: 'GET', isAuth: true });
      if (res && res.status === 200) {
        setLoading(false);
        const { data } = await res.json();
        setTestData(data);
        return data;
      } else {
        setLoading(false);
      }
      return;
    }
  }, [testId]);

  useEffect(() => {
    if (testId) getSignleTestData();
  }, [testId, getSignleTestData]);

  const handleDeleteTest = data => {
    if (data.success) {
      setNotification({ show: true, message: data.message, type: 'success' });
      let url = ['lab-admin','lab'].includes(loginAs) ? `/${localStorage.getItem('loginAs')}/setting/tests/list` : `/${localStorage.getItem('loginAs')}/tests/list`;
      setTimeout(() => props.history.push(url), 3000);
    } else setNotification({ show: true, message: data.message, type: 'error' });
  };

  return (
    <div className="form-content view-test-container">
      <Notification {...notification} />
      <div className="paper card ">
        <div className={`content-header d-flex align-items-baseline justify-content-between`}>
          <p className="semi-bold title text-capitalize">{testData.type || "test"} Details</p>
        </div>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : testData ? (
          <div className="edit-user-data-card pl-2">
            {testData.type !== "group" && <div className="d-flex card-row mb-2">
              <div className="semi-bold label">Category : </div>
              <div className="value">{(testData.test_category && testData.test_category.name) || '-'}</div>
            </div>}
            {testData.type === "test" && <div className="d-flex card-row mb-2">
              <div className="semi-bold label">Report Type : </div>
              <div className="value">{testData.report_type?.name || '-'}</div>
            </div>}
            {testData.type === "test" && <div className="d-flex card-row mb-2">
              <div className="semi-bold label">Unit : </div>
              <div className="value">{testData.unit?.name || '-'}</div>
            </div>}
            <div className="d-flex card-row mb-2">
              <div className="semi-bold label text-capitalize">{testData.type || "test"} Name : </div>
              <div className="value mr-5">{testData.name || '-'}</div>
              {testData.type !== "group" && <><div className="semi-bold label">Short Name : </div>
              <div className="value">{testData.short_name || '-'}</div></>}
            </div>
            <div className="d-flex card-row mb-2">
              <div className="semi-bold label">Gender : </div>
              <div className="value">{testData.gender || '-'}</div>
            </div>
            {testData.type !== "group" && <div className="d-flex card-row mb-3">
              <div className="semi-bold label">Cost : </div>
              <div className="value">
                {rupeeSymbol} {testData.cost || '-'}
              </div>
            </div>}
            {testData.type === "test" && <div className="d-flex card-row mb-3">
              <div className="semi-bold label">Sample Type : </div>
              <div className="value">{testData.sample_type?.name || '-'}</div>
            </div>}
            {testData.type !== "group" && <div className="d-flex card-row mb-3">
              <div className="semi-bold label">Technique : </div>
              <div className="value editor-content">{testData.technique ? parse(`${testData.technique}`) : '-'}</div>
            </div>}
            {testData.type !== "group" && <div className="d-flex card-row mb-3">
              <div className="semi-bold label">Interpretation : </div>
              <div className="value editor-content">{testData.interpretation ? parse(`${testData.interpretation}`) : '-'}</div>
            </div>}
            {testData.type !== "group" && <div className="d-flex card-row mb-3">
              <div className="semi-bold label">Method : </div>
              <div className="value editor-content">{testData.method ? parse(`${testData.method}`) : '-'}</div>
            </div>}
            {testData.type !== "group" && <div className="d-flex card-row mb-3">
              <div className="semi-bold label">Remark : </div>
              <div className="value editor-content">{testData.remark ? parse(`${testData.remark}`) : '-'}</div>
            </div>}
            {testData.type !== "group" && <div className="d-flex card-row mb-3">
              <div className="semi-bold label">Note : </div>
              <div className="value editor-content">{testData.note ? parse(`${testData.note}`) : '-'}</div>
            </div>}
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="mb-4 text-center">
        <OutlinedButton className="mr-2 edit-test-btn" link to={['lab-admin','lab'].includes(loginAs) ? `/${localStorage.getItem('loginAs')}/setting/edit-test/${testId}` : `/${localStorage.getItem('loginAs')}/edit-test/${testId}`}>
          <div className="d-flex">
            <p className="mr-2 edit-pencil">{Edit}</p>
            <p className="edit-test-label">Edit</p>
          </div>
        </OutlinedButton>
        <OutlinedButton
          red
          className="mr-2"
          onClick={() => {
            setNotification({ show: false, message: '', type: '' });
            setActionObject({
              title: 'Confirmation',
              msg: 'Are you sure you want to delete this test? It will be erased completely and you cannot undo it.',
              cancelAction: 'Go Back',
              confirmAction: 'Delete',
              method: 'DELETE',
              url: `${testMasterBaseUrl}tests/${testId}`,
              handleFailure: handleDeleteTest,
              handleSuccess: handleDeleteTest,
              isModalOpen: true,
              setNotification
            });
          }}
        >
          Delete
        </OutlinedButton>
      </div>
      <ConfirmationModal actionObject={actionObject} />
    </div>
  );
};

export default ViewTest;
