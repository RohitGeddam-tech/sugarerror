import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ContainedButton, OutlinedButton } from '../../../../components/Buttons/Button';
import Card from '../../../../components/Common/Card/Card';
import AsyncSelectInput from '../../../../components/FormInputs/AsyncSelectInput/AsyncSelectInput';
import CheckboxInput from '../../../../components/FormInputs/Checkbox/CheckboxInput';
import moment from 'moment';
import SelectInput from '../../../../components/FormInputs/SelectInput/SelectInput';
import TextInput from '../../../../components/FormInputs/TextInput/TextInput';
import Notification from '../../../../components/Notification/Notification';
import { ProfileContext } from '../../../../context/context';
import { fetchRequest } from '../../../../utils/api';
import { BloodGroupList, PatientGenderList } from '../../../../utils/masters';
import Accordion from '../../../../components/Accordion/Accordion';
import { DatePicker } from '@material-ui/pickers';
import { CalendarFilter } from '../../../../assets/icons';
import { getQueryParamStr } from '../../../../utils/custom';

const Details = ({ className, label, value }) => {
  return (
    <div className={`d-flex details ${className ? className : ''}`}>
      <label className="label">{`${label} `}</label>
      <span className="label px-2">:</span>
      <label className="value">{value ? value : '-'}</label>
    </div>
  );
};

