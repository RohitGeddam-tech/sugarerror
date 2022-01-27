import React, { useState, useEffect, useMemo } from 'react';
import { ContainedButton, OutlinedButton } from '../../../../components/Buttons/Button';
import TextInput from '../../../../components/FormInputs/TextInput/TextInput';
import { CustomModal, ModalBody, ModalFooter } from '../../../../components/Modal/Modal';
import { fetchRequest } from '../../../../utils/api';

const defaultState = {
  title: '',
  confirmAction: '',
  method: '',
  url: '',
  handleSuccess: '',
  isModalOpen: false,
  isEdit: false,
  setNotification: '',
  uuid: null,
};
const formDefaultState = {
  total_balance: '',
  total_paid: '',
  total_payable: '',
  received_amount: '',
};

const EditAmountModal = ({ actionObject = defaultState }) => {
  const { confirmAction, isModalOpen } = actionObject;
  const [modal, handleModalToggle] = useState(isModalOpen);
  const [initials, setInitials] = useState({ ...formDefaultState });
  const [error, setError] = useState({});

  useEffect(() => {
    handleModalToggle(isModalOpen);
    actionObject.data && actionObject.data && setInitials(actionObject.data);
  }, [actionObject, isModalOpen]);

  const handleConfirmAction = async e => {
    e.preventDefault();
    setError({});
    actionObject.setNotification({ show: false, message: '', type: '' });
    const res = await fetchRequest({
      url: actionObject.url,
      method: actionObject.method,
      isAuth: true,
      body: { received_amount: initials.received_amount && initials.received_amount !== '' ? initials.received_amount : 0 },
    });
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

  const handleEditAmountChange = e => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      e.target.value >= 0 && e.target.value <= parseInt(total_balance) && setInitials({ ...initials, received_amount: e.target.value });
    }
  };

  const { total_balance, received_amount = 0 } = initials;
  let amtPayable = useMemo(() => parseInt(total_balance) - (received_amount || 0), [received_amount, total_balance]);
  return (
    <CustomModal className=" modal-medium" modalIsOpen={modal} closeModal={handleModalToggle}>
      <form className="add-details-form pl-2 pr-4 pt-3" onSubmit={handleConfirmAction}>
        <ModalBody>
          <div className="row">
            <div className="col-7">
              <label>Current Pending Fees :</label>
            </div>
            <div className="col-5">
              <span>{`₹ ${total_balance}`}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-7">
              <label>(-) Amount Received :</label>
            </div>
            <div className="col-5">
              <div className="form-group d-flex align-items-center">
                <span className="mr-2">₹ </span>
                <TextInput
                  type="text"
                  value={received_amount}
                  onChange={handleEditAmountChange}
                  error={error && error['received_amount']}
                />
              </div>
            </div>
          </div>
          <div className="divider"></div>
          <div className="row bold">
            <div className="col-7">
              <label>Net amount payable :</label>
            </div>
            <div className="col-5">
              <span>{`₹ ${amtPayable}`}</span>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="justify-content-center">
          <OutlinedButton
            onClick={() => {
              handleModalToggle(false);
              setInitials({ ...formDefaultState });
              setError({});
            }}
            red
          >
            Cancel
          </OutlinedButton>
          <ContainedButton type="submit" lightBlue>
            {confirmAction}
          </ContainedButton>
        </ModalFooter>
      </form>
    </CustomModal>
  );
};

export default EditAmountModal;
