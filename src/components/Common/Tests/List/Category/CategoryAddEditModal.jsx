import React, { useState, useEffect, useCallback } from 'react';
import { ContainedButton, OutlinedButton } from '../../../../../components/Buttons/Button';
import TextInput from '../../../../../components/FormInputs/TextInput/TextInput';
import { CustomModal, ModalBody, ModalFooter, ModalHeader } from '../../../../../components/Modal/Modal';
import { fetchRequest } from '../../../../../utils/api';

const defaultState = {
  title: '',
  confirmAction: '',
  method: '',
  url: '',
  handleSuccess: '',
  isModalOpen: false,
  isEdit: false,
  uuid: null,
};
const formDefaultState = {
  name: '',
};

const CategoryAddEditModal = ({ actionObject = defaultState, categories }) => {
  const { title, confirmAction, isModalOpen } = actionObject;
  const [modal, handleModalToggle] = useState(isModalOpen);
  const [initials, setInitials] = useState({ ...formDefaultState });
  const [errors, setError] = useState({});

  useEffect(() => {
    handleModalToggle(isModalOpen);
    actionObject.data && actionObject.data && setInitials(actionObject.data);
  }, [actionObject, isModalOpen]);

  const onHandleChange = (value, key) => {
    setError({});
    let obj = { ...initials };
    obj[key] = value;
    setInitials({ ...obj });
  };

  const saveCategory = useCallback(async () => {
    let body = {
        name: initials.name,
      },
      url = actionObject.url;
    if (initials.uuid) {
      url = `${actionObject.url}/${initials.uuid}`;
    }

    const res = await fetchRequest({ url, method: actionObject.method, isAuth: true, body: body });
    if (res && res.status === 200) {
      const data = await res.json();
      if (data.success) {
        handleModalToggle(false);
        setInitials({ ...formDefaultState });
        actionObject.handleSuccess(data);
      }
    } else if (res && res.status === 400) {
      const { message } = await res.json();
      setError({ name : message });
    } else {
      const errObj = await res.json();
      setError({ ...errObj.errors });
    }
  }, [initials]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConfirmAction = useCallback(
    e => {
      e.preventDefault();
      if (initials.uuid) saveCategory();
      else if (![...categories].some(category => category.name === initials.name)) saveCategory();
      else setError({ name: ['Category already exists'] });
      return;
    },
    [initials, categories], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const { name } = initials;
  return (
    <CustomModal className="add-edit-modal" modalIsOpen={modal} closeModal={handleModalToggle}>
      <ModalHeader className="text-center">
        <p className="semi-bold">{title}</p>
      </ModalHeader>
      <ModalBody>
        <form className="add-details-form pl-2 pr-4">
          <div className="form-group">
            <TextInput
              placeholder="Category Name*"
              value={name || ''}
              onChange={e => onHandleChange(e.target.value, 'name')}
              error={errors && errors['name']}
            />
          </div>
        </form>
      </ModalBody>
      <ModalFooter className="justify-content-center">
        <OutlinedButton
          onClick={() => {
            handleModalToggle(false);
            setInitials({ ...formDefaultState });
            setError({});
          }}
        >
          Cancel
        </OutlinedButton>
        <ContainedButton lightBlue onClick={e => handleConfirmAction(e)}>
          {confirmAction}
        </ContainedButton>
      </ModalFooter>
    </CustomModal>
  );
};

export default CategoryAddEditModal;
