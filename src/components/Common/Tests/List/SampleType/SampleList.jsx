import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Plus } from '../../../../../assets/icons';
import SampleAddEditModal from './SampleAddEditModal';
import { ContainedButton, OutlinedButton } from '../../../../../components/Buttons/Button';
import { fetchRequest } from '../../../../../utils/api';
import Table from '../../../../../components/Table/Table';
import Notification from '../../../../../components/Notification/Notification';
import SearchBox from '../../../../../components/Common/SearchBox/SearchBox';
import ConfirmationModal from '../../../../../components/Modal/ConfirmationModal';
import { ProfileContext } from '../../../../../context/context';

const SampleList = () => {
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);
  const [actionObject, setActionObject] = useState(); //lab_group uuid from profile api
  const [deleteActionObject, setDeleteActionObject] = useState();
  const [sampleTypes, setSampleTypes] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [filter, setFilter] = useState({ per_page: 15 });
  const [loading, setLoading] = useState(false);

  let url = '/super_admin/samples';
  if(loginAs == "lab-admin") url = `/lab_group/${profile?.selectedRole?.uuid}/samples`;
  else if(loginAs == "lab") url = `/lab/${profile?.selectedRole?.uuid}/samples`;

  const getSampleTypes = useCallback(async () => {
    setLoading(true);
    const { search } = filter;
    
    const res = await fetchRequest({
      url: `${url}?${search ? `search=${search}` : ''}`,
      method: 'GET',
      isAuth: true,
    });
    if (res && res.status === 200) {
      setLoading(false);
      const { data } = await res.json();
      const newData =
        data &&
        data.length &&
        [...data].map(data => ({ ...data, unit_name: data.unit.name, unit: { label: data.unit.name, value: data.unit.uuid } }));
      setSampleTypes(newData);
      return data;
    } else {
      setLoading(false);
    }

    return;
  }, [filter]);

  useEffect(() => {
    getSampleTypes();
  }, [filter, getSampleTypes]);

  const headers = [
    {
      label: 'Sample Type',
      accessKey: 'name',
    },
    {
      label: 'Unit Name',
      accessKey: 'unit_name',
    },
    {
      label: 'Actions',
      accessKey: 'actions',
      width: '15%',
      cellRenderer: row => (
        <OutlinedButton
          lightBlue
          className=""
          onClick={() => {
            setActionObject({
              title: 'Edit Sample Type',
              confirmAction: 'Save',
              isModalOpen: true,
              url,
              method: 'PUT',
              isEdit: true,
              data: row,
              handleSuccess: data => {
                data.message &&
                  setNotification({
                    show: true,
                    message: data.message,
                    type: 'success',
                  });
                setTimeout(() => getSampleTypes(), 2000);
              },
            });
          }}
          disabled={!row.can_edit}
        >
          Edit Details
        </OutlinedButton>
      ),
    },
    {
      label: '',
      accessKey: 'actions',
      width: '15%',
      cellRenderer: row => (
        <OutlinedButton
          red
          onClick={() =>
            setDeleteActionObject({
              title: 'Confirmation',
              msg: 'Are you sure you want to delete this sample type? It will be erased completely and you cannot undo it.',
              cancelAction: 'Go Back',
              confirmAction: 'Delete',
              method: 'DELETE',
              url: `${url}/${row.uuid}`,
              handleSuccess: data => {
                data.message &&
                  setNotification({
                    show: true,
                    message: data.message,
                    type: 'success',
                  });
                setTimeout(() => getSampleTypes(), 2000);
              },
              setNotification,
              isModalOpen: true,
            })
          }
          disabled={!row.can_delete}
        >
          Remove
        </OutlinedButton>
      ),
    },
  ];

  return (
    <div className="d-flex flex-wrap w-100">
      <Notification {...notification} />
      <div className={`paper paper-card sample-type-master-list`}>
        <div className={`content-header d-flex align-items-baseline justify-content-between`}>
          <p className="semi-bold title">List of Sample Types</p>
          <div className="d-flex">
            <ContainedButton
              lightBlue
              className="add-with-icon mr-3"
              onClick={() => {
                setActionObject({
                  title: 'Add a Sample Type',
                  confirmAction: 'Save',
                  isModalOpen: true,
                  url,
                  method: 'POST',
                  handleSuccess: data => {
                    data.message &&
                      setNotification({
                        show: true,
                        message: data.message,
                        type: 'success',
                      });
                    setTimeout(() => getSampleTypes({}), 2000);
                  },
                });
              }}
            >
              <div className="d-flex align-items-center">
                <p className="mr-2">{Plus}</p>
                <p className="pt-1">Add New Sample Type</p>
              </div>
            </ContainedButton>
            {actionObject && <SampleAddEditModal actionObject={actionObject}></SampleAddEditModal>}
            {deleteActionObject && <ConfirmationModal actionObject={deleteActionObject}></ConfirmationModal>}
            <SearchBox setFilter={setFilter} filter={filter} placeholder="Search by Name" />
          </div>
        </div>
        <Table
          columnDefs={headers}
          tableData={sampleTypes}
          setFilter={setFilter}
          filter={filter}
          isLoading={loading}
          listName="sample types"
        />
      </div>
    </div>
  );
};

export default SampleList;
