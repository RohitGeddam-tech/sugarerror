import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRequest } from '../../../utils/api';
import { ProfileContext } from '../../../context/context';
import Table from '../../../components/Table/Table';
import { Filter, More, Plus } from '../../../assets/icons';
import { ContainedButton, OutlinedButton } from '../../../components/Buttons/Button';
import Popover from '../../../components/Popover/Popover';
import Notification from '../../../components/Notification/Notification';
import TestSetAddModal from './TestSetAddModal';
import SearchBox from '../../../components/Common/SearchBox/SearchBox';

const actionList = [
  { key: 'deactivate', label: 'Temporarily De-activate set' },
  { key: 'activate', label: 'Activate set' },
  { key: 'delete', label: 'Permanently Delete Set' },
];

const TestSetList = props => {
  const loginAs = localStorage.getItem('loginAs');
  const [actionObject, setActionObject] = useState();
  const { profile } = useContext(ProfileContext);
  const [labId, setLabId] = useState(); //lab_group uuid from profile api
  const { branchId } = useParams();
  const [users, setUsers] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ sort: [] });

  useEffect(() => {
    if (profile && loginAs === 'lab-admin') {
      setLabId(profile.selectedRole.uuid);
    } else if (profile && (loginAs === 'super-admin' || loginAs === 'assistant-admin')) {
      setLabId(profile.selectedLabId);
    }
  }, [profile, branchId, loginAs]);

  const headers = [
    {
      label: 'Name',
      accessKey: 'name',
    },
    {
      label: 'Created on',
      accessKey: 'created_on',
    },
    {
      label: 'Branch',
      accessKey: 'branch',
    },
    {
      label: 'Status',
      accessKey: 'formatted_status',
      renderFilterIcon: { icon: Filter, key: 'status' },
      cellRenderer: row => <span className={`semi-bold status-${row.status}`}>{row.formatted_status}</span>,
    },
    {
      label: '',
      accessKey: 'actions',
      renderIcon: More,
      width: '20%',
      cellRenderer: row => {
        return (
          <div className="d-flex align-items-center">
            <OutlinedButton
              link
              to={{
                pathname: `${
                loginAs === 'lab-admin' ?
                  row.lab ? `/lab-admin/setting/test-set/lab/${row.lab.uuid}` : labId && `/lab-admin/setting/test-set/lab-group/${labId}`
                : `/lab/setting/test-set/lab/${profile.selectedRole.uuid}`
                }/${row.uuid}/tests`,
                state: { nameset: row },
              }}
            >
              View
            </OutlinedButton>
            <Popover button={<p className="table-icon">{More}</p>}>
              {actionList.map((item, key) => {
                let check = item.key === 'deactivate' ? row.active : item.key === 'activate' ? !row.active : true;
                return (
                  check && (
                    <div
                      key={key}
                      onClick={() => {
                        item.key === 'activate' && updateUserStatus(row.uuid, true);
                        item.key === 'deactivate' && updateUserStatus(row.uuid, false);
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
          </div>
        );
      },
    },
  ];

  const getTestSets = useCallback(async () => {
    let url = null;
    if (loginAs === 'lab-admin' && branchId) {
      url = `/lab/${branchId}/test_set`;
    } else if (loginAs === 'lab-admin' && labId) {
      url = `/lab_group/${labId}/test_set`;
    } else if (loginAs === 'lab') {
      url = `/lab/${profile.selectedRole.uuid}/test_set`;
    }
    if (url) {
      const { search, sort } = filter;
      setLoading(true);
      const res = await fetchRequest({
        url: `${url}?${search ? `search=${search}&` : ''}${
          sort && sort.length ? sort.map(item => `${item.key}=${item.value}`).join('') : ''
        }`,
        method: 'GET',
        isAuth: true,
      });
      res && setLoading(false);
      if (res && res.status === 200) {
        const { data } = await res.json();
        const newData =
          data &&
          data.length &&
          [...data].map(({ uuid, name, created_at, lab, active }) => ({
            uuid: uuid,
            name: name,
            created_on: created_at,
            lab,
            branch: lab ? lab.name : 'All branches',
            active,
            status: active ? 'active' : 'inactive',
            formatted_status: active ? 'Active' : 'Inactive',
          }));
        setUsers(newData);
        return data;
      }
    }
    return;
  }, [branchId, labId, profile.selectedRole.uuid, loginAs, filter]);

  const updateUserStatus = async (id, status) => {
    let url = null;
    if (loginAs === 'lab-admin' && branchId) {
      url = `/lab/${branchId}/test_set/${id}`;
    } else if (loginAs === 'lab-admin' && labId) {
      url = `/lab_group/${labId}/test_set/${id}`;
    } else if (loginAs === 'lab') {
      url = `/lab/${profile.selectedRole.uuid}/test_set/${id}`;
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
        getTestSets();
      }
    }
  };

  const deleteUser = async id => {
    let url = null;
    if (loginAs === 'lab-admin' && branchId) {
      url = `/lab/${branchId}/test_set/${id}`;
    } else if (loginAs === 'lab-admin' && labId) {
      url = `/lab_group/${labId}/test_set/${id}`;
    } else if (loginAs === 'lab') {
      url = `/lab/${profile.selectedRole.uuid}/test_set/${id}`;
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
        getTestSets();
      }
    }
  };

  const { search, sort } = filter;
  useEffect(() => {
    getTestSets();
  }, [search, sort, getTestSets]);

  return (
    <div className="d-flex flex-wrap branch-details-wrapper w-100">
      <Notification {...notification} />
      <div className={`paper paper-card user-details-card`}>
        <div className={`content-header d-flex align-items-baseline justify-content-between`}>
          <p className="semi-bold title">Test Sets</p>
          <div className="d-flex">
            <ContainedButton
              lightBlue
              className="add-btn mr-2"
              onClick={() => {
                let url = null,
                  cloneFromApiUrl = null;
                if (loginAs === 'lab-admin' && branchId) {
                  url = `/lab/${branchId}/test_set`;
                  cloneFromApiUrl = `/lab/${branchId}/test_set_to_clone`;
                } else if (loginAs === 'lab-admin' && labId) {
                  url = `/lab_group/${labId}/test_set`;
                  cloneFromApiUrl = `/lab_group/${labId}/test_set_to_clone`;
                } else if (loginAs === 'lab') {
                  url = `/lab/${profile.selectedRole.uuid}/test_set`;
                  cloneFromApiUrl = `/lab/${profile.selectedRole.uuid}/test_set_to_clone`;
                }
                setActionObject({
                  title: 'Please enter the required details',
                  confirmAction: 'Save',
                  isModalOpen: true,
                  url: url,
                  cloneFromApi: cloneFromApiUrl,
                  method: 'POST',
                  handleSuccess: getTestSets,
                  setNotification: setNotification,
                });
              }}
            >
              <div className="d-flex align-items-center">
                <p className="add-icon mr-2">{Plus}</p>
                <p className="pt-1">Add New Set</p>
              </div>
            </ContainedButton>
            <SearchBox setFilter={setFilter} filter={filter} className="small-search-box" placeholder="Search by Name" />
            {actionObject && <TestSetAddModal actionObject={actionObject}></TestSetAddModal>}
          </div>
        </div>
        <Table columnDefs={headers} tableData={users} setFilter={setFilter} filter={filter} isLoading={loading} />
      </div>
    </div>
  );
};

export default TestSetList;
