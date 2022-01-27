import React, { useState, useEffect } from 'react';
import { rupeeSymbol } from '../../utils/constants';
import Card from '../Common/Card/Card';
import { CustomModal, ModalBody } from './Modal';

const defaultState = {
  data: null,
  isModalOpen: false,
};

const TableCardModal = ({ actionObject = defaultState, MobileCardComponent }) => {
  const { columnDefs, tableData, isModalOpen } = actionObject;

  const [modal, handleModalToggle] = useState(isModalOpen);

  useEffect(() => {
    handleModalToggle(isModalOpen);
  }, [actionObject, isModalOpen]);

  return (
    <CustomModal className="table-card-modal" modalIsOpen={modal} closeModal={handleModalToggle} backdropClose={true}>
      <ModalBody className="my-4 text-center">
        {MobileCardComponent ? (
          <MobileCardComponent columnDefs={columnDefs} tableData={tableData}/>
        ) : (
          <Card title="Test Visit Details">
            {columnDefs &&
              columnDefs.length &&
              columnDefs.map(({ label, accessKey, renderIcon, classes = '',cellRenderer,defaultValue,isAmount = false, }, ind) => {
                let keys = accessKey ? accessKey.split('.') || [] : null,
                        dataValue = Array.isArray(keys) ? (keys.length > 1 ? tableData[`${keys[0]}`][`${keys[1]}`] : tableData[`${keys[0]}`]) : null;
                return (
                <React.Fragment key={ind}>
                  {!renderIcon && (
                    <div className="d-flex card-row">
                      <div className="label">{`${label} : `}</div>
                      {cellRenderer ? (
                        <div className={`value ${classes}`}>{cellRenderer(tableData, ind)}</div>
                      ) : dataValue || defaultValue ? (
                        <div className={`value ${classes}`}>
                          {isAmount ? rupeeSymbol + ' ' : ''}
                          {dataValue || defaultValue}
                        </div>
                      ) : null}
                    </div>
                  )}
                </React.Fragment>
              )})}
          </Card>
        )}
      </ModalBody>
    </CustomModal>
  );
};

export default TableCardModal;
