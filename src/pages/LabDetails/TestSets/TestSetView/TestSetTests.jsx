import React, { useState, useEffect, useCallback } from 'react';
import { More, AddTestIcon, Filter } from '../../../../assets/icons';
import { ContainedButton } from '../../../../components/Buttons/Button';
import { fetchRequest } from '../../../../utils/api';
import Table from '../../../../components/Table/Table';
import SearchBox from '../../../../components/Common/SearchBox/SearchBox';
import { useParams } from 'react-router-dom';
import AddTestInSetModal from './AddTestInSetModal';
import Notification from '../../../../components/Notification/Notification';
import Popover from '../../../../components/Popover/Popover';

const TestSetTests = () => {
  const [actionObject, setActionObject] = useState(); //lab_group uuid from profile api
  const [masterTestList, setMasterTestList] = useState([]);
  const { branchId, labId, testSetId, type } = useParams();
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [filter, setFilter] = useState({ per_page: 15, sort: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTestsFromTestSet();
  }, [labId, branchId, testSetId]); // eslint-disable-line react-hooks/exhaustive-deps

  const headers = [
    {
      label: 'Test Name',
      accessKey: 'test.name',
    },
    {
      label: 'Short Name',
      accessKey: 'test.short_name',
      renderFilterIcon: Filter,
    },
    {
      label: 'Category',
      cellRenderer: ({ test }) => test?.test_category?.name || '-',
    },
    {
      label: 'Cost',
      accessKey: 'cost',
      renderFilterIcon: Filter,
      isAmount: true,
    },
    {
      label: '',
      accessKey: 'actions',
      renderIcon: More,
      width: '5%',
      cellRenderer: row => {
        return (
          <div className="d-flex align-items-center">
            <Popover button={<p className="table-icon">{More}</p>}>
              <div
                className={`user-action cursor-pointer py-1`}
                onClick={() => {
                  let url = null;
                  if (type === 'lab-group') {
                    url = `/lab_group/${labId}/test_set/${testSetId}/test/${row.uuid}`;
                  } else {
                    url = `/lab/${branchId}/test_set/${testSetId}/test/${row.uuid}`;
                  }
                  setActionObject({
                    confirmAction: 'Save',
                    isModalOpen: true,
                    url: url,
                    params: { branchId, labId, testSetId, type },
                    method: 'PUT',
                    isEdit: true,
                    handleSuccess: getTestsFromTestSet,
                    setNotification: setNotification,
                  });
                }}
              >
                Edit Test Details
              </div>
              <div className={`user-action cursor-pointer delete-action py-1`} onClick={() => deleteTestFromSet(row.uuid)}>
                Permanently Delete Test
              </div>
            </Popover>
          </div>
        );
      },
    },
  ];

  const getTestsFromTestSet = async () => {
    setLoading(true);
    const { search, per_page = 15, current_page } = filter;
    let url = null;
    if (type === 'lab-group') {
      url = `/lab_group/${labId}/test_set/${testSetId}/test`;
    } else {
      url = `/lab/${branchId}/test_set/${testSetId}/test`;
    }
    if (url) {
      const res = await fetchRequest({
        url: url + `?per_page=${per_page}${current_page ? `&page=${current_page}` : ''}${search ? `&search=${search}` : ''}`,
        method: 'GET',
        isAuth: true,
      });
      setLoading(false);
      if (res && res.status === 200) {
        const { data, meta } = await res.json();
        setMasterTestList({ data, pagination: meta.pagination });
        return data;
      }
      return;
    }
  };

  const deleteTestFromSet = async id => {
    let url = null;
    if (type === 'lab-group') {
      url = `/lab_group/${labId}/test_set/${testSetId}/test/${id}`;
    } else {
      url = `/lab/${branchId}/test_set/${testSetId}/test/${id}`;
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
        getTestsFromTestSet();
      }
    }
  };

  useEffect(() => {
    getTestsFromTestSet();
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const getListPerPage = useCallback(pg => {
    setFilter(filter => ({ ...filter, ...pg }));
  }, []);

  return (
    <div className="d-flex flex-wrap w-100">
      <Notification {...notification} />
      <div className={`paper paper-card test-master-list`}>
        <div className={`content-header d-flex align-items-baseline justify-content-between`}>
          <p className="semi-bold title">List of Test in the Set</p>
          <div className="d-flex">
            <ContainedButton
              lightBlue
              className="add-with-icon mr-3"
              onClick={() => {
                let url = null;
                if (type === 'lab-group') {
                  url = `/lab_group/${labId}/test_set/${testSetId}/test`;
                } else {
                  url = `/lab/${branchId}/test_set/${testSetId}/test`;
                }
                setActionObject({
                  confirmAction: 'Save',
                  isModalOpen: true,
                  url: url,
                  params: { branchId, labId, testSetId, type },
                  method: 'POST',
                  handleSuccess: getTestsFromTestSet,
                  setNotification: setNotification,
                });
              }}
            >
              <div className="d-flex align-items-center">
                <p className="mr-2">{AddTestIcon}</p>
                <p className="pt-1">Add A Test</p>
              </div>
            </ContainedButton>
            {actionObject && <AddTestInSetModal actionObject={actionObject}></AddTestInSetModal>}
            <div className="push-4 ">
              <SearchBox setFilter={setFilter} placeholder="Search by Name" />
            </div>
          </div>
        </div>
        <Table
          columnDefs={headers}
          tableData={masterTestList.data}
          pagination={{ ...masterTestList.pagination, getListPerPage }}
          blankDataMessage="No Tests Added Yet"
          isLoading={loading}
          filter={filter}
          listName="tests"
        />
      </div>
    </div>
  );
};

export default TestSetTests;
