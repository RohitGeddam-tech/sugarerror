import React, { useEffect, useState } from 'react';
import SelectInput from '../../../../components/FormInputs/SelectInput/SelectInput';
import Textarea from '../../../../components/FormInputs/Textarea/Textarea';
import { OutlinedButton, ContainedButton } from '../../../../components/Buttons/Button';
import TextInput from '../../../../components/FormInputs/TextInput/TextInput';

const paymentTypes = [
  { value: 'cash', label: 'Cash' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'payment_gateway', label: 'Payment Gateway' },
];

const PaymentDetails = ({ data, setData, handleSavePathLab, error, handleCancel, btnDisabled, btnLoading,saveBtnName }) => {
  const [paymentType, setPaymentType] = useState({ value: 'cash', label: 'Cash' });
  const [initials, setInitials] = useState({});

  useEffect(() => {
    setInitials({ ...data });
  }, [data]);

  useEffect(() => {
    setData({ ...data, payment_mode: paymentType.value });
  }, [paymentType]); // eslint-disable-line react-hooks/exhaustive-deps

  const onHandleChange = (value, key) => {
    let obj = { ...initials };
    obj[key] = value;
    setInitials({ ...obj });
    setData({ ...obj });
  };

  const { received_from, bank_name, cheque_number, notes } = initials;

  return (
    <div className="form-content">
      <div className="paper">
        <label className="paper-label">Payment Details</label>
        <div className="row mb-4">
          <div className="col-md-5">
            <SelectInput placeholder="Payment Type" options={paymentTypes} value={paymentType} onChange={data => setPaymentType(data)} />
          </div>
        </div>
        {(paymentType.value === 'cash' || paymentType.value === 'cheque') && (
          <div className="row mb-4">
            <div className="col-md-6">
              <TextInput
                placeholder="Received From*"
                value={received_from || ''}
                onChange={e => onHandleChange(e.target.value, 'received_from')}
                error={error && error['payment_details.received_from']}
              />
            </div>
          </div>
        )}
        {paymentType.value === 'cheque' && (
          <div className="row mb-4">
            <div className="col-md-6">
              <TextInput
                placeholder="Bank Name*"
                value={bank_name || ''}
                onChange={e => onHandleChange(e.target.value, 'bank_name')}
                error={error && error['payment_details.bank_name']}
              />
            </div>
            <div className="col-md-6">
              <TextInput
                placeholder="Cheque No.*"
                value={cheque_number || ''}
                onChange={e => onHandleChange(e.target.value, 'cheque_number')}
                error={error && error['payment_details.cheque_number']}
              />
            </div>
          </div>
        )}
        <div className="row mb-4">
          <div className="col-md-12 col-12">
            <Textarea
              placeholder="Note"
              value={notes || ''}
              onChange={e => onHandleChange(e.target.value, 'notes')}
              error={error && error['payment_details.notes']}
            />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-md-12">
            <OutlinedButton red className="mr-2" onClick={handleCancel} disabled={btnDisabled}>
              Cancel
            </OutlinedButton>
            <ContainedButton lightBlue color="primary" withIcon onClick={handleSavePathLab} disabled={btnDisabled} loading={btnLoading}>
              {saveBtnName || "Register Lab"}
            </ContainedButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
