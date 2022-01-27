import React, { useState, useEffect, useContext, useCallback } from 'react';
import Card from '../../../components/Common/Card/Card';
import { Link } from 'react-router-dom';
import { fetchRequest } from '../../../utils/api';
import { ProfileContext } from '../../../context/context';
import { AddBox } from '../../../assets/icons';
import { TextButton } from '../../../components/Buttons/Button';
import ConfirmationModal from '../../../components/Modal/ConfirmationModal';
import Notification from '../../../components/Notification/Notification';
import Loader from '../../../components/Loader/Loader';

function BranchList() {
  const { profile } = useContext(ProfileContext);
  const loginAs = localStorage.getItem('loginAs');
  const [labId, setLabId] = useState(); //lab_group uuid from profile api
  const [branchList, setBranchList] = useState([]);
  const [actionObject, setActionObject] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile && loginAs === 'lab-admin') {
      setLabId(profile.selectedRole.uuid);
    } else if (profile && (loginAs === 'super-admin' || loginAs === 'assistant-admin')) {
      setLabId(profile.selectedLabId);
    }
  }, [profile, loginAs]);

  const getBranchList = useCallback(async () => {
    setLoading(true);
    const res = await fetchRequest({ url: `/lab_group/${labId}/get_labs`, method: 'GET', isAuth: true });
    if (res && res.status === 200) {
      setLoading(false);
      const { data } = await res.json();
      setBranchList(data);
      return data;
    }
    return;
  }, [labId]);

  useEffect(() => {
    if (labId) getBranchList();
  }, [labId, getBranchList]);

  return (
    <div className="d-flex flex-wrap branch-details-wrapper w-100">
      <Loader loading={loading} />
      <Notification {...notification} />
      {!loading && (
        <>
          {' '}
          <div className="branch-details-card add-branch-btn-card">
            <Link
              className="add-branch-btn text-center"
              to={`${
                loginAs === 'lab-admin'
                  ? '/lab-admin/setting'
                  : loginAs === 'assistant-admin'
                  ? '/assistant-admin/lab-details/branch-details'
                  : '/super-admin/lab-details/branch-details'
              }/add-branch-details`}
            >
              {AddBox} <br />
              Add a branch
            </Link>
          </div>
          {branchList &&
            branchList.map((branch, ind) => (
              <div className="branch-details-card" key={ind}>
                <Card title={branch.name ? branch.name : '-'}>
                  <address className="mt-2 mb-0">
                    {`${branch.address_line_one || '-'}, ${branch.address_line_two || ''}, `}
                    <br/>{`${branch.city || '-'}, ${branch.state || '-'}, ${branch.pincode || '-'}`}
                  </address>
                  <div className="phone-no mb-2">Phone Number: {branch.mobile ? branch.mobile : '-'}</div>
                  <div className="d-flex align-items-center fixed-bottom">
                    <Link
                      className="link-btn semi-bold blue-text"
                      to={{
                        pathname: `${
                          loginAs === 'lab-admin'
                            ? `/lab-admin/setting/branch-settings`
                            : loginAs === 'assistant-admin'
                            ? '/assistant-admin/branch-settings'
                            : '/super-admin/branch-settings'
                        }/${branch.uuid}/name-and-address`,
                      }}
                    >
                      Branch Setting
                    </Link>
                    {loginAs === 'lab-admin' && (
                      <>
                        {' '}
                        <p className="divider"></p>
                        <TextButton
                          red
                          className="delete-btn"
                          onClick={() => {
                            setActionObject({
                              title: 'Confirmation',
                              msg: 'Are you sure you want to delete this branch? It will be erased completely and you cannot undo it.',
                              cancelAction: 'Go Back',
                              confirmAction: 'Delete',
                              method: 'DELETE',
                              url: `/lab_group/${labId}/lab/${branch.uuid}`,
                              handleSuccess: data => {
                                data.message &&
                                  setNotification({
                                    show: true,
                                    message: data.message,
                                    type: 'success',
                                  });
                                setTimeout(() => getBranchList(), 2000);
                              },
                              setNotification: setNotification,
                              isModalOpen: true,
                            });
                          }}
                        >
                          Delete Branch
                        </TextButton>
                      </>
                    )}
                  </div>
                </Card>
              </div>
            ))}
        </>
      )}
      <ConfirmationModal actionObject={actionObject}></ConfirmationModal>
    </div>
  );
}

export default BranchList;
