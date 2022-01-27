import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import { DownloadReport, PrintReport, SendReport } from '../../../../assets/icons';
import { ContainedButton, OutlinedButton } from '../../../../components/Buttons/Button';
import Details from '../../../../components/Details/Details';
import CheckboxInput from '../../../../components/FormInputs/Checkbox/CheckboxInput';
import TextInput from '../../../../components/FormInputs/TextInput/TextInput';
import { CustomModal, ModalBody, ModalFooter } from '../../../../components/Modal/Modal';
import Accordion from '../../../../components/Accordion/Accordion';
import { fetchRequest } from '../../../../utils/api';
import SelectInput from '../../../../components/FormInputs/SelectInput/SelectInput';
import Textarea from '../../../../components/FormInputs/Textarea/Textarea';
import { formatReportValues, isOutOfRange } from '../../../../utils/custom';
import { ProfileContext } from '../../../../context/context';
import parse from 'html-react-parser';
import TextEditor from '../../../../components/Common/TextEditor/TextEditor';

const defaultState = {
  isModalOpen: false,
};

const UpdatePatientModal = ({ actionObject = defaultState }) => {
  const { profile, setProfileData } = useContext(ProfileContext);
  const { isModalOpen, setNotification, data } = actionObject;
  const [modal, handleModalToggle] = useState(isModalOpen);
  const [initials, setInitials] = useState({});
  const [error, setError] = useState({});
  const [reportValues, setReportValues] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectAllTests, setSelectAllTests] = useState(false);
  const [btnLoading, setBtnLoading] = useState({
    test: false,
    printBill: false,
    printReport: false,
  });

  const updateBtnLoadingState = useCallback(
    (key, isLoading) => {
      const tempLoader = { ...btnLoading };
      tempLoader[key] = isLoading;
      setBtnLoading(tempLoader);
    },
    [btnLoading],
  );

  const { uuid: patientId, lab = {}, patient, referred_by, created_at, labId, formatted_created_at } = initials;

  const getDataById = useCallback(async () => {
    if (patientId && labId) {
      setReportValues([]);
      setError(error);
      setNotification({ show: false, message: '', type: '' });
      const res = await fetchRequest({
        url: `/lab/${labId}/patient_entry/${patientId}${isModalOpen ? '' : `?type=edit`}`,
        method: 'GET',
        isAuth: true,
      });
      if (res && res.status === 200) {
        const { data } = await res.json();
        if (data) {
          setReportValues(formatReportValues(data));
          setInitials({ ...initials, formatted_created_at: data.formatted_created_at, patient: data.patient });
        }
        return data;
      } else {
        const errObj = await res.json();
        res.status !== 422 && errObj.message && setNotification({ show: true, message: errObj.message, type: 'error' });
        handleModalToggle(false);
      }
    }
  }, [patientId, labId, initials]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!modal) setInitials({});
  }, [modal]);

  useEffect(() => {
    if (patientId && labId) {
      setSelectAllTests(false);
      getDataById();
    }
  }, [patientId, labId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    handleModalToggle(isModalOpen);
    data && setInitials(data);
  }, [data, isModalOpen]);

  const getFormulaResult = formulaMap => {
    const result = formulaMap.map(formula => (formula.type === 'test' ? formula.tr : formula.value));
    return String(eval(result.join('')));
    /* eslint no-eval: 0 */
  };

  const handleChange = useCallback(
    (type, test_id, value, isRemark) => {
      let temp = [...reportValues];
      temp.map(item => {
        if (item.appt_sub_tests?.length) {
          let ind = item.appt_sub_tests.findIndex(test => test.test_id === test_id);
          if (ind >= 0) {
            item.appt_sub_tests[ind].value = value;
          }
          item.appt_sub_tests.forEach(sub_tests => {
            if (sub_tests.formula) {
              let counter = 0;
              let testLength = 0;

              sub_tests.formula.forEach(formula => {
                if (formula.type === 'test') {
                  testLength = testLength + 1;
                }
                if (formula.value === item?.appt_sub_tests[ind]?.test?.uuid) {
                  formula.tr = item.appt_sub_tests[ind].value;
                  formula.isValid = formula.tr.length || formula.tr === 0 ? true : false;
                }
                if (formula.type === 'test' && formula.isValid) {
                  counter = counter + 1;
                }
              });

              const result = testLength === counter ? getFormulaResult(sub_tests.formula) : null;
              sub_tests.value = result;
            }
          });
          // Check for group test updates
          item.appt_sub_tests.forEach(subTest => {
            if (subTest.appt_sub_tests.length) {
              let ind = subTest.appt_sub_tests.findIndex(test => test.test_id === test_id);
              if (ind >= 0) subTest.appt_sub_tests[ind].value = value;
            }
          });
        } else if (!isRemark && item.test_id === test_id) item.value = value;
        if (isRemark && item.test_id === test_id) item.remark = value;
        return item;
      });
      setReportValues([...temp]);
    },
    [reportValues],
  );

  const handleFocusEvents = e => {
    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleFocusEvents, false);
    return () => {
      document.removeEventListener('keydown', handleFocusEvents, false);
    };
  }, []);

  const getInputs = useCallback(
    ({ type, test_type, value, test_id, possible_test_results, disabled, report_type }, report_sent, errorKey, rangeTest) => {
      if (report_sent) {
        const outOfRange = rangeTest && isOutOfRange(rangeTest, value);
        return (
          <label className={outOfRange ? 'out-of-range' : ''}>{value ? report_type.name == 'Pre-Defined Test Result' ? <label className="editor-content">{parse(value)}</label>: (typeof value === 'string' ? value || '-' : value.label || '-') : '-'}</label>
        );
      } else {
        switch (type) {
          case 'single_line':
            return <TextInput value={value || ''} onChange={e => handleChange(test_type, test_id, e.target.value)} />;
          case 'numeric':
            return (
              <TextInput
                value={value || ''}
                onChange={e => {
                  if (e.target.value == '' || e.target.value >= 0) handleChange(test_type, test_id, e.target.value);
                }}
                disabled={disabled}
                onfocus={e => handleFocusEvents(e)}
              />
            );
          case 'dropdown':
            return (
              <SelectInput
                value={value}
                options={possible_test_results.map(item => ({ label: item.result, value: item.result, uuid: item.uuid }))}
                onChange={value => handleChange(test_type, test_id, value)}
              />
            );
          case 'text_area': {
            if (report_type.name == 'Pre-Defined Test Result')
              return <TextEditor value={value} onChange={data => handleChange(test_type, test_id, data)} error={error && error[errorKey]} />
            else return <Textarea value={value} onChange={e => handleChange(test_type, test_id, e.target.value)} error={error && error[errorKey]} />;
          }
          default:
            break;
        }
      }
    },
    [reportValues, error], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // const cancelTests = useCallback((type, test_id) => {
  // let temp = [...reportValues];
  // let testToSave = [];
  // temp.filter(item => {
  //   if (item.test_id === test_id) {
  //     if (type === 'panel') {
  //       let x = item.appt_sub_tests.map(({ test_id, value }) => ({ test_id, value: value instanceof Object ? value.value : value }));
  //       testToSave = [...testToSave, ...x];
  //       if (item.remark) testToSave = [...testToSave, { test_id: item.test_id, remark: item.remark }];
  //     } else if (type === 'test')
  //       testToSave = [
  //         ...testToSave,
  //         { test_id: item.test_id, value: item.value instanceof Object ? item.value.value : item.value, remark: item.remark },
  //       ];
  //     return item;
  //   }
  // });
  // }, []);

  const saveTests = useCallback(
    async (type, test_id) => {
      setError({});
      let errors = {};
      if (patientId && labId) {
        updateBtnLoadingState('test', true);
        setNotification({ show: false, message: '', type: '' });
        let temp = [...reportValues];
        let testToSave = [];
        temp.filter((item, ind) => {
          if (item.test_id === test_id) {
            if (item.appt_sub_tests?.length) {
              let x = item.appt_sub_tests.map(({ test_id, value, test_type, appt_sub_tests = [], report_type }, subInd) => {
                if (test_type === 'group') {
                  return [
                    ...appt_sub_tests.map(({ test_id, value, test_type, report_type }, secSubInd) => {
                      if (test_type === 'test' && report_type?.name === 'Pre-Defined Test Result' && !value) {
                        errors = { ...errors, [`result.${ind}.${subInd}.${secSubInd}`]: 'The result field is required.' };
                      }
                      return {
                        test_id,
                        value: value instanceof Object ? value.value : value,
                      };
                    }),
                  ];
                } else {
                  if (test_type === 'test' && report_type?.name === 'Pre-Defined Test Result' && !value) {
                    errors = { ...errors, [`result.${ind}.${subInd}`]: 'The result field is required.' };
                  }
                  return { test_id, value: value instanceof Object ? value.value : value };
                }
              });
              testToSave = [...testToSave, ...x].flat();
              if (item.remark) testToSave = [...testToSave, { test_id: item.test_id, remark: item.remark }];
            } else if (type === 'test') {
              if (type === 'test' && item.report_type?.name === 'Pre-Defined Test Result' && !item.value) {
                errors = { ...errors, [`result.${ind}`]: 'The result field is required.' };
              }
              testToSave = [
                ...testToSave,
                { test_id: item.test_id, value: item.value instanceof Object ? item.value.value : item.value, remark: item.remark },
              ];
            }
            return item;
          }
        });
        setError({ error: errors });
        if (!Object.keys(errors).length) {
          const res = await fetchRequest({
            url: `/lab/${labId}/patient_entry/${patientId}/report`,
            method: 'PUT',
            body: { report_values: testToSave },
            isAuth: true,
          });
          res && updateBtnLoadingState('test', false);

          if (res && res.status === 200) {
            const { message } = await res.json();
            if (message) {
              setNotification({ show: true, message: message, type: 'success' });
              // handleModalToggle(false);
              setProfileData({ ...profile, isReportUpdated: true });
              actionObject.handleSuccess();
            }
            return;
          } else {
            const errObj = await res.json();
            setError({ ...errObj.errors });
            res.status !== 422 &&
              !Object.keys(errObj.error ? errObj.error : {}).length &&
              errObj.message &&
              setNotification({ show: true, message: errObj.message, type: 'error' });
          }
        } else updateBtnLoadingState('test', false);
      }
    },
    [reportValues, patientId, labId, btnLoading], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const sendRequest = useCallback(async () => {
    setNotification({ show: false, message: '', type: '' });
    const res = await fetchRequest({
      url: `/lab/${labId}/patient_entry/${patientId}/send_report`,
      method: 'POST',
      body: { test_ids: selectedTests.map(test => test.test_id) },
      isAuth: true,
    });
    if (res && res.status === 200) {
      const { message } = await res.json();
      if (message) {
        setNotification({ show: true, message: message, type: 'success' });
        handleModalToggle(false);
        setSelectedTests([]);
        setInitials({});
        actionObject.handleSuccess();
      }
      return;
    } else {
      const errObj = await res.json();
      setError({ ...errObj.errors });
      res.status !== 422 &&
        !Object.keys(errObj.error ? errObj.error : {}).length &&
        errObj.message &&
        setNotification({ show: true, message: errObj.message, type: 'error' });
    }
  }, [selectedTests, labId, patientId]); // eslint-disable-line react-hooks/exhaustive-deps

  const printBill = useCallback(async () => {
    setError({});
    updateBtnLoadingState('printBill', true);
    const res = await fetchRequest({
      url: `/lab/${labId}/patient_entry/${patientId}/download_receipt`,
      method: 'GET',
      isAuth: true,
    });
    res && updateBtnLoadingState('printBill', false);
    if (res && res.status === 200) {
      const data = await res.blob();
      const file = new Blob([data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      const downloadLink = document.createElement('a');
      const fileName = `${patient?.full_name || 'patient'}_bill.pdf`;
      downloadLink.href = fileURL;
      downloadLink.download = fileName;
      downloadLink.click();
      return data;
    } else {
      const errObj = await res.json();
      setError({ ...errObj.errors });
      res.status !== 422 &&
        !Object.keys(errObj.error ? errObj.error : {}).length &&
        errObj.message &&
        setNotification({ show: true, message: errObj.message, type: 'error' });
    }
  }, [labId, patientId, patient]); // eslint-disable-line react-hooks/exhaustive-deps

  const printReport = useCallback(
    async (printValues, patient) => {
      setError({});
      updateBtnLoadingState('printReport', true);

      const res = await fetchRequest({
        url: `/lab/${labId}/appointment/${printValues}/report`,
        method: 'GET',
        isAuth: true,
      });
      // const res = await fetchRequest({
      //   url: `/patient/${patient}/reports/${printValues}/download_receipt`,
      //   method: 'GET',
      //   isAuth: true,
      // });
      res && updateBtnLoadingState('printReport', false);
      if (res && res.status === 200) {
        const data = await res.blob();
        const file = new Blob([data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        const downloadLink = document.createElement('a');
        const fileName = `${patient?.full_name || 'patient'}_report.pdf`;
        downloadLink.href = fileURL;
        downloadLink.download = fileName;
        downloadLink.click();
        return data;
      } else {
        const errObj = await res.json();
        setError({ ...errObj.errors });
        res.status !== 422 &&
          !Object.keys(errObj.error ? errObj.error : {}).length &&
          errObj.message &&
          setNotification({ show: true, message: errObj.message, type: 'error' });
      }
    },
    [labId, patientId, patient],
  );

  const getTestsAccordionData = useMemo(
    () =>
      reportValues.map((item, ind) => {
        const {
          report_sent,
          test_remark,
          appt_sub_tests,
          name,
          report_type,
          test_type,
          interpretation,
          technique,
          method,
          note,
          test_id,
          unit,
          test_validation,
          showRangeColumn,
          remark,
        } = item;
        return {
          className: report_sent ? 'report-sent-success' : '',
          renderCheckBox: (
            <CheckboxInput
              name="report-test"
              className="ml-2"
              checked={selectedTests.some(test => test.test_id === test_id)}
              blue
              onClick={() => {
                let tests = [...selectedTests];
                const ind = tests.findIndex(test => test.test_id === test_id);
                ind > -1 ? tests.splice(ind, 1) : tests.push(item);
                setSelectedTests(tests);
                tests.length === reportValues.length ? setSelectAllTests(true) : setSelectAllTests(false);
              }}
            />
          ),
          heading: (
            <div className="d-flex justify-content-between align-items-center w-100">
              <p>{name}</p>
              {report_sent && <i className="mr-5 semi-bold">Report Sent</i>}
            </div>
          ),
          body: (
            <div className="test-result-card">
              <table className="test-result-table">
                <thead>
                  <tr>
                    <th width="30%">Test</th>
                    <th width="45%">
                      Result
                    </th>
                    {showRangeColumn && (
                      <th className="text-center" width="25%">
                        Normal Range
                      </th>
                    )}
                  </tr>
                </thead>
                {item?.appt_sub_tests?.length ? (
                  appt_sub_tests.map((subTest, subInd) => {
                    const { unit, report_type, test_validation } = subTest;
                    return (
                      <tbody key={`tbody-${subInd}`}>
                        {subTest.test_type === 'group' ? (
                          <tr>
                            <td colSpan="3">
                              <b>{subTest.name}</b>
                            </td>
                          </tr>
                        ) : (
                          <></>
                        )}
                        {subTest?.appt_sub_tests?.length ? (
                          subTest.appt_sub_tests.map((groupTest, secSubInd) => {
                            const { unit, report_type, test_validation } = groupTest;
                            return (
                              <tr key={secSubInd} className="group-test-row">
                                <td>{groupTest.name}</td>
                                <td>
                                  {report_type.format?.presentation.result
                                    ? getInputs(
                                        { type: report_type.format.input_type, test_type, ...groupTest },
                                        report_sent,
                                        `result.${ind}.${subInd}.${secSubInd}`,
                                        report_type.name === 'Range' ? test_validation : null,
                                      )
                                    : '-'}
                                </td>
                                <td className="text-center">
                                  {report_type.name === 'Range'
                                    ? `${test_validation?.range_from ? test_validation.range_from : 'NA'} - ${
                                        test_validation?.range_to ? test_validation.range_to : 'NA'
                                      } ${unit?.name ? unit.name : ''}`
                                    : ''}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr key={subInd}>
                            <td>{subTest.name}</td>
                            <td>
                              {report_type.format?.presentation.result
                                ? getInputs(
                                    { type: report_type.format.input_type, test_type, ...subTest },
                                    report_sent,
                                    `result.${ind}.${subInd}`,
                                    report_type.name === 'Range' ? test_validation : null,
                                  )
                                : '-'}
                            </td>
                            <td className="text-center">
                              {report_type.name === 'Range'
                                ? `${test_validation?.range_from ? test_validation.range_from : 'NA'} - ${
                                    test_validation?.range_to ? test_validation.range_to : 'NA'
                                  } ${unit?.name ? unit.name : ''}`
                                : ''}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    );
                  })
                ) : (
                  <tbody>
                    <tr>
                      <td>{name}</td>
                      <td>
                        {report_type?.format.presentation.result
                          ? getInputs(
                              { type: report_type.format.input_type, test_type, ...item },
                              report_sent,
                              `result.${ind}`,
                              report_type.name === 'Range' ? test_validation : null,
                            )
                          : '-'}
                      </td>
                      <td className="text-center">
                        {report_type?.name === 'Range'
                          ? `${test_validation?.range_from ? test_validation.range_from : 'NA'} - ${
                              test_validation?.range_to ? test_validation.range_to : 'NA'
                            } ${unit?.name ? unit.name : ''}`
                          : ''}
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
              {interpretation && <Details label="Interpretation" value={parse(interpretation)} className="editor-content"/>}
              {method && <Details label="Method" value={parse(method)} className="editor-content"/>}
              {technique && <Details label="Technique" value={parse(technique)} className="editor-content"/>}
              {note && <Details label="Note" value={parse(note)} className="editor-content"/>}
              {test_remark && <Details label="Remark" value={parse(test_remark)} className="editor-content"/>}
              {report_sent ? (
                <Details label="Lab Remarks" value={remark || '-'}/>
              ) : (
                <Details label="Lab Remarks">
                  <div className="form-group value fr">
                    <Textarea
                      value={remark || ''}
                      onChange={e => handleChange(test_type, test_id, e.target.value, 'remark')}
                      //   error={errors && errors['remark']}
                    />
                  </div>
                </Details>
              )}
              <div className="col-12">
                <div className="w-100 d-flex justify-content-center mt-4">
                  <OutlinedButton
                    className="mr-2"
                    red
                    // onClick={() => cancelTests(test_type, test_id)}
                    onClick={() => handleModalToggle(false)}
                    disabled={report_sent || btnLoading['test']}
                  >
                    Cancel
                  </OutlinedButton>
                  <OutlinedButton
                    className=""
                    blue
                    onClick={() => saveTests(test_type, test_id)}
                    disabled={report_sent || btnLoading['test']}
                    loading={btnLoading['test']}
                  >
                    Save
                  </OutlinedButton>
                </div>
              </div>
            </div>
          ),
        };
      }),
    [reportValues, selectedTests, btnLoading], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const patientState = useMemo(
    () => ({
      tests: selectedTests,
      patient,
      lab,
      referred_by,
      created_at,
      labId,
      patientId,
      formatted_created_at,
      testIds: selectedTests.length
        ? selectedTests.reduce((acc, curr) => {
            acc.push(curr.test_id);
            return acc;
          }, [])
        : [],
    }),
    [selectedTests, patient, lab, labId, patientId], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const { full_name = '', gender = '', age = '' } = patient ? patient : {};
  return (
    <CustomModal
      className="modal-large"
      modalIsOpen={modal}
      backdropClose
      closeModal={() => {
        setSelectedTests([]);
        handleModalToggle(false);
      }}
    >
      <form className="add-details-form add-details-form-wrapper update-patient-form pt-3">
        <ModalBody>
          <div className="modal-fixedHeader">
            <div className="d-flex modal-fixedinnerHeader">
              <div className="d-flex justify-content-between w-100 p-3">
                <Details label="Patient Name" value={full_name} />
                <Details label="Age / Sex" value={`${age}/${gender}`} />
                <Details label="Referred Doctor" value={referred_by?.full_name || 'Self'} />
                <Details label="Date" value={created_at} />
              </div>
              <span
                onClick={() => {
                  setSelectedTests([]);
                  handleModalToggle(false);
                }}
                className="cross-icon"
              ></span>
            </div>
          </div>
          <div className="content mb-4">
            <Accordion cardClass="mb-3" className="test-result-acc" testAccordion data={getTestsAccordionData} />
          </div>
        </ModalBody>
        <ModalFooter className="justify-content-center align-items-center py-2 px-3 bg-grey">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="select_all">
              <CheckboxInput
                name="select-all"
                label={selectAllTests ? "Unselect All" : "Select All"}
                checked={selectAllTests}
                blue
                onClick={() => {
                  let tests = [];
                  !selectAllTests && reportValues.map(test => tests.push(test));
                  setSelectedTests(tests);
                  setSelectAllTests(!selectAllTests);
                }}
              />
            </div>
            <div className="actions p-2">
              <OutlinedButton
                className="mr-3 download-report"
                onClick={printBill}
                black
                loading={btnLoading['printBill']}
                disabled={btnLoading['printBill']}
              >
                <div className="d-flex align-items-center">
                  <p className="mr-2">{DownloadReport}</p>
                  <p>Download Bill</p>
                </div>
              </OutlinedButton>
              <OutlinedButton
                className="mr-3"
                // onClick={() => {
                //   printReport(selectedTests, patientId);
                // }}
                link
                to={{ pathname: `/${localStorage.getItem('loginAs')}/report-preview`, state: patientState }}
                blue
                loading={btnLoading['printReport']}
                disabled={!selectedTests.length || btnLoading['printReport']} // !reportValues.some(report => report.report_sent)
              >
                <div className="d-flex align-items-center">
                  <p className="mr-2">{PrintReport}</p>
                  <p>Print Report</p>
                </div>
              </OutlinedButton>
              <ContainedButton onClick={sendRequest} disabled={!selectedTests.length} darkBlue>
                <div className="d-flex align-items-center">
                  <p className="mr-2">{SendReport}</p>
                  <p className="pt-1">Send Report</p>
                </div>
              </ContainedButton>
            </div>
          </div>
        </ModalFooter>
      </form>
    </CustomModal>
  );
};
export default UpdatePatientModal;
