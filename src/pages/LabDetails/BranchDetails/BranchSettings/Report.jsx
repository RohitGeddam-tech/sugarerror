import React, { useState, useContext, useEffect, useCallback } from 'react';
import Card from '../../../../components/Common/Card/Card';
import { reportDefaultLogo } from '../../../../assets';
import UploadImage from '../../../../components/Common/UploadImage/UploadImage';
import TextInput from '../../../../components/FormInputs/TextInput/TextInput';
import { fetchRequest } from '../../../../utils/api';
import { ProfileContext } from '../../../../context/context';
import Notification from '../../../../components/Notification/Notification';
import { useParams } from 'react-router-dom';
import Loader from '../../../../components/Loader/Loader';

const defaultState = {
  letterhead_type: 'default',
  logo: { imagePreviewUrl: reportDefaultLogo },
  letterhead: {},
  footer: {},
  print_letterhead: false,
  techniciansSign: { technician_name: '', technician_degree: '', print_technician_sign: false },
  doctorsSign: { doctor_name: '', doctor_degree: '', print_doctor_sign: false },
};

const Report = () => {
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);
  const { branchId } = useParams();
  const [initials, setInitials] = useState({ ...defaultState });
  const [error, setError] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(true);

  const getBranchDetails = useCallback(() => {
    let url = null;
    if (profile && loginAs === 'lab') {
      url = `/lab/${profile.selectedRole.uuid}`;
    } else if (loginAs === 'lab-admin' && branchId) {
      url = `/lab_group/${profile.selectedRole.uuid}/lab/${branchId}`;
    }
    if (url)
      (async () => {
        setLoading(true);
        const res = await fetchRequest({ url, method: 'GET', isAuth: true });
        res && setLoading(false);
        if (res && res.status === 200) {
          const { data } = await res.json();
          const {
            technician_name,
            technician_degree,
            print_technician_sign,
            technician_sign,
            doctor_name,
            doctor_degree,
            doctor_sign,
            print_doctor_sign,
            logo,
            footer,
            print_letterhead,
            letterhead,
            letterhead_type,
            email
          } = data;
          setInitials({
            ...initials,
            ...data,
            logo: { imgPath: logo },
            footer: { imgPath: footer },
            letterhead: { imgPath: letterhead },
            print_letterhead: !print_letterhead,
            letterhead_type,
            techniciansSign: {
              technician_name,
              technician_degree,
              print_technician_sign: !print_technician_sign,
              imgPath: technician_sign,
            },
            doctorsSign: { imgPath: doctor_sign, doctor_name, doctor_degree, print_doctor_sign: !print_doctor_sign },
            email
          });
          return data;
        }
        return;
      })();
  }, [profile, loginAs, branchId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getBranchDetails();
  }, [getBranchDetails]);

  const handleChange = (obj, type) => {
    let data = { ...initials };
    data[type] = { ...data[type], ...obj };
    setInitials({ ...data });
  };

  const handleTechnicianSubmit = ({ image, checked, remove }) => {
    setError({});
    setNotification({ show: false, message: '', type: '' });
    let formData = new FormData();
    formData.append('technician_name', techniciansSign.technician_name || '');
    formData.append('technician_degree', techniciansSign.technician_degree || '');
    remove && formData.append('delete_sign', true);
    formData.append('technician_sign', image.file ? image.file : '');
    formData.append('print_technician_sign', !checked);
    (async () => {
      let url = null;
      if (profile && loginAs === 'lab') {
        url = `/lab/${profile.selectedRole.uuid}/report_setup_technician`;
      } else if (loginAs === 'lab-admin') {
        url = `/lab/${branchId}/report_setup_technician`;
      }

      const res = await fetchRequest({
        url,
        method: 'POST',
        body: formData,
        isAuth: true,
        isFormData: true,
      });
      if (res && res.status === 200) {
        const { data, message } = await res.json();
        message && setNotification({ show: true, message: message, type: 'success' });
        const { technician_name, technician_degree, print_technician_sign, technician_sign } = data;
        setInitials({
          ...initials,
          techniciansSign: { technician_name, technician_degree, print_technician_sign: print_technician_sign, imgPath: technician_sign },
        });
      } else {
        const errObj = await res.json();
        setError({ ...error, ...errObj.errors });
        res.status !== 422 &&
          !Object.keys(errObj.error ? errObj.error : {}).length &&
          errObj.message &&
          setNotification({ show: true, message: errObj.message, type: 'error' });
      }
      return;
    })();
  };

  const handleDoctorSubmit = ({ image, checked }) => {
    setError({});
    setNotification({ show: false, message: '', type: '' });
    let formData = new FormData();
    formData.append('doctor_name', doctorsSign.doctor_name || '');
    formData.append('doctor_degree', doctorsSign.doctor_degree || '');
    formData.append('doctor_sign', image.file ? image.file : '');
    formData.append('print_doctor_sign', !checked);
    (async () => {
      let url = null;
      if (profile && loginAs === 'lab') {
        url = `/lab/${profile.selectedRole.uuid}/report_setup_doctor`;
      } else if (loginAs === 'lab-admin') {
        url = `/lab/${branchId}/report_setup_doctor`;
      }
      const res = await fetchRequest({
        url,
        method: 'POST',
        body: formData,
        isAuth: true,
        isFormData: true,
      });
      if (res && res.status === 200) {
        const { data, message } = await res.json();
        message && setNotification({ show: true, message: message, type: 'success' });
        const { doctor_name, doctor_degree, doctor_sign, print_doctor_sign } = data;
        setInitials({
          ...initials,
          doctorsSign: { imgPath: doctor_sign, doctor_name, doctor_degree, print_doctor_sign: print_doctor_sign },
        });
      } else {
        const errObj = await res.json();
        setError({ ...error, ...errObj.errors });
        res.status !== 422 &&
          !Object.keys(errObj.error ? errObj.error : {}).length &&
          errObj.message &&
          setNotification({ show: true, message: errObj.message, type: 'error' });
      }
      return;
    })();
  };

  const handleLetterheadSubmit = ({ image, checked, remove }) => {
    setError({});
    setNotification({ show: false, message: '', type: '' });
    let formData = new FormData();
    formData.append('letterhead_type', letterhead_type);
    if (letterhead_type === 'default') {
      remove && formData.append('delete_logo', true);
      formData.append('logo', image.file ? image.file : '');
    } else if (letterhead_type === 'custom') {
      remove && formData.append('delete_footer', true);
      formData.append('letterhead', letterhead.file ? letterhead.file : '');
      formData.append('footer', footer.file ? footer.file : '');
      formData.append('print_letterhead', !checked);
    }
    (async () => {
      let url = null;
      if (profile && loginAs === 'lab') {
        url = `/lab/${profile.selectedRole.uuid}/report_setup_letterhead`;
      } else if (loginAs === 'lab-admin') {
        url = `/lab/${branchId}/report_setup_letterhead`;
      }
      const res = await fetchRequest({
        url,
        method: 'POST',
        body: formData,
        isAuth: true,
        isFormData: true,
      });
      if (res && res.status === 200) {
        const { data, message } = await res.json();
        message && setNotification({ show: true, message: message, type: 'success' });
        const { logo, footer, print_letterhead, letterhead } = data;
        setInitials({
          ...initials,
          logo: { imgPath: logo },
          footer: { imgPath: footer },
          letterhead: { imgPath: letterhead },
          print_letterhead: !print_letterhead,
        });
      } else {
        const errObj = await res.json();
        setError({ ...error, ...errObj.errors });
        res.status !== 422 &&
          !Object.keys(errObj.error ? errObj.error : {}).length &&
          errObj.message &&
          setNotification({ show: true, message: errObj.message, type: 'error' });
      }
      return;
    })();
  };

  const {
    letterhead_type,
    letterhead,
    footer,
    logo,
    techniciansSign,
    doctorsSign,
    print_letterhead,
    formatted_lab_name,
    address_line_one,
    address_line_two,
    city,
    state,
    pincode,
    mobile,
    email
  } = initials;
  return (
    <>
      <Loader loading={loading} />
      {!loading && (
        <div className="report-container w-100">
          <Notification {...notification} />
          <div className="row">
            <div className="col-md-6 mr-auto">
              <Card className="report-main">
                {letterhead_type === 'custom' ? (
                  <div className="report-header-custom">
                    {(letterhead.imagePreviewUrl ? letterhead.imagePreviewUrl : letterhead.imgPath) ? (
                      <img src={letterhead.imagePreviewUrl ? letterhead.imagePreviewUrl : letterhead.imgPath} alt="Header Banner" />
                    ) : (
                      <div className="empty-header"></div>
                    )}
                  </div>
                ) : letterhead_type === 'default' ? (
                  <div className="d-flex justify-content-between report-header">
                    {(logo.imagePreviewUrl ? logo.imagePreviewUrl : logo.imgPath) ? (
                      <img src={logo.imagePreviewUrl ? logo.imagePreviewUrl : logo.imgPath} className="report-logo" alt="Logo" />
                    ) : (
                      <div className="report-logo"></div>
                    )}
                    <div className="lab-details">
                      <div className="name">
                        <p>{formatted_lab_name ? formatted_lab_name : '-'}</p>
                      </div>
                      <div className="address">
                        <address>
                          {address_line_one ? `${address_line_one}, ` : ''}
                          <br /> {address_line_two ? `${address_line_two},` : ''} <br />
                          {city || state || pincode ? `${city}, ${state}, ${pincode}` : ''}
                        </address>
                      </div>
                      <div className="other-details">
                        <p>{mobile ? mobile : '-'} | {email || '-'}</p>
                        {/* <p>GSTIC No.:0000000000000000</p> */}
                      </div>
                    </div>
                  </div>
                ) : null}
                <div className="report-content">
                  <div className="watermark">REPORT</div>
                </div>
                <div className="signature">
                  <div className="d-flex justify-content-between">
                    <div className="sign-1">
                      {techniciansSign.imagePreviewUrl || techniciansSign.imgPath ? (
                        <img
                          src={techniciansSign.imagePreviewUrl ? techniciansSign.imagePreviewUrl : techniciansSign.imgPath}
                          className="signature-img"
                          alt="Signature"
                        />
                      ) : (
                        <div className="signature-img" />
                      )}
                      <p className="name">{techniciansSign.technician_name ? techniciansSign.technician_name : ''}</p>
                      <p className="qualification">{techniciansSign.technician_degree ? techniciansSign.technician_degree : ''}</p>
                    </div>
                    <div className="sign-2">
                      {doctorsSign.imagePreviewUrl || doctorsSign.imgPath ? (
                        <img
                          src={doctorsSign.imagePreviewUrl ? doctorsSign.imagePreviewUrl : doctorsSign.imgPath}
                          className="signature-img"
                          alt="Signature"
                        />
                      ) : (
                        <div className="signature-img" />
                      )}
                      <p className="name">{doctorsSign.doctor_name ? doctorsSign.doctor_name : ''}</p>
                      <p className="qualification">{doctorsSign.doctor_degree ? doctorsSign.doctor_degree : ''}</p>
                    </div>
                  </div>
                </div>
                <div className="report-footer">
                  {letterhead_type === 'custom' && footer && (footer.imagePreviewUrl || footer.imgPath) ? (
                    <img src={footer.imagePreviewUrl ? footer.imagePreviewUrl : footer.imgPath} className="report-footer-image" alt="Footer Logo" />
                  ) : (
                    <div className="d-flex note">
                    </div>
                  )}
                </div>
              </Card>
            </div>
            <div className="col-md-5">
              <Card title="Report Letterhead">
                <div className="report-letter-head">
                  <div className="d-flex align-items-center ml-3">
                    <input
                      type="radio"
                      id="default"
                      name="letterhead"
                      checked={letterhead_type === 'default'}
                      value={letterhead_type}
                      onChange={() => setInitials({ ...initials, letterhead_type: 'default' })}
                    />
                    <p className="pl-2 report-letter-head-checkbox">Use Sugarlogger default letter head & footer</p>
                  </div>
                  <div className="d-flex align-items-center ml-3">
                    <input
                      type="radio"
                      id="custom"
                      name="letterhead"
                      checked={letterhead_type === 'custom'}
                      value={letterhead_type}
                      onChange={() => setInitials({ ...initials, letterhead_type: 'custom' })}
                    />
                    <p className="pl-2 report-letter-head-checkbox">Use custom letter head & footer</p>
                  </div>
                  {letterhead_type === 'default' && (
                    <UploadImage
                      label="Upload a logo image :"
                      imageObj={logo}
                      onChange={obj => handleChange(obj, 'logo')}
                      showRemoveBtn
                      showSaveChangeBtn
                      handleSubmit={handleLetterheadSubmit}
                      error={error && error['logo']}
                      imgClass="h-auto"
                      emptyText="Logo"
                    />
                  )}
                  {letterhead_type === 'custom' && (
                    <>
                      <UploadImage
                        label="Letter Head :"
                        imageObj={letterhead}
                        onChange={obj => handleChange(obj, 'letterhead')}
                        error={error && error['letterhead']}
                        emptyText="Letter Head"
                      />
                      <UploadImage
                        label="Footer (Optional):"
                        showRemoveBtn
                        showSaveChangeBtn
                        imageObj={footer}
                        onChange={obj => handleChange(obj, 'footer')}
                        handleSubmit={handleLetterheadSubmit}
                        deleteImage={() => handleChange(true, 'delete_footer')}
                        checkboxObj={{
                          show: true,
                          label: 'Hide Letterhead and footer on Print',
                          key: 'print_letterhead',
                          checked: print_letterhead,
                        }}
                        error={error && error['footer']}
                        emptyText="Footer"
                      />
                    </>
                  )}
                </div>
              </Card>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 sign-carts">
              <Card title="Technician’s Name & Signature">
                <div className="form-group mb-3">
                  <TextInput
                    value={techniciansSign.technician_name || ''}
                    onChange={option => handleChange({ technician_name: option.target.value }, 'techniciansSign')}
                    error={error && error['technician_name']}
                    placeholder="Full Name"
                  />
                </div>
                <div className="form-group mb-3">
                  <TextInput
                    value={techniciansSign.technician_degree || ''}
                    onChange={option => handleChange({ technician_degree: option.target.value }, 'techniciansSign')}
                    error={error && error['technician_degree']}
                    placeholder="Qualification"
                  />
                </div>
                <UploadImage
                  showRemoveBtn
                  showSaveChangeBtn
                  imageObj={techniciansSign}
                  onChange={obj => handleChange({ ...obj, techniciansSign }, 'techniciansSign')}
                  checkboxObj={{
                    show: true,
                    label: 'Hide Signature on Print',
                    key: 'print_technician_sign',
                    checked: techniciansSign.print_technician_sign,
                  }}
                  handleSubmit={handleTechnicianSubmit}
                  error={error && error['technician_sign']}
                  emptyText="Technician’s Sign"
                  name="tech"
                />
              </Card>
            </div>
            <div className="col-md-4 sign-carts">
              <Card title="Doctor’s Name & Signature*">
                <div className="form-group mb-3">
                  <TextInput
                    value={doctorsSign.doctor_name || ''}
                    onChange={option => handleChange({ doctor_name: option.target.value }, 'doctorsSign')}
                    error={error && error['doctor_name']}
                    placeholder="Full Name*"
                  />
                </div>
                <div className="form-group mb-3">
                  <TextInput
                    value={doctorsSign.doctor_degree || ''}
                    onChange={option => handleChange({ doctor_degree: option.target.value }, 'doctorsSign')}
                    error={error && error['doctor_degree']}
                    placeholder="Qualification*"
                  />
                </div>
                <UploadImage
                  showSaveChangeBtn
                  imageObj={doctorsSign}
                  onChange={obj => handleChange({ ...obj, doctorsSign }, 'doctorsSign')}
                  checkboxObj={{
                    show: true,
                    label: 'Hide Signature on Print',
                    key: 'print_doctor_sign',
                    checked: doctorsSign.print_doctor_sign,
                  }}
                  handleSubmit={handleDoctorSubmit}
                  error={error && error['doctor_sign']}
                  emptyText="Doctor's Sign"
                />
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Report;
