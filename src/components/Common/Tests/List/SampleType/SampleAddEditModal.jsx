import React, { useState, useEffect, useContext } from 'react';
import { ContainedButton, OutlinedButton } from '../../../../Buttons/Button';
import AsyncSelectInput from '../../../../FormInputs/AsyncSelectInput/AsyncSelectInput';
import TextInput from '../../../../FormInputs/TextInput/TextInput';
import { CustomModal, ModalBody, ModalFooter, ModalHeader } from '../../../../Modal/Modal';
import { fetchRequest } from '../../../../../utils/api';
import { ProfileContext } from '../../../../../context/context';

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
  unit: {},
};

const SampleAddEditModal = ({ actionObject = defaultState }) => {
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);
  const { title, confirmAction, isModalOpen } = actionObject;
  const [modal, handleModalToggle] = useState(isModalOpen);
  const [initials, setInitials] = useState({ ...formDefaultState });
  const [errors, setError] = useState({});
  const [units, setUnits] = useState([]);

  useEffect(() => {
    handleModalToggle(isModalOpen);
    actionObject.data && actionObject.data && setInitials(actionObject.data);
    getUnits();
  }, [actionObject, isModalOpen]);

  const onHandleChange = (value, key) => {
    let obj = { ...initials };
    obj[key] = value;
    setInitials({ ...obj });
  };

  const getUnits = async search => {
    let url = '/super_admin/units';
    if(loginAs == "lab-admin") url = `/lab_group/${profile?.selectedRole?.uuid}/units`;
    else if(loginAs == "lab") url = `/lab/${profile?.selectedRole?.uuid}/units`;
    const res = await fetchRequest({
      url: `${url}?include=inactive${search ? `&search=${search}` : ''}`,
      method: 'GET',
      isAuth: true,
    });
    if (res && res.status === 200) {
      const { data } = await res.json();
      const newData = data && data.length && [...data].map(unit => ({ label: unit.name, value: unit.uuid }));
      setUnits(newData);
      return newData;
    }
  };

  const handleConfirmAction = async () => {
    let body = {
        name: initials.name,
        unit_id: unit && unit.value,
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
    return;
  };

  const { name, unit } = initials;
  return (
    <CustomModal className="add-edit-modal" modalIsOpen={modal} closeModal={handleModalToggle}>
      <ModalHeader className="text-center">
        <p className="semi-bold">{title}</p>
      </ModalHeader>
      <ModalBody>
        <form className="add-details-form pl-2 pr-4">
          <div className="form-group mb-4">
            <TextInput
              placeholder="Sample Type Name*"
              value={name || ''}
              onChange={e => onHandleChange(e.target.value, 'name')}
              error={errors && errors['name']}
            />
          </div>
          <div className="form-group">
            <AsyncSelectInput
              placeholder="Unit*"
              options={units}
              FilterData={getUnits}
              value={unit}
              onChange={option => onHandleChange(option, 'unit')}
              error={errors && errors['unit_id']}
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
        <ContainedButton lightBlue onClick={handleConfirmAction}>
          {confirmAction}
        </ContainedButton>
      </ModalFooter>
    </CustomModal>
  );
};

export default SampleAddEditModal;
