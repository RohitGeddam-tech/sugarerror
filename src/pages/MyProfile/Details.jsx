import React, { useContext, useState } from 'react';
import { CloseDark, DoneIconWhite, Edit } from '../../assets/icons';
import { ContainedButton, OutlinedButton, TextButton } from '../../components/Buttons/Button';
import { ProfileContext } from '../../context/context';
import { fetchRequest } from '../../utils/api';
import {Edit as EditIcon} from "../../assets/icons";

function Details({ label, value, form, api, dataToSave, setErrors, setNotification, noEdit, id, isEdit, setEdit }) {
  const { profile, setProfileData } = useContext(ProfileContext);
  // const [isEdit, setEdit] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const handleSubmit = async e => {
    setErrors({});
    setBtnLoading(true);
    setNotification({ show: false, message: '', type: '' });
    e.preventDefault();
    const res = await fetchRequest({ url: api, method: 'PUT', isAuth: true, body: dataToSave });
    setBtnLoading(false);
    if (res && res.status === 200) {
      const data = await res.json();
      if (data.success) {
        data.message && setNotification({ show: true, message: data.message, type: 'success' });
        localStorage.setItem('first_name', data.data ? data.data.first_name : profile.selectedRole.first_name);
        localStorage.setItem('last_name', data.data ? data.data.last_name : profile.selectedRole.last_name);
        setProfileData({
          ...profile,
          data: { ...(data.data ?? profile.data) },
          ...dataToSave,
          selectedRole: {
            ...profile.selectedRole,
            first_name: data.data ? data.data.first_name : profile.selectedRole.first_name,
            last_name: data.data ? data.data.last_name : profile.selectedRole.last_name,
          },
        });
        setEdit({});
      }
    } else {
      const errObj = await res.json();
      setErrors({ ...errObj.errors });
      res.status !== 422 &&
        !Object.keys(errObj.error ? errObj.error : {}).length &&
        errObj.message &&
        setNotification({ show: true, message: errObj.message, type: 'error' });
    }
    return;
  };

  return (
    <>
      {!isEdit[id] ? (
        <>
          <div className="row profile-details on-mobile-hide">
            <div className="col-4">
              <label className="label">{label}</label>
            </div>
            <div className="col-6">
              <label>{value}</label>
            </div>
            <div className="col-2">
              <TextButton
                blue
                onClick={() => {
                  let x = {};
                  x[id] = true;
                  setEdit(x);
                }}
              >
                EDIT
              </TextButton>
            </div>
          </div>
          <div className="d-flex justify-content-between profile-details on-desktop-hide">
            <div className="d-flex flex-column">
              <label className="label">{label}</label>
              <label>{value}</label>
            </div>
            <TextButton
              blue
              onClick={() => {
                let x = {};
                x[id] = true;
                setEdit(x);
              }}
              className="edit-icon"
            >
              <div className="d-flex flex-column">
                <p>{EditIcon}</p>
                EDIT
              </div>
            </TextButton>
          </div>
        </>
      ) : (
        <div className="profile-details-form mt-3">
          <label className="label pb-2">{label}</label>
          {form}
          {!noEdit && (
            <div className="profile-card-btns d-flex justify-content-end">
              <OutlinedButton black className="mr-2" onClick={() => setEdit({}) || setProfileData({ ...profile })}>
                <div className="d-flex align-items-center">
                  <p className="icon">{CloseDark}</p>
                  Cancel
                </div>
              </OutlinedButton>
              <ContainedButton lightBlue color="primary" withIcon onClick={e => handleSubmit(e)} disabled={btnLoading} loading={btnLoading}>
                <div className="d-flex align-items-center">
                  <p className="icon">{DoneIconWhite}</p>
                  Save
                </div>
              </ContainedButton>
            </div>
          )}
        </div>
      )}
      <div className="divider"></div>
    </>
  );
}
export default Details;
