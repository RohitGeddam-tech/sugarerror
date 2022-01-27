import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import SelectInput from '../../../../../components/FormInputs/SelectInput/SelectInput';
import { CustomModal, ModalHeader, ModalBody, ModalFooter } from '../../../../../components/Modal/Modal';
import TextInput from '../../../../../components/FormInputs/TextInput/TextInput';
import { ContainedButton, OutlinedButton } from '../../../../../components/Buttons/Button';
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
  first_name: '',
  last_name: '',
  role: '',
  mobile: '',
  email: '',
};

const UserAddEditModal = ({ actionObject = defaultState }) => {
  const loginAs = localStorage.getItem('loginAs');
  const { branchId } = useParams();
  const { title, confirmAction, isModalOpen } = actionObject;
  const [modal, handleModalToggle] = useState(isModalOpen);
  const [initials, setInitials] = useState({ ...formDefaultState });
  const [errors, setError] = useState({});
  const [labRoles, setLabRoles] = useState([]);
  const [disabledInput, setDisabledInput] = useState(false);
  const { profile } = useContext(ProfileContext);

  useEffect(() => {
    handleModalToggle(isModalOpen);
    getLabRoles();
    actionObject.uuid && getSignleLabUser();
  }, [isModalOpen, actionObject, branchId]); // eslint-disable-line react-hooks/exhaustive-deps

  const getLabRoles = async () => {
    let url = null;
    if ((loginAs === 'lab-admin' || loginAs === 'super-admin' || loginAs === 'assistant-admin') && branchId) {
      url = `/lab/${branchId}/roles`;
    } else if (loginAs === 'lab') {
      url = `/lab/${profile.selectedRole.uuid}/roles`;
    }
    if (url) {
      const res = await fetchRequest({ url, method: 'GET', isAuth: true });
      if (res && res.status === 200) {
        const { data } = await res.json();
        const roles = data && data.length && [...data].map(role => ({ label: role.formatted_name, value: role.uuid, id: role.name }));
        setLabRoles(roles);
        return data;
      }
      return;
    }
  };

  const getSignleLabUser = async () => {
    const res = await fetchRequest({ url: actionObject.url, method: 'GET', isAuth: true });
    if (res && res.status === 200) {
      const { data } = await res.json();
      const newObject = {
        uuid: data.uuid,
        name: data.lab_user.first_name + ' ' + data.lab_user.last_name,
        mobile: data.lab_user.mobile,
        email: data.lab_user.email || '-',
        role: { label: data.lab_role.formatted_name, value: data.lab_role.uuid, id: data.lab_role.name },
      };
      setInitials({ ...newObject });
      return data;
    }
    return;
  };

  const getDetailsFromMobile = async mobile => {
    setDisabledInput(false);
    setInitials({ first_name: '', last_name: '', email: '', role : initials.role, mobile });
    const res = await fetchRequest({ url: `/get_user_details?mobile=${mobile}`, method: 'GET', isAuth: true });
    if (res && res.status === 200) {
      const { data } = await res.json();
      if (data && data.length !== 0) {
        setInitials({ ...initials, ...data });
        setDisabledInput(true);
      }
      return data;
    }
    return;
  };

  const onHandleChange = (value, key) => {
    let obj = { ...initials };
    obj[key] = value;
    setInitials({ ...obj });
    if (key === 'mobile' && value.toString().length === 10) getDetailsFromMobile(value);
    else setDisabledInput(false);
  };

  const handleConfirmAction = async () => {
    actionObject.setNotification({ show: false, message: '', type: '' });
    let body = { ...initials, role: initials.role && initials.role.id };
    if (initials.uuid) {
      body = {
        uuid: initials.uuid,
        role: initials.role && initials.role.id,
      };
    }

    const res = await fetchRequest({ url: actionObject.url, method: actionObject.method, isAuth: true, body: body });
    if (res && res.status === 200) {
      const data = await res.json();
      if (data.success) {
        handleModalToggle(false);
        setInitials({ ...formDefaultState });
        actionObject.handleSuccess(data);
      }
    } else {
      const errObj = await res.json();
      setError({ ...errObj.errors });
      res.status !== 422 &&
        !Object.keys(errObj.error ? errObj.error : {}).length &&
        errObj.message &&
        actionObject.setNotification({ show: true, message: errObj.message, type: 'error' });
    }
    return;
  };

  const { first_name, last_name, role, mobile, email, name } = initials;
  return (
    <CustomModal className="add-details-modal" modalIsOpen={modal} closeModal={handleModalToggle}>
      <ModalHeader className="text-center">
        <p className="semi-bold">{title}</p>
      </ModalHeader>
      <ModalBody className="mb-2">
        <form className="add-details-form pl-2 pr-4">
          <div className="form-group w-250">
            <SelectInput
              placeholder="Role"
              options={labRoles}
              value={role}
              onChange={value => onHandleChange(value, 'role')}
              error={errors && errors['role']}
            ></SelectInput>
          </div>
          {actionObject.isEdit ? (
            <div className="edit-user-data-card">
              <div className="d-flex card-row mb-2">
                <div className="semi-bold label">Mobile No. : </div>
                <div className={`value`}>{mobile}</div>
              </div>
              <div className="d-flex card-row mb-2">
                <div className="semi-bold label">Email : </div>
                <div className={`value`}>{email || '-'}</div>
              </div>
              <div className="d-flex card-row mb-2">
                <div className="semi-bold label">Name : </div>
                <div className={`value`}>{name}</div>
              </div>
            </div>
          ) : (
            <>
              <div className="d-flex">
                <div className="form-group mr-3">
                  <TextInput
                    placeholder="Mobile No*"
                    value={mobile}
                    onChange={e => onHandleChange(e.target.value, 'mobile')}
                    error={errors && errors['mobile']}
                  />
                </div>
                <div className="form-group">
                  <TextInput
                    placeholder="Email"
                    value={email}
                    onChange={e => onHandleChange(e.target.value, 'email')}
                    error={errors && errors['email']}
                    disabled={disabledInput}
                  />
                </div>
              </div>
              <div className="d-flex">
                <div className="form-group mr-3">
                  <TextInput
                    placeholder="First Name*"
                    value={first_name}
                    onChange={e => onHandleChange(e.target.value, 'first_name')}
                    error={errors && errors['first_name']}
                    disabled={disabledInput}
                  ></TextInput>
                </div>
                <div className="form-group">
                  <TextInput
                    placeholder="Last Name*"
                    value={last_name}
                    onChange={e => onHandleChange(e.target.value, 'last_name')}
                    error={errors && errors['last_name']}
                    disabled={disabledInput}
                  ></TextInput>
                </div>
              </div>
            </>
          )}
        </form>
      </ModalBody>
      <ModalFooter className="justify-content-center">
        <OutlinedButton
          onClick={() => {
            handleModalToggle(false);
            setInitials({ ...formDefaultState });
            setError({});
            setDisabledInput(false);
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

export default UserAddEditModal;
