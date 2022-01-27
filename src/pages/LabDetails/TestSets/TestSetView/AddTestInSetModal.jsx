import React, { useState, useEffect, useCallback } from 'react';
import { ContainedButton, OutlinedButton } from '../../../../components/Buttons/Button';
import AsyncSelectInput from '../../../../components/FormInputs/AsyncSelectInput/AsyncSelectInput';
import TextInput from '../../../../components/FormInputs/TextInput/TextInput';
import { CustomModal, ModalBody, ModalFooter, ModalHeader } from '../../../../components/Modal/Modal';
import { fetchRequest } from '../../../../utils/api';
import { rupeeSymbol } from '../../../../utils/constants';

const defaultState = {
  title: '',
  confirmAction: '',
  method: '',
  url: '',
  handleSuccess: '',
  isModalOpen: false,
  isEdit: false,
  uuid: null,
  params: {},
};

const formDefaultState = {
  test: '',
  cost: '',
};

const AddTestInSetModal = ({ actionObject = defaultState }) => {
  const { title, confirmAction, isModalOpen } = actionObject;
  const [modal, handleModalToggle] = useState(isModalOpen);
  const [initials, setInitials] = useState({ ...formDefaultState });
  const [errors, setErrors] = useState({});
  const [tests, setTests] = useState([]);

  useEffect(() => {
    handleModalToggle(isModalOpen);
    getTests();
    actionObject.isEdit && getSingleTest();
  }, [actionObject]); // eslint-disable-line react-hooks/exhaustive-deps

  const getTests = useCallback(
    async search => {
      let url = null;
      if (actionObject.params.type === 'lab-group') {
        url = `/lab_group/${actionObject.params.labId}/test_master`;
      } else {
        url = `/lab/${actionObject.params.branchId}/test_master`;
      }
      if (url) {
        const res = await fetchRequest({
          url: `${url}${search ? `?search=${search}` : ''}`,
          method: 'GET',
          isAuth: true,
        });
        if (res && res.status === 200) {
          const { data } = await res.json();
          const tests = data && data.length && [...data].map(test => ({ label: test.name, value: test.uuid }));
          setTests(tests);
          return tests;
        }
      }
    },
    [actionObject],
  );

  const getSingleTest = async () => {
    if (actionObject.url) {
      const res = await fetchRequest({ url: actionObject.url, method: 'GET', isAuth: true });
      if (res && res.status === 200) {
        const { data } = await res.json();
        setInitials({ test: { label: data.test.name, value: data.test.uuid }, cost: data.cost });
        return data;
      }
    }
  };

  const onHandleChange = (value, key) => {
    let obj = { ...initials };
    obj[key] = value;
    setInitials({ ...obj });
  };

  const handleConfirmAction = async e => {
    e.preventDefault();
    setErrors({})
    if (actionObject.url) {
      let body = { cost: initials.cost };
      if (!actionObject.isEdit) {
        body = { ...body, test_id: initials.test && initials.test.value };
      }

      const res = await fetchRequest({ url: actionObject.url, method: actionObject.method, isAuth: true, body: body });
      if (res && res.status === 200) {
        const data = await res.json();
        if (data.success) {
          handleModalToggle(false);
          setInitials({ ...formDefaultState });
          actionObject.handleSuccess({});
          data.message && actionObject.setNotification({ show: true, message: data.message, type: 'success' });
        }
      } else {
        const errObj = await res.json();
        setErrors({ ...errObj.errors });
        res.status !== 422 &&
          !Object.keys(errObj.error ? errObj.error : {}).length &&
          errObj.message &&
          actionObject.setNotification({ show: true, message: errObj.message, type: 'error' });
      }
      return;
    }
  };

  const { test, cost } = initials;
  return (
    <CustomModal className="add-details-modal add-test-in-set-modal" modalIsOpen={modal} closeModal={handleModalToggle}>
      <ModalHeader className="text-center">
        <p className="semi-bold">{title}</p>
      </ModalHeader>
      <ModalBody className="mb-2">
        <form className="add-details-form pl-2 pr-4" onSubmit={handleConfirmAction}>
          <div className="form-group mb-3">
            {!actionObject.isEdit && (
              <AsyncSelectInput
                placeholder="Select Test / Test Package"
                options={tests}
                FilterData={getTests}
                noOptionsMessage="Search & Select Tests"
                value={test}
                onChange={value => onHandleChange(value, 'test')}
                error={errors && errors['test_id']}
              />
            )}
          </div>
          {(test || actionObject.isEdit) && (
            <>
              <div className="divider"></div>
              <div className="d-flex justify-content-between align-items-baseline selected-test">
                <p>{test.label}</p>
                <div className="cost-input">
                  <div className="d-flex align-items-baseline">
                    <p className="mr-2">{rupeeSymbol}</p>
                    <TextInput value={cost} onChange={e => onHandleChange(e.target.value, 'cost')} error={errors && errors['cost']} />
                  </div>
                </div>
              </div>
              <div className="divider"></div>
            </>
          )}
        </form>
      </ModalBody>
      <ModalFooter className="justify-content-center">
        <OutlinedButton
          onClick={() => {
            handleModalToggle(false);
            setInitials({ ...formDefaultState });
            setErrors({});
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

export default AddTestInSetModal;
