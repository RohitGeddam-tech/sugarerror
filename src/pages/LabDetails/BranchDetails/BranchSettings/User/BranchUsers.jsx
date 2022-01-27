import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRequest } from '../../../../../utils/api';
import { ProfileContext } from '../../../../../context/context';
import Table from '../../../../../components/Table/Table';
import { More, Person } from '../../../../../assets/icons';
import { ContainedButton } from '../../../../../components/Buttons/Button';
import UserAddEditModal from './UserAddEditModal';
import Popover from '../../../../../components/Popover/Popover';
import Notification from '../../../../../components/Notification/Notification';

const actionList = [
  { key: 'edit', label: 'Edit details' },
  { key: 'deactivate', label: 'Temporarily De-activate User' },
  { key: 'activate', label: 'Activate User' },
  { key: 'delete', label: 'Permanently Delete User' },
];

const BranchUsers = props => {
  const loginAs = localStorage.getItem('loginAs');
  const [actionObject, setActionObject] = useState();
  const { profile } = useContext(ProfileContext);
  // const [labId, setLabId] = useState(); //lab_group uuid from profile api
  const { branchId } = useParams();
  const [users, setUsers] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (profile && loginAs === 'lab-admin') {
  //     setLabId(profile?.selectedRole.uuid);
  //   } else if (profile && (loginAs === 'super-admin' || loginAs === 'assistant-admin')) {
  //     setLabId(profile.selectedLabId);
  //   }
  // }, [profile, loginAs]);

  const headers = [
    {
      label: 'Name',
      accessKey: 'name',
    },
    {
      label: 'Mobile No.',
      accessKey: 'mobile',
    },
    {
      label: 'Email',
      accessKey: 'email',
    },
    {
      label: 'Added on',
      accessKey: 'created_at',
    },
    {
      label: 'Role',
      accessKey: 'role',
    },
    {
      label: 'Status',
      accessKey: 'formatted_status',
      cellRenderer: row => <span className={`semi-bold status-${row.status}`}>{row.formatted_status}</span>,
    },
    {
      label: '',
      accessKey: 'actions',
      renderIcon: '',
      cellRenderer: row => {
        return (
          <div className="d-flex align-items-center">
            {row.editable && (
              <Popover button={<p className="table-icon">{More}</p>}>
                {actionList.map((item, key) => {
                  let check = item.key === 'deactivate' ? row.active : item.key === 'activate' ? !row.active : true;
                  return (
                    check && (
                      <div
                        key={key}
                        onClick={() => {
                          let url = null;
                          if ((loginAs === 'lab-admin' || loginAs === 'super-admin' || loginAs === 'assistant-admin') && branchId) {
                            url = `/lab/${branchId}/user/${row.uuid}`;
                          } else if (loginAs === 'lab') {
                            url = `/lab/${profile?.selectedRole.uuid}/user/${row.uuid}`;
                          }

                          item.key === 'edit' &&
                            setActionObject({
                              title: 'Edit User',
                              confirmAction: 'Save',
                              isModalOpen: true,
                              url,
                              method: 'PUT',
                              isEdit: true,
                              uuid: row.uuid,
                              handleSuccess: data => {
                                data.message &&
                                  setNotification({
                                    show: true,
                                    message: data.message,
                                    type: 'success',
                                  });
                                setTimeout(() => getUsers(), 2000);
                              },
                              setNotification,
                            });
                          item.key === 'deactivate' && updateUserStatus(row.uuid, false);
                          item.key === 'activate' && updateUserStatus(row.uuid, true);
                          item.key === 'delete' && deleteUser(row.uuid);
                        }}
                        className={`user-action ${item.key}-user py-1`}
                      >
                        {item.label}
                      </div>
                    )
                  );
                })}
              </Popover>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if ((loginAs === 'lab-admin' || loginAs === 'super-admin' || loginAs === 'assistant-admin') && branchId) {
      getUsers();
    }
  }, [branchId, loginAs]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (loginAs === 'lab') {
      getUsers();
    }
  }, [loginAs]); // eslint-disable-line react-hooks/exhaustive-deps

  const getUsers = async () => {
    let url = null;
    if ((loginAs === 'lab-admin' || loginAs === 'super-admin' || loginAs === 'assistant-admin') && branchId) {
      url = `/lab/${branchId}/user`;
    } else if (loginAs === 'lab') {
      url = `/lab/${profile?.selectedRole.uuid}/user`;
    }
    if (url) {
      setLoading(true);
      const res = await fetchRequest({ url, method: 'GET', isAuth: true });
      res && setLoading(false);
      if (res && res.status === 200) {
        const { data } = await res.json();
        const newData =
          data &&
          data.length &&
          [...data].map(({ lab_user, lab_role, uuid, active, formatted_created_at, editable }) => ({
            uuid: uuid,
            name: lab_user.first_name + ' ' + lab_user.last_name,
            mobile: lab_user.mobile,
            email: lab_user.email || '-',
            created_at: formatted_created_at || '-',
            role: lab_role.formatted_name,
            active,
            status: active ? 'active' : 'inactive',
            formatted_status: active ? 'Active' : 'Inactive',
            editable,
          }));
        setUsers(newData);
        return data;
      }
      return;
    }
  };

  const updateUserStatus = async (id, status) => {
    let url = null;
    if ((loginAs === 'lab-admin' || loginAs === 'super-admin' || loginAs === 'assistant-admin') && branchId) {
      url = `/lab/${branchId}/user/${id}`;
    } else if (loginAs === 'lab') {
      url = `/lab/${profile.selectedRole.uuid}/user/${id}`;
    }
    if (url) {
      const res = await fetchRequest({
        url,
        method: 'PUT',
        isAuth: true,
        body: { active: status },
      });
      if (res && res.status === 200) {
        const data = await res.json();
        data.message && setNotification({ show: true, message: data.message, type: 'success' });
        getUsers();
      }
    }
  };

  const deleteUser = async id => {
    let url = null;
    if ((loginAs === 'lab-admin' || loginAs === 'super-admin' || loginAs === 'assistant-admin') && branchId) {
      url = `/lab/${branchId}/user/${id}`;
    } else if (loginAs === 'lab') {
      url = `/lab/${profile.selectedRole.uuid}/user/${id}`;
    }
    if (url) {
      const res = await fetchRequest({
        url,
        method: 'DELETE',
        isAuth: true,
      });
      if (res && res.status === 200) {
        const data = await res.json();
        data.message && setNotification({ show: true, message: data.message, type: 'success' });
        getUsers();
      }
    }
  };

  return (
    <div className="d-flex flex-wrap branch-details-wrapper w-100">
      <Notification {...notification} />
      {profile?.selectedRole?.role.actual_role === 'lab_technician' ? (
        <div className="w-100 d-flex justify-content-center">Details not available.</div>
      ) : (
        <div className={`paper paper-card user-details-card`}>
          <div className={`content-header d-flex align-items-baseline justify-content-between`}>
            <p className="semi-bold title">Branch Users</p>
            <div className="d-flex">
              <ContainedButton
                lightBlue
                className="add-btn"
                onClick={() => {
                  let url = null;
                  if ((loginAs === 'lab-admin' || loginAs === 'super-admin' || loginAs === 'assistant-admin') && branchId) {
                    url = `/lab/${branchId}/user`;
                  } else if (loginAs === 'lab') {
                    url = `/lab/${profile?.selectedRole.uuid}/user`;
                  }
                  setActionObject({
                    title: 'Add a User',
                    confirmAction: 'Save',
                    isModalOpen: true,
                    url: url,
                    method: 'POST',
                    handleSuccess: data => {
                      data.message &&
                        setNotification({
                          show: true,
                          message: data.message,
                          type: 'success',
                        });
                      setTimeout(() => getUsers(), 2000);
                    },
                    setNotification: setNotification,
                  });
                }}
              >
                <div className="d-flex align-items-center">
                  <p className="add-icon mr-2">+{Person}</p>
                  <p className="pt-1">Add a User</p>
                </div>
              </ContainedButton>
              <UserAddEditModal actionObject={actionObject}></UserAddEditModal>
            </div>
          </div>
          <Table columnDefs={headers} tableData={users} isLoading={loading} />
        </div>
      )}
    </div>
  );
};

export default BranchUsers;
