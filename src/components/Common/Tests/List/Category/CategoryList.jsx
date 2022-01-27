import React, { useState, useEffect, useContext } from 'react';
import { Plus } from '../../../../../assets/icons';
import CategoryAddEditModal from './CategoryAddEditModal';
import { ContainedButton, OutlinedButton } from '../../../../../components/Buttons/Button';
import { fetchRequest } from '../../../../../utils/api';
import Table from '../../../../../components/Table/Table';
import Notification from '../../../../../components/Notification/Notification';
import ConfirmationModal from '../../../../../components/Modal/ConfirmationModal';
import { ProfileContext } from '../../../../../context/context';

const CategoryList = () => {
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);
  const [actionObject, setActionObject] = useState(); //lab_group uuid from profile api
  const [deleteActionObject, setDeleteActionObject] = useState();
  const [categories, setCategories] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  let url = '/super_admin/test_category';
  if(loginAs == "lab-admin") url = `/lab_group/${profile?.selectedRole?.uuid}/test_categories`;
  else if(loginAs == "lab") url = `/lab/${profile?.selectedRole?.uuid}/test_categories`;

  useEffect(() => {
    getCategories();
  }, []);

  const headers = [
    {
      label: 'Category Name',
      accessKey: 'name',
    },
    {
      label: 'Actions',
      accessKey: 'actions',
      width: '19%',
      cellRenderer: row => (
        <OutlinedButton
          lightBlue
          className=""
          onClick={() => {
            setActionObject({
              title: 'Edit Category',
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
                setTimeout(() => getCategories(), 2000);
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
              msg: 'Are you sure you want to delete this category? It will be erased completely and you cannot undo it.',
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
                setTimeout(() => getCategories(), 2000);
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

  const getCategories = async () => {
    const res = await fetchRequest({ url, method: 'GET', isAuth: true });
    if (res && res.status === 200) {
      const { data } = await res.json();
      setCategories(data);
      return data;
    }
    return;
  };

  return (
    <div className="d-flex flex-wrap w-100">
      <Notification {...notification} />
      <div className={`paper paper-card category-master-list`}>
        <div className={`content-header d-flex align-items-baseline justify-content-between`}>
          <p className="semi-bold title">List of Categories</p>
          <div className="d-flex">
            <ContainedButton
              lightBlue
              className="add-with-icon"
              onClick={() => {
                setActionObject({
                  title: 'Add a Category',
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
                    setTimeout(() => getCategories({}), 2000);
                  },
                });
              }}
            >
              <div className="d-flex align-items-center">
                <p className="mr-2">{Plus}</p>
                <p className="pt-1">Add New Category</p>
              </div>
            </ContainedButton>
            {actionObject && <CategoryAddEditModal actionObject={actionObject} categories={categories}></CategoryAddEditModal>}
            {deleteActionObject && <ConfirmationModal actionObject={deleteActionObject}></ConfirmationModal>}
          </div>
        </div>
        <Table columnDefs={headers} tableData={categories} />
      </div>
    </div>
  );
};

export default CategoryList;
