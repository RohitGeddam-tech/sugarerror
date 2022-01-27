import React, { useEffect, useState } from 'react';
import TextInput from '../../../../components/FormInputs/TextInput/TextInput';
// import { fetchRequest } from '../../../../utils/api';
import CheckboxInput from '../../../../components/FormInputs/Checkbox/CheckboxInput';

const OfficeDetails = ({ data, setData, error }) => {
  const [initials, setInitials] = useState({});
  const [pinCodeError, SetPincodeError] = useState({});

  useEffect(() => {
    setInitials({ ...data });
  }, [data]);

  // useEffect(() => {
  //   if (!packages.length)
  //     (async () => {
  //       const res = await fetchRequest({ url: '/super_admin/package', method: 'GET', isAuth: true });
  //       if (res && res.status === 200) {
  //         const { data } = await res.json();
  //         setPackages(data);
  //         return data;
  //       }
  //       return;
  //     })();
  // }, []);

  const onHandleChange = (value, key) => {
    if (key === 'pincode') {
      const re = /^[0-9\b]+$/;
      if (value === '' || re.test(value)) {
        let obj = { ...initials };
        obj[key] = value;
        setInitials({ ...obj });
        setData({ ...obj });
      }
    } else {
      let obj = { ...initials };
      obj[key] = value;
      setInitials({ ...obj });
      setData({ ...obj });
    }
  };

  const onHandleBlur = (event, field) => {
    const errObj = { errors: {} };
    if (!event && field === 'pincode') {
      errObj.errors = {
        pincode: [`Pincode field is required`],
      };
    } else if (event.length !== 6 && field === 'pincode') {
      errObj.errors = {
        pincode: ['Enter valid Pincode'],
      };
    }
    SetPincodeError({ ...errObj.errors });
  };

  const { lab_name, address_line_one, address_line_two, pincode, city, state, create_branch } = initials;
  return (
    <div className="form-content">
      <div className="paper">
        <label className="paper-label">Main office details</label>
        <div className="row">
          <div className="form-group col-8 col-sm-8 col-md-5 mb-3">
            <TextInput
              value={lab_name || ''}
              onChange={option => onHandleChange(option.target.value, 'lab_name')}
              error={error && error['lab_details.lab_name']}
              placeholder="Office Name*"
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group mb-3 w-100 col-sm-12 col-md-6 col-lg-6">
            <TextInput
              value={address_line_one || ''}
              onChange={option => onHandleChange(option.target.value, 'address_line_one')}
              error={error && error['lab_details.address_line_one']}
              placeholder="Address Line 1*"
            />
          </div>
          <div className="form-group mb-3 w-100 col-sm-12 col-md-6 col-lg-6">
            <TextInput
              value={address_line_two || ''}
              onChange={option => onHandleChange(option.target.value, 'address_line_two')}
              error={error && error['lab_details.address_line_two']}
              placeholder="Address Line 2*"
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group mb-3 col-6 col-sm-3 col-md-4">
            <TextInput
              value={pincode || ''}
              onChange={option => onHandleChange(option.target.value, 'pincode')}
              onBlur={option => onHandleBlur(option.target.value, 'pincode')}
              error={(error && error['lab_details.pincode']) || (pinCodeError && pinCodeError['pincode'])}
              placeholder="Pincode*"
              maxLength={6}
            />
          </div>
          <div className="form-group mb-3 col-6 col-sm-6 col-md-4">
            <TextInput
              value={city || ''}
              onChange={option => onHandleChange(option.target.value, 'city')}
              error={error && error['lab_details.city']}
              placeholder="City*"
            />
          </div>
          <div className="form-group mb-3 col-6 col-sm-6 col-md-4">
            <TextInput
              value={state || ''}
              onChange={option => onHandleChange(option.target.value, 'state')}
              error={error && error['lab_details.state']}
              placeholder="State*"
            />
          </div>
          <div className="form-group col-sm-12 col-12">
            <CheckboxInput
              name="registerWithSameDetails"
              label="Register Lab with same details"
              checked={create_branch}
              value={create_branch}
              blue
              onClick={() => onHandleChange(!create_branch, 'create_branch')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeDetails;
