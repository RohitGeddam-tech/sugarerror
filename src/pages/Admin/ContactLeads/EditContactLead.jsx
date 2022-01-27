import React, { useEffect, useState } from 'react';
import { ContainedButton, OutlinedButton } from '../../../components/Buttons/Button';
import SelectInput from '../../../components/FormInputs/SelectInput/SelectInput';
import Textarea from '../../../components/FormInputs/Textarea/Textarea';
import Notification from '../../../components/Notification/Notification';
import { fetchRequest } from '../../../utils/api';

const EditContactLead = props => {
  const [leadDetails, setLeadDetails] = useState(null);
  const [leadId, setLeadId] = useState();
  const [contactStatuses, setContactStatuses] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { leadId } = props.location.state ? props.location.state : {};
    if (leadId) {
      getContactStatuses(leadId);
      setLeadId(leadId);
    }
  }, [props.location.state]);

  useEffect(() => {
    contactStatuses && contactStatuses.length && getLeadDetails(leadId);
  }, [contactStatuses, leadId]); // eslint-disable-line react-hooks/exhaustive-deps

  const getLeadDetails = id => {
    setLoading(true);
    (async () => {
      const res = await fetchRequest({ url: `/super_admin/contact_lead/${id}`, method: 'GET', isAuth: true });
      setLoading(false);
      if (res && res.status === 200) {
        const data = await res.json();
        const tempData = { ...data.data };
        tempData.status = contactStatuses.find(status => status.value === tempData.status);
        setLeadDetails(tempData);
        return data;
      }
      return;
    })();
  };

  const getContactStatuses = async leadId => {
    const res = await fetchRequest({ url: '/super_admin/contact_statuses', method: 'GET', isAuth: true });
    if (res && res.status === 200) {
      const { data } = await res.json();
      const newData = data && data.length && [...data].map(status => ({ label: status.formatted_status, value: status.status }));
      setContactStatuses(newData);
      return data;
    }
    return;
  };

  const handleChange = (value, key) => {
    let data = { ...leadDetails };
    data[key] = value;
    setLeadDetails({ ...data });
  };

  const handleUpdateLead = async () => {
    setErrors({});
    setNotification({ show: false, message: '', type: '' });
    let body = {
      // status: leadDetails.status ? { formatted_status: leadDetails.status.label, status: leadDetails.status.value } : null,
      status: leadDetails.status && leadDetails.status.value,
      note: leadDetails.note || '',
    };

    const res = await fetchRequest({ url: `/super_admin/contact_lead/${leadId}`, method: 'PUT', isAuth: true, body });
    if (res && res.status === 200) {
      const data = await res.json();
      if (data.success) {
        data.message &&
          setNotification({
            show: true,
            message: data.message,
            type: 'success',
          });
        setTimeout(() => props.history.push(`/${localStorage.getItem('loginAs')}/contact-leads`), 2000);
      }
    } else {
      const errObj = await res.json();
      setErrors({ ...errObj.errors });
      res.status !== 422 &&
        !Object.keys(errObj.error ? errObj.error : {}).length &&
        errObj.message &&
        setNotification({ show: true, message: errObj.message, type: 'error' });
    }
  };

  const handleCancel = () => {
    getLeadDetails(leadId);
    props.history.push(`/${localStorage.getItem('loginAs')}/contact-leads`);
  };

  return loading ? (
    <div className="spinner-border" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  ) : leadDetails ? (
    <div className="form-content">
      <Notification {...notification} />
      <div className="edit-lead-container">
        <div className="paper card ">
          <div className={`content-header d-flex align-items-baseline justify-content-between`}>
            <p className="semi-bold title">Lead Details</p>
          </div>
          <div className="edit-user-data-card pl-2">
            <div className="d-flex card-row mb-2">
              <div className="semi-bold label">Date : </div>
              <div className="value">{leadDetails.created_at || '-'}</div>
            </div>
            <div className="d-flex card-row mb-2">
              <div className="semi-bold label">Name : </div>
              <div className="value">{leadDetails.name || '-'}</div>
            </div>
            <div className="d-flex card-row mb-2">
              <div className="semi-bold label">Mobile No. : </div>
              <div className="value">{leadDetails.mobile || '-'}</div>
            </div>
            <div className="d-flex card-row mb-2">
              <div className="semi-bold label">Email : </div>
              <div className="value">{leadDetails.email || '-'}</div>
            </div>
            <div className="d-flex card-row mb-2">
              <div className="semi-bold label">Type : </div>
              <div className="value">{leadDetails.type || '-'}</div>
            </div>
            <div className="d-flex card-row mb-3">
              <div className="semi-bold label">Description : </div>
              <div className="value">{leadDetails.description || '-'}</div>
            </div>
            <div className="d-flex mb-4 row">
              <div className="col-sm-2 semi-bold label text-right">Status : </div>
              <div className="col-sm-5 pl-0">
                <SelectInput
                  options={contactStatuses}
                  value={leadDetails.status || null}
                  onChange={value => handleChange(value, 'status')}
                  error={errors && errors['status']}
                ></SelectInput>
              </div>
            </div>
            <div className="d-flex card-row mb-4">
              <div className="semi-bold label">Attended by : </div>
              <div className="value">
                {leadDetails.attended_user
                  ? (leadDetails.attended_user.first_name || '-') + ' ' + (leadDetails.attended_user.last_name || '-')
                  : '--'}
              </div>
            </div>
            <div className="d-flex mb-4 row">
              <div className="col-sm-2 semi-bold label text-right">Note : </div>
              <div className="col-sm-8 pl-0">
                <Textarea
                  rows={1}
                  value={leadDetails.note || ''}
                  onChange={e => handleChange(e.target.value, 'note')}
                  error={errors && errors['note']}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mb-4 text-center">
          <OutlinedButton red className="mr-2" onClick={handleCancel}>
            Cancel
          </OutlinedButton>
          <ContainedButton lightBlue onClick={handleUpdateLead}>
            Save
          </ContainedButton>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default EditContactLead;
