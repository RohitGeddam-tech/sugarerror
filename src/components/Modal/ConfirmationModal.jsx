import React, { useState, useEffect } from 'react';
import { ContainedButton, OutlinedButton } from '../Buttons/Button';
import { CustomModal, ModalHeader, ModalBody, ModalFooter } from './Modal';
import { fetchRequest } from '../../utils/api';

const defaultState = {
  title: '',
  msg: '',
  cancelAction: '',
  confirmAction: '',
  method: '',
  data: null,
  url: '',
  handleSuccess: '',
  isModalOpen: false,
  isThankYouModal: false,
};

const ConfirmationModal = ({ actionObject = defaultState }) => {
  const {
    title,
    msg,
    cancelAction,
    confirmAction,
    method,
    data,
    url,
    handleSuccess,
    isModalOpen,
    redirect,
    history,
    setNotification,
    isThankYouModal,
  } = actionObject;
  const [modal, handleModalToggle] = useState(isModalOpen);

  useEffect(() => {
    handleModalToggle(isModalOpen);
  }, [actionObject, isModalOpen]);

  const handleConfirmAction = async () => {
    if (redirect) {
      history.push(redirect);
      return;
    }
    const res = await fetchRequest({ url, method, isAuth: true, body: data });
    if (res && res.status === 200) {
      const data = await res.json();
      if (data.success) {
        handleModalToggle(false);
        handleSuccess(data);
      }
    } else {
      const errObj = await res.json();
      setNotification && setNotification({ show: false, message: '', type: '' });
      res.status !== 422 &&
        !Object.keys(errObj.error ? errObj.error : {}).length &&
        errObj.message &&
        setNotification && setNotification({ show: true, message: errObj.message, type: 'error' });
      handleModalToggle(false);
    }
    return;
  };

  let confirmActionType = method === 'DELETE' ? 'red' : 'black';

  return (
    <CustomModal className="confirmation-modal" modalIsOpen={modal} closeModal={handleModalToggle}>
      <ModalHeader className="justify-content-center">
        <h2 className="black-heading">{title}</h2>
      </ModalHeader>
      <ModalBody className="mb-4 text-center">
        <p>{msg}</p>
      </ModalBody>
      <ModalFooter className="justify-content-center">
        {isThankYouModal ? (
          <ContainedButton red onClick={() => handleModalToggle(false)}>
            {cancelAction}
          </ContainedButton>
        ) : (
          <OutlinedButton className="close-modal-btn mr-2" onClick={() => handleModalToggle(false)}>
            {cancelAction}
          </OutlinedButton>
        )}
        {confirmAction && (
          <ContainedButton onClick={handleConfirmAction} {...{ [confirmActionType]: true }}>
            {confirmAction}
          </ContainedButton>
        )}
      </ModalFooter>
    </CustomModal>
  );
};

export default ConfirmationModal;