const patientDefaultData = {
  first_name: '',
  last_name: '',
  mobile: '',
  email: null,
  address: '',
  pincode: '',
  city: '',
  state: '',
  dob: '',
  gender: '',
  blood_group: null,
};
const AddPatient = props => {
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);
  const history = useHistory();
  const {
    patientId,
    branchId,
    lab_name,
    appointmentId,
    mobileNo,
    first_name: history_first_name,
    last_name: history_last_name,
    email: history_email,
  } = history.location.state ? history.location.state : {};

  const [patientDetails, setPatientDetails] = useState(patientDefaultData);
  const [userData, setUserData] = useState({});
  const [members, setMembers] = useState([]);
  const [addNewMember, setAddNewMember] = useState(false);
  const [showAddNewMember, setShowAddNewMember] = useState(false);
  const [testSet, setTestSet] = useState({});
  const [error, setError] = useState([]);
  const [disabledInput, setDisabledInput] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '', address: '' });
  const [branchList, setBranchList] = useState([]);
  const [branch, setSelectedBranch] = useState({});
  const [doctorList, setDoctorList] = useState([]);
  const [referredDoctor, setSelectedReferredDoctor] = useState({});
  const [testSetList, setTestSetList] = useState([]);
  const [testPackageList, setTestPackageList] = useState([]);
  const [testPackages, setTestPackage] = useState([]);
  const [isLabAdmin, setLabAdmin] = useState(null);
  const [advance, setAdvance] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [editPatient, setEditPatient] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [defaultPatientData, setDefaultPatientData] = useState({});

  const { first_name, last_name, mobile, email, address, pincode, city, state, dob, gender, blood_group } = patientDetails;

  const getDataById = useCallback(async () => {
    if (patientId) {
      setEditPatient(true);
      if (branchId) {
        setDisabledInput(false);
        setError({});
        setNotification({ show: false, message: '', type: '' });
        const res = await fetchRequest({ url: `/lab/${branchId}/patient_entry/${patientId}?type=edit`, method: 'GET', isAuth: true });
        if (res && res.status === 200) {
          const { data } = await res.json();
          if (data) {
            setPatientDetails({ ...data.patient });
            setTestSet({ ...data.lab_test_set, label: data.lab_test_set.name, value: data.lab_test_set.uuid });
            setTestPackage([
              ...data.appointment_test.map(item => ({
                value: item.set_test_uuid,
                label: item.test.name,
                cost: item.cost,
                subTests: item.test.appt_sub_tests?.length ? item.test.appt_sub_tests.map(data => ({ name: data.test.name || '' })) : [],
                type: item.test.type,
              })),
            ]);
            setSelectedBranch({ label: data.lab?.name, value: data.lab?.uuid });
            setDiscount(data.total_discount);
            setAdvance(data.total_paid);
            setSelectedReferredDoctor(data.referred_by);
            // setAdvance()
          }
          return data;
        } else if (res && res.status === 400) {
          const errObj = await res.json();
          errObj.message && setNotification({ show: true, message: errObj.message, type: 'error' });
        }
      } else {
        setError(error => ({ ...error, branch: ['The branch field is required.'] }));
      }
      return;
    }
  }, [patientId, branchId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (patientId && branchId) getDataById();
  }, [patientId, branchId, getDataById]);

  useEffect(() => {
    if (branchId || lab_name) {
      setSelectedBranch({ label: lab_name, value: branchId });
    }
  }, [branchId, lab_name]);

  const requestTestSetList = useCallback(id => {
    (async () => {
      const res = await fetchRequest({
        url: `/lab/${id}/patient_entry_test_set`,
        method: 'GET',
        isAuth: true,
      });
      if (res && res.status === 200) {
        const { data } = await res.json();
        setTestSetList(data.map(item => ({ value: item.uuid, label: item.name })));
      }
      return;
    })();
  }, []);

  const requestReferredDoctor = useCallback(id => {
    (async () => {
      const res = await fetchRequest({
        url: `/lab/${id}/referred_by`,
        method: 'GET',
        isAuth: true,
      });
      if (res && res.status === 200) {
        const { data } = await res.json();
        setDoctorList([{ value: 'self', label: 'Self' }, ...data.map(item => ({ value: item.uuid, label: item.full_name }))]);
      }
      return;
    })();
  }, []);

  useEffect(() => {
    doctorList?.length && !referredDoctor && setSelectedReferredDoctor({ value: 'self', label: 'Self' });
  }, [doctorList, referredDoctor]);

  useEffect(() => {
    if (branchId) {
      requestReferredDoctor(branchId);
      requestTestSetList(branchId);
    }
  }, [branchId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (profile && profile.selectedRole && loginAs === 'lab') {
      requestReferredDoctor(profile.selectedRole.uuid);
      requestTestSetList(profile.selectedRole.uuid);
    }
  }, [profile, loginAs]); // eslint-disable-line react-hooks/exhaustive-deps

  const requestTestPackageList = async (search) => {
    // setTestPackage([]); if new api should make selected tests empty
    const params = {
      page: 1,
      per_page: 15,
      gender: gender?.value || gender || "male",
      search: search,
    };

    let labId ,testId = testSet.value;
    if (!isLabAdmin?.admin && testSet.value && profile.selectedRole.uuid) {
      labId = profile.selectedRole.uuid;
    }
    else if (branch.value && testSet.value){
      labId = branch.value;
    }
    
    const res = await fetchRequest({
      url: `/lab/${labId}/patient_entry_test_set/${testId}/test${getQueryParamStr(params)}`,
      method: 'GET',
      isAuth: true,
    });
    if (res && res.status === 200) {
      const { data } = await res.json();
      const newData =
        data &&
        data.length &&
        data.map(item => ({ value: item.uuid, label: item.test.name, cost: item.cost, subTests: item.sub_tests, type: item.test.type }));
      setTestPackageList(newData);
      return newData;
    }
    return;
  };

  // TODO : const { selectedRole } = profile:
  useEffect(() => {
    if (profile.selectedRole.role.name === 'lab_admin') setLabAdmin({ admin: true });
    else setLabAdmin({ admin: false });
  }, [profile.selectedRole]);

  const makeFormFieldsEmpty = () => {
    return {
      first_name: '',
      last_name: '',
      address: '',
      pincode: '',
      city: '',
      state: '',
      dob: '',
      gender: '',
      blood_group: '',
      email: '',
      uuid: null,
    };
  };
  //add new member change
  useEffect(() => {
    if (addNewMember) {
      setUserData({
        ...userData,
        label: '',
        ...makeFormFieldsEmpty(),
      });
      setPatientDetails({
        ...patientDetails,
        ...makeFormFieldsEmpty(),
      });
    } else {
      setUserData({ ...userData, ...defaultPatientData, label: defaultPatientData.full_name, value: defaultPatientData.uuid });
      setPatientDetails({ ...patientDetails, ...userData, ...defaultPatientData });
    }
  }, [addNewMember]); // eslint-disable-line react-hooks/exhaustive-deps

  //request all branch
  useEffect(() => {
    if (profile.selectedRole.uuid && isLabAdmin) {
      if (isLabAdmin.admin) {
        (async () => {
          const statusRes = await fetchRequest({
            url: `/lab_group/${profile.selectedRole.uuid}/get_labs`,
            method: 'GET',
            isAuth: true,
          });
          if (statusRes && statusRes.status === 200) {
            const { data } = await statusRes.json();
            if (data.length) setBranchList(data.map(item => ({ value: item.uuid, label: item.name })));
          }
          return;
        })();
      } else requestTestSetList(profile.selectedRole.uuid);
    }
  }, [profile?.selectedRole, isLabAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  const getDetailsFromMobile = async (mobile,changedLabId = 0) => {
    setShowAddNewMember(false);
    setMembers([]);
    setUserData({
      label: '',
      ...makeFormFieldsEmpty(),
    });
    setDefaultPatientData({
      ...defaultPatientData,
      first_name: '',
      last_name: '',
      email: history?.location?.state?.email || '',
      mobile,
    });
    let labId = changedLabId?  changedLabId : (isLabAdmin?.admin ? branch.value : profile.selectedRole.uuid);
    if (labId) {
      if (mobile) {
        setDisabledInput(false);
        setError({});
        setNotification({ show: false, message: '', type: '' });
        const updatedLabID = props && props?.location?.state?.lab_id;
        const res = await fetchRequest({
          url: `/lab/${updatedLabID ? updatedLabID : labId}/patient_details?mobile=${
            mobile ? mobile : patientDetails.mobile ? patientDetails.mobile : mobileNo
          }`,
          method: 'GET',
          isAuth: true,
        });
        if (res && res.status === 200) {
          const { data } = await res.json();
          if (data.length) {
            setDisabledInput(true);
            setShowAddNewMember(true);
            setUserData({ ...data[0], existingMember: true });
            setMembers(data.map(item => ({ label: `${item.first_name} ${item.last_name}`, value: item.uuid, ...item })));
            setUserData({
              label: '',
              ...makeFormFieldsEmpty(),
            });
            setDefaultPatientData({
              ...defaultPatientData,
              first_name: '',
              last_name: '',
              email: '',
              mobile,
            });
            setPatientDetails({
              ...patientDetails,
              ...makeFormFieldsEmpty(),
              mobile,
            });
            // }
          } else {
            setMembers([]);
            setUserData({
              label: '',
              ...makeFormFieldsEmpty(),
            });
            setDefaultPatientData({
              ...defaultPatientData,
              first_name: mobileNo === mobile ? history_first_name : '',
              last_name: mobileNo === mobile ? history_last_name : '',
              email: mobileNo === mobile ? history_email : '',
              mobile,
            });
            setPatientDetails({
              ...patientDetails,
              first_name: mobileNo === mobile ? history_first_name : '',
              last_name: mobileNo === mobile ? history_last_name : '',
              email: mobileNo === mobile ? history_email : '',
              pincode: '',
              city: '',
              state: '',
              dob: '',
              gender: '',
              blood_group: '',
              mobile,
              uuid: null,
              address: '',
            });
          }
          return data;
        } else {
          setMembers([]);
          setDefaultPatientData({
            ...defaultPatientData,
            first_name: mobileNo === mobile ? history_first_name : '',
            last_name: mobileNo === mobile ? history_last_name : '',
            email: mobileNo === mobile ? history_email : '',
            mobile,
          });
          setPatientDetails({
            ...patientDetails,
            first_name: mobileNo === mobile ? history_first_name : '',
            last_name: mobileNo === mobile ? history_last_name : '',
            email: mobileNo === mobile ? history_email : '',
            pincode: '',
            city: '',
            state: '',
            dob: '',
            gender: '',
            blood_group: '',
            mobile,
            uuid: null,
          });
          if (!labId) {
            const errObj = await res.json();
            setError({ ...errObj.errors });
            res.status !== 422 &&
              !Object.keys(errObj.error ? errObj.error : {}).length &&
              errObj.message &&
              setNotification({ show: true, message: errObj.message, type: 'error' });
          }
        }
      }
    } else {
      setError({ ...error, branch: ['The branch field is required.'] });
    }
    return;
  };

  //request test sets
  useEffect(() => {
    if (branch.value) {
      setTestPackage([]);
      setTestSet({});
      setAdvance(0);
      setDiscount(0);
      requestTestSetList(branch.value);
      requestReferredDoctor(branch.value);
    }
    if (profile.selectedRole.role.name === 'lab_admin') {
      !branch.value ? setDisabledInput(true) : setDisabledInput(false);
    }
  }, [branch.value]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (mobileNo) {
      getDetailsFromMobile(mobileNo);
    }
  }, [mobileNo]); // eslint-disable-line react-hooks/exhaustive-deps


  useEffect(() => {
    if (mobileNo && branchId) {
      getDetailsFromMobile(mobileNo,branchId);
    }
  }, [mobileNo,branchId]);

  //request test packages for lab admin
  useEffect(() => {
    if (branch.value && testSet.value) requestTestPackageList();
  }, [branch?.value, testSet?.value,gender?.value]); // eslint-disable-line react-hooks/exhaustive-deps

  //request test package for lab user
  useEffect(() => {
    if (!isLabAdmin?.admin && testSet.value && profile.selectedRole.uuid) requestTestPackageList();
  }, [isLabAdmin, testSet.value, profile.selectedRole]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (error && error['branch'] && branch.value && patientDetails.mobile) {
      getDetailsFromMobile(patientDetails.mobile);
    }
  }, [error, branch, patientDetails.mobile]); // eslint-disable-line react-hooks/exhaustive-deps

  // const removeTestPackage = useCallback(
  //   ind => {
  //     if (testPackageList?.length) setTestPackage(testPackageList.splice(ind, 1));
  //   },
  //   [testPackageList],
  // );

  const onHandlePatientDetailChange = useCallback(
    (value, key) => {
      let obj = { ...patientDetails };
      if (key === 'dob') {
        obj[key] = moment(value).format('YYYY-MM-DD');
      } else {
        obj[key] = value;
      }
      setPatientDetails({ ...obj });

      if (key === 'mobile' && value.toString().length === 10) getDetailsFromMobile(key === 'mobile' && value);
      else setDisabledInput(false);
    },
    [patientDetails], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const onHandleBlur = (event, field) => {
    const errObj = { errors: {} };
    if (!event && field === 'mobile') {
      setPatientDetails({ ...patientDefaultData, mobile });
      setMembers([]);
      setShowAddNewMember(false)
      errObj.errors = {
        mobile: [`Mobile field is required`],
      };
    } else if (event.length !== 10 && field === 'mobile') {
      errObj.errors = {
        mobile: ['Enter valid mobile no'],
      };
    } else if (!event && field === 'pincode') {
      errObj.errors = {
        pincode: [`Pincode field is required`],
      };
    } else if (event.length !== 6 && field === 'pincode') {
      errObj.errors = {
        pincode: ['Enter valid Pincode'],
      };
    }
    setError({ ...errObj.errors });
  };

  const totalPackageAmount = useMemo(() => {
    let total = 0;
    if (testPackages?.length) {
      total = testPackages.reduce(
        (current, item) => {
          return parseFloat(current) + parseFloat(item.cost);
        },
        [total],
      );
    }
    return total;
  }, [testPackages]);

  const totalAmount = useMemo(() => totalPackageAmount - discount, [totalPackageAmount, discount]);

  const pendingAmount = useMemo(() => totalAmount - advance, [totalAmount, advance]);

  const handleSubmit = async e => {
    setError({});
    setBtnLoading(true);
    setNotification({ show: false, message: '', type: '' });
    e.preventDefault();
    let postObj = {
      test_set: testSet?.value,
      referred_by_id: referredDoctor?.value && referredDoctor?.value === 'self' ? null : referredDoctor?.value,
      patient_details: {
        ...patientDetails,
        gender: patientDetails?.gender ? patientDetails.gender.value : null,
        blood_group: patientDetails?.blood_group ? patientDetails.blood_group.value : null,
        mobile: patientDetails.mobile ? patientDetails.mobile : mobileNo,
      },
      tests: [...testPackages].map(val => val.value),
      advance: advance !== '' ? advance : 0,
      discount: discount !== '' ? discount : 0,
    };
    if (appointmentId) {
      postObj['appointment_booking_id'] = appointmentId;
    }
    if (addNewMember) {
      postObj.patient_details['add_member'] = true;
    }
    if (userData.existingMember && !addNewMember && patientDetails.uuid) {
      postObj.patient_details = { uuid: patientDetails.uuid, add_member: false };
    }
    if (editPatient) {
      postObj = {
        tests: [...testPackages].map(val => val.value),
        advance: advance !== '' ? advance : 0,
        discount: discount !== '' ? discount : 0,
      };
    }
    if (postObj?.patient_details) delete postObj.patient_details.existingMember;
    let url = editPatient
      ? `/lab/${branchId}/patient_entry/${patientId}`
      : `/lab/${branch.value ? branch.value : profile.selectedRole.uuid}/patient_entry`;

    const res = await fetchRequest({
      url,
      method: editPatient ? 'PUT' : 'POST',
      isAuth: true,
      body: postObj,
    });
    if (res && res.status === 200) {
      setBtnLoading(false);
      setPatientDetails(patientDefaultData);
      setTestSet({});
      setTestPackage([]);
      setAdvance(0);
      setDiscount(0);
      const data = await res.json();
      if (data.success) {
        data.message && setNotification({ show: true, message: data.message, type: 'success' });
        setTimeout(() => props.history.push(`/${localStorage.getItem('loginAs')}/patients/list`), 2000);
      }
    } else {
      setBtnLoading(false);
      const errObj = await res.json();
      setError({ ...errObj.errors });
      res.status !== 422 &&
        !Object.keys(errObj.error ? errObj.error : {}).length &&
        errObj.message &&
        setNotification({ show: true, message: errObj.message, type: 'error' });
    }
    return;
  };
  
  return (
    <div className="add-package-container">
      <Notification {...notification} />
      <div className="row">
        <div className="col-md-8 col-12">
          <form onSubmit={handleSubmit}>
            {editPatient ? (
              <Card title="Patient Details">
                <Details label="Branch Name" value={branch.label} />
                <Details label="Mobile No." value={mobile} />
                <Details label="Email" value={email} />
                <Details label="Patient Name" value={`${first_name} ${last_name}`} />
                <Details label="Address" value={address} />
                <div className="d-flex">
                  <Details className="mr-5" label="Pincode" value={pincode} />
                  <Details className="mr-5" label="City" value={city} />
                  <Details className="mr-5" label="State" value={state} />
                </div>
                <Details label="Date of birth" value={dob} />
                <div className="d-flex">
                  <Details className="mr-5" label="Gender" value={gender} />
                  <Details className="mr-5" label="Blood Group" value={blood_group} />
                </div>
                <Details label="Referral" value={referredDoctor && referredDoctor.full_name ? referredDoctor.full_name : 'Self'} />
              </Card>
            ) : (
              <Card title="Patient Details">
                {isLabAdmin?.admin && (
                  <div className="row mb-4">
                    <div className="form-group col-md-5 col-12">
                      <SelectInput
                        placeholder="Select Branch"
                        options={branchList}
                        value={branch}
                        onChange={data => {
                          setSelectedBranch(data) || setDoctorList([]) || setSelectedReferredDoctor({});
                          if(mobile && mobile.length === 10 && data.value) {
                            console.log("onchange effect",mobile)
                            getDetailsFromMobile(mobile,data.value)}
                        }}
                        error={error && error['branch']}
                        isClearable={false}
                        disabled={appointmentId}
                      />
                    </div>
                  </div>
                )}
                <div className="row mb-4">
                  <div className="form-group col-md-6 col-12">
                    <TextInput
                      placeholder="Mobile No.*"
                      value={mobile || ''}
                      onChange={e => onHandlePatientDetailChange(e.target.value, 'mobile')}
                      error={error && (error['patient_details.mobile'] || error['mobile'])}
                      onBlur={e => onHandleBlur(e.target.value, 'mobile')}
                      disabled={disabledInput && isLabAdmin?.admin && !mobile}
                      maxLength={10}
                      type="number"
                    />
                  </div>
                  <div className="form-group col-md-6 col-12">
                    <TextInput
                      placeholder="Email (Optional)"
                      value={email || ''}
                      onChange={e => onHandlePatientDetailChange(e.target.value, 'email')}
                      error={error && error['patient_details.email']}
                      disabled={disabledInput && !addNewMember}
                    />
                  </div>
                </div>
                {showAddNewMember && (
                  <div className="row mb-4">
                    <div className="form-group col-md-6 col-12">
                      <CheckboxInput
                        name="addNewMember"
                        label="Add a new family member"
                        checked={addNewMember}
                        value={addNewMember}
                        blue
                        onClick={() => setAddNewMember(!addNewMember)}
                      />
                    </div>
                  </div>
                )}
                {!addNewMember && members.length ? (
                  <div className="row mb-4">
                    <div className="form-group col-md-6 col-12">
                      <SelectInput
                        placeholder="Members"
                        className="cursor-no"
                        options={members}
                        disabled={addNewMember}
                        value={addNewMember ? {} : userData}
                        onChange={data => {
                          setError({});
                          if (data && data.value) {
                            setDisabledInput(true);
                            setUserData({ ...data, existingMember: true }) ||
                              setPatientDetails({
                                ...patientDetails,
                                ...data,
                                gender: PatientGenderList.find(gender => gender.value === data.gender) || '',
                                blood_group: BloodGroupList.find(blood_group => blood_group.value === data.blood_group) || '',
                                address: data.address || '',
                              });
                          } else {
                            setDisabledInput(false);
                            setUserData({
                              existingMember: false,
                              ...userData,
                              label: '',
                              ...makeFormFieldsEmpty(),
                            });
                            setPatientDetails({
                              ...patientDetails,
                              ...makeFormFieldsEmpty(),
                            });
                          }
                        }}
                        error={error && error['branch']}
                      />
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                <div className="row mb-4">
                  <div className="form-group col-md-6 col-12">
                    <TextInput
                      placeholder="First Name*"
                      value={first_name || ''}
                      onChange={e => onHandlePatientDetailChange(e.target.value, 'first_name')}
                      error={error && error['patient_details.first_name']}
                      disabled={disabledInput && !addNewMember}
                    />
                  </div>
                  <div className="form-group col-md-6 col-12">
                    <TextInput
                      placeholder="Last Name*"
                      value={last_name || ''}
                      onChange={e => onHandlePatientDetailChange(e.target.value, 'last_name')}
                      error={error && error['patient_details.last_name']}
                      disabled={disabledInput && !addNewMember}
                    />
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="form-group col-md-12 col-12">
                    <TextInput
                      placeholder="Address (Optional)"
                      value={address || ''}
                      onChange={e => onHandlePatientDetailChange(e.target.value, 'address')}
                      error={error && error['patient_details.address']}
                      disabled={disabledInput && !addNewMember}
                    />
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="form-group col-md-4 col-12">
                    <TextInput
                      placeholder="Pincode*"
                      value={pincode || ''}
                      onChange={e => onHandlePatientDetailChange(e.target.value, 'pincode')}
                      onBlur={e => onHandleBlur(e.target.value, 'pincode')}
                      error={(error && error['patient_details.pincode']) || error['pincode']}
                      disabled={disabledInput && !addNewMember}
                      maxLength={6}
                      type="number"
                    />
                  </div>
                  <div className="form-group col-md-4 col-12">
                    <TextInput
                      placeholder="City*"
                      value={city || ''}
                      onChange={e => onHandlePatientDetailChange(e.target.value, 'city')}
                      error={error && error['patient_details.city']}
                      disabled={disabledInput && !addNewMember}
                    />
                  </div>
                  <div className="form-group col-md-4 col-12">
                    <TextInput
                      placeholder="State*"
                      value={state || ''}
                      onChange={e => onHandlePatientDetailChange(e.target.value, 'state')}
                      error={error && error['patient_details.state']}
                      disabled={disabledInput && !addNewMember}
                    />
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="form-group col-md-4 col-12">
                    <DatePicker
                      label="Date of birth*"
                      inputVariant="outlined"
                      value={dob || null}
                      onChange={date => onHandlePatientDetailChange(date, 'dob')}
                      animateYearScrolling
                      openTo="year"
                      views={['year', 'month', 'date']}
                      format="dd-MM-yyyy"
                      maxDate={new Date()}
                      error={error && error['patient_details.dob'] ? true : false}
                      helperText={error && error['patient_details.dob']}
                      disabled={disabledInput && !addNewMember}
                      autoOk
                      disableFuture
                    />
                    <div className="patient-calenderIcon">
                      <label className="table-icon d-inline">{CalendarFilter}</label>
                    </div>
                  </div>
                  <div className="form-group col-md-4 col-12">
                    <SelectInput
                      placeholder="Gender*"
                      options={PatientGenderList}
                      value={gender}
                      onChange={data => {
                        onHandlePatientDetailChange(data, 'gender');
                      }}
                      error={error && error['patient_details.gender']}
                      disabled={disabledInput && !addNewMember}
                    />
                  </div>
                  <div className="form-group col-md-4 col-12">
                    <SelectInput
                      placeholder="Blood Group"
                      options={BloodGroupList}
                      value={blood_group}
                      onChange={data => onHandlePatientDetailChange(data, 'blood_group')}
                      error={error && error['patient_details.blood_group']}
                      disabled={disabledInput && !addNewMember}
                    />
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="form-group col-md-5 col-12">
                    <SelectInput
                      placeholder="Referral"
                      options={doctorList}
                      value={referredDoctor}
                      onChange={data => setSelectedReferredDoctor(data)}
                      error={error && error['referred_by_id']}
                    />
                  </div>
                </div>
              </Card>
            )}
            <Card title="Test Details">
              <div className="row mb-4">
                <div className="form-group col-md-5 col-12">
                  <SelectInput
                    placeholder="Select Test Set"
                    options={testSetList}
                    value={testSet}
                    onChange={data => setTestSet(data) || setTestPackage([])}
                    error={error && error['test_set']}
                    disabled={!gender || editPatient}
                  />
                </div>
              </div>
              <div className="row mb-4">
                <label className="gray-label mb-1 ml-3">Search & Select Tests or Test Packages</label>
                <div className="form-group col-md-12 col-12">
                  <AsyncSelectInput
                    isMulti
                    options={testPackageList && testPackageList.length ? testPackageList || [] : []}
                    noOptionsMessage="Search & Select Tests"
                    FilterData={search => requestTestPackageList(search)}
                    value={testPackages && testPackages.length ? testPackages : []}
                    onChange={option => (option && option.length ? setTestPackage([...option]) : setTestPackage([]))}
                    error={error && error['tests']}
                    disabled={!gender || !testSet}
                  />
                </div>
              </div>
              {testPackages.length ? (
                testPackages.map((item, ind) => (
                  <div key={ind}>
                    {item.type === 'package' && item.subTests?.length ? (
                      <Accordion
                        testAccordion
                        data={[
                          {
                            heading: (
                              <div className="d-flex justify-content-between w-100 align-items-center">
                                <div className="d-flex align-items-center">
                                  {/* {CloseIcon} */}
                                  <p className="ml-3">{item.label}</p>
                                </div>
                                <p>{`₹ ${item.cost}`}</p>
                              </div>
                            ),
                            body: (
                              <ul className="test-package-accordion">
                                {item.subTests.map((test, ind) => (
                                  <li className="sub-tests" key={ind}>
                                    {ind + 1}. {'  '}
                                    {test.name}
                                  </li>
                                ))}
                              </ul>
                            ),
                          },
                        ]}
                      ></Accordion>
                    ) : (
                      <div className="d-flex justify-content-between w-100 align-items-center tests">
                        <div className="d-flex align-items-center">
                          <p className="ml-3">{item.label}</p>
                        </div>
                        <p>{`₹ ${item.cost}`}</p>
                      </div>
                    )}
                    <div className="divider"></div>
                  </div>
                ))
              ) : (
                <></>
              )}
            </Card>
            <Card>
              <div>
                <div className="row">
                  <div className="col-9">
                    <label>Total :</label>
                  </div>
                  <div className="col-3">
                    <span>{`₹ ${totalPackageAmount}`}</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-9">
                    <label>(-) Discount:</label>
                  </div>
                  <div className="col-3">
                    <div className="form-group d-flex align-items-center">
                      <span className="mr-2">₹ </span>
                      <TextInput
                        value={discount || ''}
                        onChange={e =>
                          e.target.value <= totalPackageAmount && e.target.value >= 0 
                          // && e.target.value <= pendingAmount
                            ? setDiscount(e.target.value.replace(/^0/, ''))
                            : null
                        }
                        error={error && error['discount']}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="divider"></div>
              <div>
                <div className="row bold">
                  <div className="col-9">
                    <label>Total amount payable :</label>
                  </div>
                  <div className="col-3">
                    <span>{`₹ ${totalAmount}`}</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-9">
                    <label>(-) Advance :</label>
                  </div>
                  <div className="col-3">
                    <div className="form-group d-flex align-items-center">
                      <span className="mr-2">₹ </span>
                      <TextInput
                        value={advance || ''}
                        onChange={e =>
                          e.target.value <= totalAmount && e.target.value >= 0 ? setAdvance(e.target.value.replace(/^0/, '')) : null
                        }
                        error={error && error['advance']}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="divider"></div>
              <div>
                <div className="row bold">
                  <div className="col-9">
                    <label>Pending :</label>
                  </div>
                  <div className="col-3">
                    <span>{`₹ ${pendingAmount}`}</span>
                  </div>
                </div>
              </div>
              <div className="row mt-5 mb-4">
                <div className="col-12">
                  <div className="w-100 d-flex justify-content-center">
                    <OutlinedButton className="mr-2" red onClick={() => props.history.goBack()} disabled={btnLoading}>
                      Cancel
                    </OutlinedButton>
                    <ContainedButton className="" lightBlue type="submit" disabled={btnLoading} loading={btnLoading}>
                      Save
                    </ContainedButton>
                  </div>
                </div>
              </div>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AddPatient;
