import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Plus } from '../../../../../assets/icons';
import UnitAddEditModal from './UnitAddEditModal';
import { ContainedButton, OutlinedButton } from '../../../../../components/Buttons/Button';
import { fetchRequest } from '../../../../../utils/api';
import Table from '../../../../../components/Table/Table';
import Notification from '../../../../../components/Notification/Notification';
import SearchBox from '../../../../../components/Common/SearchBox/SearchBox';
import ConfirmationModal from '../../../../../components/Modal/ConfirmationModal';
import { ProfileContext } from '../../../../../context/context';

const UnitList = () => {
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);
  const [actionObject, setActionObject] = useState(); //lab_group uuid from profile api
  const [deleteActionObject, setDeleteActionObject] = useState();
  const [units, setUnits] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [filter, setFilter] = useState({ per_page: 15, sort: [] });
  const [loading, setLoading] = useState(false);

  let url = '/super_admin/units';
  if(loginAs == "lab-admin") url = `/lab_group/${profile?.selectedRole?.uuid}/units`;
  else if(loginAs == "lab") url = `/lab/${profile?.selectedRole?.uuid}/units`;

  const headers = [
    {
      label: 'Unit Name',
      accessKey: 'name',
    },
    {
      label: 'Actions',
      accessKey: 'actions',
      width: '16%',
      cellRenderer: row => (
        <OutlinedButton
          lightBlue
          className=""
          onClick={() => {
            setActionObject({
              title: 'Edit Unit',
              confirmAction: 'Save',
              isModalOpen: true,
              url,
              method: 'PUT',
              isEdit: true,
              data: {
                uuid: row.uuid,
                name: row.name,
              },
              handleSuccess: data => {
                data.message &&
                  setNotification({
                    show: true,
                    message: data.message,
                    type: 'success',
                  });
                setTimeout(() => getUnits(), 2000);
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
      width: '16%',
      cellRenderer: row => (
        <OutlinedButton
          red
          onClick={() =>{
            setDeleteActionObject({
              title: 'Confirmation',
              msg: 'Are you sure you want to delete this unit? It will be erased completely and you cannot undo it.',
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
                setTimeout(() => getUnits(), 2000);
              },
              setNotification,
              isModalOpen: true,
            })
          }}
          disabled={!row.can_delete}
        >
          Remove
        </OutlinedButton>
      ),
    },
  ];

  const getUnits = useCallback(() => {
    setLoading(true);
    const { per_page = 15, current_page, search } = filter;
    (async () => {
      const res = await fetchRequest({
        url: `${url}?include=inactive&per_page=${per_page}${current_page ? `&page=${current_page}` : ''}${
          search ? `&search=${search}` : ''
        }`,
        method: 'GET',
        isAuth: true,
      });
      if (res && res.status === 200) {
        setLoading(false);
        const { data, meta } = await res.json();
        setUnits({ data, pagination: meta?.pagination });
        return data;
      } else {
        setLoading(false);
      }
      return;
    })();
  }, [filter]);

  useEffect(() => {
    getUnits({});
  }, [getUnits]);

  const getListPerPage = pg => {
    setFilter({ ...filter, ...pg });
  };

  return (
    <div className="d-flex flex-wrap w-100">
      <Notification {...notification} />
      <div className={`paper paper-card unit-master-list`}>
        <div className={`content-header d-flex align-items-baseline justify-content-between`}>
          <p className="semi-bold title">List of Units</p>
          <div className="d-flex">
            <ContainedButton
              lightBlue
              className="add-with-icon mr-3"
              onClick={() => {
                setActionObject({
                  title: 'Add a Unit',
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
                    setTimeout(() => getUnits(), 2000);
                  },
                });
              }}
            >
              <div className="d-flex align-items-center">
                <p className="mr-2">{Plus}</p>
                <p className="pt-1">Add New Unit</p>
              </div>
            </ContainedButton>
            {actionObject && <UnitAddEditModal actionObject={actionObject}></UnitAddEditModal>}
            {deleteActionObject && <ConfirmationModal actionObject={deleteActionObject}></ConfirmationModal>}
            <SearchBox setFilter={setFilter} filter={filter} placeholder="Search by Name" />
          </div>
        </div>
        <Table
          columnDefs={headers}
          tableData={units.data}
          pagination={{ ...units.pagination, getListPerPage }}
          setFilter={setFilter}
          filter={filter}
          isLoading={loading}
          listName="units"
        />
      </div>
    </div>
  );
};

export default UnitList;
