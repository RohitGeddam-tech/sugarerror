import React, { useState, useEffect } from 'react';
import Table from '../../../../components/Table/Table';
import { More, Person } from '../../../../assets/icons';
import { ContainedButton, OutlinedButton } from '../../../../components/Buttons/Button';
import UserAddEditModal from './UserAddEditModal';
import { fetchRequest } from '../../../../utils/api';
import Notification from '../../../../components/Notification/Notification';

const UserManagement = props => {
  const [actionObject, setActionObject] = useState();
  const [users, setUsers] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const headers = [
    {
      label: 'Name',
      accessKey: 'full_name',
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
      label: 'Role',
      defaultValue: 'Asst. Super Admin',
    },
    {
      label: '',
      accessKey: 'actions',
      renderIcon: More,
      cellRenderer: row => (
        <div className="d-flex align-items-center justify-content-end">
          <OutlinedButton red onClick={() => deleteUser(row.uuid)}>
            REMOVE
          </OutlinedButton>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const res = await fetchRequest({ url: `/super_admin/settings/user_management/users`, method: 'GET', isAuth: true });
    if (res && res.status === 200) {
      const { data } = await res.json();
      setUsers(data);
      return data;
    }
    return;
  };

  const deleteUser = async id => {
    setNotification({ show: false, message: '', type: '' });
    const res = await fetchRequest({
      url: `/super_admin/settings/user_management/users/${id}`,
      method: 'DELETE',
      isAuth: true,
    });
    if (res && res.status === 200) {
      const { message } = await res.json();
      setNotification({
        show: true,
        message,
        type: 'success',
      });
      getUsers();
    } else if (res && res.status === 400) {
      const { message } = await res.json();
      setNotification({ show: true, message, type: 'error' });
    }
  };

  return (
    <div className="d-flex flex-wrap branch-details-wrapper w-100">
      <Notification {...notification} />
      <div className={`paper paper-card user-details-card`}>
        <div className={`content-header d-flex align-items-baseline justify-content-between`}>
          <p className="semi-bold title">All Users</p>
          <div className="d-flex">
            <ContainedButton
              lightBlue
              className="add-btn"
              onClick={() => {
                setActionObject({
                  title: 'Add a User',
                  confirmAction: 'Save',
                  isModalOpen: true,
                  url: `/super_admin/settings/user_management/users`,
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
        <Table columnDefs={headers} tableData={users} />
      </div>
    </div>
  );
};

export default UserManagement;
