import React from 'react';
import { ContainedButton } from '../Buttons/Button';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
const ModalHeader = ({ children = "", className = '', closeBtn = false, closeModal }) => (
  <div className={`modal-header ${className}`}>
    {children}
    {closeBtn && (
      <ContainedButton className="close-modal-btn" onClick={() => closeModal(false)}>
        <span className="cross-icon"></span>
      </ContainedButton>
    )}
  </div>
);

const ModalBody = ({ children, className = '' }) => <div className={`modal-body ${className}`}>{children}</div>;

const ModalFooter = ({ children, className = '' }) => <div className={`modal-footer ${className}`}>{children}</div>;

const CustomModal = ({ children, className = '', modalIsOpen, afterOpenModal, closeModal, backdropClose }) => {
  return (
    <Modal
      isOpen={modalIsOpen}
      onAfterOpen={afterOpenModal}
      onRequestClose={() => backdropClose && closeModal(false)}
      shouldCloseOnOverlayClick={true}
      style={customStyles}
      contentLabel="Example Modal"
      className={className}
      ariaHideApp={false}
    >
      {children}
    </Modal>
  );
};

export { CustomModal, ModalHeader, ModalBody, ModalFooter };
