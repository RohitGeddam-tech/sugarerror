import React, { useState, useEffect, useContext } from 'react';
import { ContainedButton, OutlinedButton } from '../../../components/Buttons/Button';
import SelectInput from '../../../components/FormInputs/SelectInput/SelectInput';
import TextInput from '../../../components/FormInputs/TextInput/TextInput';
import { ProfileContext } from '../../../context/context';
import { CustomModal, ModalBody, ModalFooter, ModalHeader } from '../../../components/Modal/Modal';
import { fetchRequest } from '../../../utils/api';

const defaultState = {
  title: '',
  confirmAction: '',
  method: '',
  url: '',
  handleSuccess: '',
  isModalOpen: false,
  isEdit: false,
  uuid: null,
  cloneFromApi: '',
};

const setTypes = [
  { label: 'New', value: 'new' },
  { label: 'Clone', value: 'clone' },
];

const formDefaultState = {
  type: setTypes[0],
  clone_from: null,
  name: '',
  branch: '',
};

const TestSetAddModal = ({ actionObject = defaultState }) => {
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);
  const [labId, setLabId] = useState();
  const { title, confirmAction, isModalOpen } = actionObject;
  const [modal, handleModalToggle] = useState(isModalOpen);
  const [initials, setInitials] = useState({ ...formDefaultState });
  const [errors, setError] = useState({});
  const [testSets, setTestSets] = useState([]);
  const [branchList, setBranchList] = useState([]);

  useEffect(() => {
    setLabId(profile.selectedRole.uuid);
    if (labId && profile.selectedRole.role.name === 'lab_admin') {
      (async () => {
        const statusRes = await fetchRequest({ url: `/lab_group/${labId}/get_labs`, method: 'GET', isAuth: true });
        if (statusRes && statusRes.status === 200) {
          const { data } = await statusRes.json();
          const branches = [
            { label: 'All Branches', value: 'All branches' },
            ...data.map(item => ({
              label: item.name,
              value: item.uuid,
              ...item,
            })),
          ];
          setBranchList(branches);
        }
        return;
      })();
    }
  }, [isModalOpen, labId, profile.selectedRole]);

  useEffect(() => {
    handleModalToggle(isModalOpen);
    const getTestSetToClone = async () => {
      if (actionObject.cloneFromApi) {
        const res = await fetchRequest({ url: actionObject.cloneFromApi, method: 'GET', isAuth: true });
        if (res && res.status === 200) {
          const { data } = await res.json();
          const testSets = data && data.length && [...data].map(set => ({ label: set.name, value: set.uuid }));
          setTestSets(testSets);
          return data;
        }
      }
    };
    getTestSetToClone();
  }, [actionObject, isModalOpen]);

  const onHandleChange = (value, key) => {
    let obj = { ...initials };
    obj[key] = value;
    setInitials({ ...obj });
  };

  const handleConfirmAction = async () => {
    if (actionObject.url) {
      let url = '';
      let body = '';
      if (initials.branch.label === 'All Branches') {
        url = `/lab_group/${labId}/test_set`;
        body = { name: initials.name, type: initials.type && initials.type.value };
        if (initials.type && initials.type.value === 'clone') {
          body = {
            ...body,
            clone_from: initials.clone_from.value,
          };
        }
      } else {
        if(loginAs === "lab") url = `/lab/${profile.selectedRole.uuid}/test_set`;
        else url = `/lab/${initials.branch.uuid}/test_set`;
        body = { name: initials.name, type: initials.type && initials.type.value, branch: initials.branch && initials.branch.uuid };
        if (initials.type && initials.type.value === 'clone') {
          body = {
            ...body,
            clone_from: initials.clone_from.value,
          };
        }
      }

      const res = await fetchRequest({ url: url, method: 'POST', isAuth: true, body: body });
      if (res && res.status === 200) {
        const data = await res.json();
        if (data.success) {
          handleModalToggle(false);
          setInitials({ ...formDefaultState });
          actionObject.handleSuccess();
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
    }
  };

  const { type, clone_from, name, branch } = initials;
  return (
    <CustomModal className="add-details-modal test-set-modal" modalIsOpen={modal} closeModal={handleModalToggle}>
      <ModalHeader className="text-center">
        <p className="semi-bold">{title}</p>
      </ModalHeader>
      <ModalBody className="mb-2 container">
        <form className="add-details-form pl-4 pr-4">
          <div className="row">
            <div className="mb-3 col-sm-6">
              <SelectInput
                placeholder="Set Type*"
                options={setTypes}
                value={type}
                onChange={value => onHandleChange(value, 'type')}
                error={errors && errors['type']}
              ></SelectInput>
            </div>
            {loginAs !== 'lab' && <div className="mb-3 col-sm-6">
              <SelectInput
                placeholder="Branch*"
                options={branchList}
                value={branch}
                onChange={value => onHandleChange(value, 'branch')}
                error={errors && errors['type']}
              ></SelectInput>
            </div>}
          </div>
          {}
          {type && type.value === 'clone' ? (
            <div className="form-group mb-3">
              <SelectInput
                placeholder="Clone from*"
                options={testSets}
                value={clone_from}
                onChange={value => onHandleChange(value, 'clone_from')}
                error={errors && errors['clone_from']}
              ></SelectInput>
            </div>
          ) : (
            <></>
          )}
          <div className="form-group mb-4">
            <TextInput
              placeholder="Name*"
              value={name}
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
        <ContainedButton lightBlue onClick={handleConfirmAction}>
          {confirmAction}
        </ContainedButton>
      </ModalFooter>
    </CustomModal>
  );
};

export default TestSetAddModal;
