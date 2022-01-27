import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { DownloadReport } from '../../../assets/icons';
import Accordion from '../../../components/Accordion/Accordion';
import { ContainedButton } from '../../../components/Buttons/Button';
import Details from '../../../components/Details/Details';
import CheckboxInput from '../../../components/FormInputs/Checkbox/CheckboxInput';
import { ProfileContext } from '../../../context/context';
import { fetchRequest } from '../../../utils/api';
import { formatReportValues, isOutOfRange } from '../../../utils/custom';
import parse from 'html-react-parser';

const ViewReport = () => {
  const { profile } = useContext(ProfileContext);
  const history = useHistory();
  const [initials, setInitials] = useState({});
  const [error, setError] = useState({});
  const [reportValues, setReportValues] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectAllTests, setSelectAllTests] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const { reportId, patient, referred_by, created_at } = initials;

  const getDataById = useCallback(async () => {
    if (reportId) {
      setError(error);
      setNotification(notification);
      const res = await fetchRequest({ url: `/patient/${profile.selectedRole.uuid}/reports/${reportId}`, method: 'GET', isAuth: true });
      if (res && res.status === 200) {
        const { data } = await res.json();
        if (data) {
          setReportValues(formatReportValues(data));
          setInitials({ ...initials, ...data });
        }
        return data;
      }
    }
  }, [reportId, profile, initials]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (reportId) {
      setSelectAllTests(false);
      getDataById();
    }
  }, [reportId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    history.location.state && setInitials(history.location.state);
  }, [history]);

  const getResult = (test,rangeTest) => {
    const outOfRange = rangeTest && isOutOfRange(rangeTest, test.value);
    return <label className={outOfRange ? 'out-of-range' : ''}>{test.report_type.name == 'Pre-Defined Test Result' ? <label className="editor-content">{parse(test.value)}</label>: typeof test.value === 'string' ? test.value : test.value?.label}</label>
  };

  const getTestsAccordionData = useMemo(
    () =>
      reportValues.map(item => {
        const {
          test_remark,
          appt_sub_tests,
          name,
          report_type,
          report_sent,
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
          disable: !report_sent,
          renderCheckBox: (
            <CheckboxInput
              name="select-all"
              className="ml-2"
              checked={selectedTests.includes(test_id)}
              disabled={!report_sent}
              //   value={checkboxObj.key}
              blue
              onClick={() => {
                setSelectAllTests(false);
                let tests = [...selectedTests];
                tests.includes(test_id) ? tests.splice(tests.indexOf(test_id), 1) : tests.push(test_id);
                setSelectedTests(tests);
              }}
            />
          ),
          heading: (
            <div className="d-flex justify-content-between align-items-center w-100">
              <p>{name}</p>
              {report_sent && <i className="mr-5 semi-bold report-status">Report Available</i>}
            </div>
          ),
          body: (
            <div className="test-result-card">
              <table className="test-result-table">
                <thead className="on-mobile-hide">
                  <tr>
                    <th width="30%">Test</th>
                    <th width="45%">Result</th>
                    {showRangeColumn && (
                      <th className="text-center" width="25%">
                        Normal Range
                      </th>
                    )}
                  </tr>
                </thead>
                {item?.appt_sub_tests?.length ? (
                  appt_sub_tests.map((subTest, ind) => {
                    const { unit, report_type, test_validation } = subTest;
                    return (
                      <tbody key={ind}>
                        {subTest.test_type === 'group' ? (
                          <tr key={ind}>
                            <td colSpan="3" className="test-name">
                              <p>{subTest.name}</p>
                            </td>
                          </tr>
                        ) : (
                          <></>
                        )}
                        {subTest?.appt_sub_tests?.length ? (
                          subTest.appt_sub_tests.map((groupTest, ind) => {
                            const { unit, report_type, test_validation } = groupTest;
                            const isLast = (subTest.appt_sub_tests.length-1) === ind;
                            return (
                              <tr key={ind} className={`group-test-div ${groupTest.abnormal ? 'is-abnormal' : ''}`} >
                                <td>
                                  <p className="sub-test-name">{groupTest.name}</p>
                                  <p className="on-mobile-show default-range">
                                    {report_type.name === 'Range'
                                      ? `Normal Range: ${test_validation?.range_from ? test_validation.range_from : 'NA'} - ${
                                          test_validation?.range_to ? test_validation.range_to : 'NA'
                                        } ${unit?.name ? unit.name : ''}`
                                      : ''}
                                  </p>
                                </td>
                                <td className={`test-result ${report_type?.name === 'Range'?'range-test-result' : ''}`}>
                                  {report_type.format?.presentation.result
                                    ? typeof groupTest.value === 'string'
                                      ? groupTest.value
                                      : groupTest.value?.label
                                    : '-'}
                                </td>
                                <td className="text-center on-mobile-hide">
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
                          <tr key={ind} className={subTest.abnormal ? 'is-abnormal' : ''}>
                            <td>
                              <p className="sub-test-name">{subTest.name}</p>
                              <p className="on-mobile-show default-range">
                                {report_type.name === 'Range'
                                  ? `Normal Range: ${test_validation?.range_from ? test_validation.range_from : 'NA'} - ${
                                      test_validation?.range_to ? test_validation.range_to : 'NA'
                                    } ${unit?.name ? unit.name : ''}`
                                  : ''}
                              </p>
                            </td>
                            <td className={`test-result ${report_type?.name === 'Range'?'range-test-result' : ''}`}>
                              {report_type.format?.presentation.result
                                ? getResult(subTest,report_type.name === 'Range' ? test_validation : null,)
                                : '-'}
                            </td>
                            <td className="text-center on-mobile-hide">
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
                    <tr className={item.abnormal ? 'is-abnormal' : ''}>
                      <td>
                        <p className="sub-test-name">{name}</p>
                        <p className="on-mobile-show default-range">
                          {report_type?.name === 'Range'
                            ? `Normal Range: ${test_validation?.range_from ? test_validation.range_from : 'NA'} - ${
                                test_validation?.range_to ? test_validation.range_to : 'NA'
                              } ${unit?.name ? unit.name : ''}`
                            : ''}
                        </p>
                      </td>
                      <td className={`test-result ${report_type?.name === 'Range'?'range-test-result' : ''}`}>
                        {report_type?.format.presentation.result ? (typeof item.value === 'string' ? item.value : item.value?.label) : '-'}
                      </td>
                      <td className="text-center on-mobile-hide">
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
              {interpretation && <Details label="Interpretation" value={parse(interpretation)} className="editor-content" />}
              {method && <Details label="Method" value={parse(method)} className="editor-content" />}
              {technique && <Details label="Technique" value={parse(technique)} className="editor-content" />}
              {note && <Details label="Note" value={parse(note)} className="editor-content" />}
              {test_remark && <Details label="Remark" value={parse(test_remark)} className="editor-content" />}
              {remark && <Details label="Lab Remarks" value={remark} />}
            </div>
          ),
        };
      }),
    [reportValues, selectedTests],
  );
  const downloadReport = () => {
    reportValues.map(async item => {
      if (selectedTests.some(id => id === item.test_id)) {
        if (item.report_url) {
          const res = await fetchRequest({ url: item.report_url, method: 'GET', isAuth: true, withBaseUrl: 'true' });
          if (res && res.status === 200) {
            const data = await res.blob();
            const file = new Blob([data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            const downloadLink = document.createElement('a');
            const fileName = `${item.name}.pdf`;
            // downloadLink.href = fileURL;
            // downloadLink.download = fileName;
            // downloadLink.click();
            window.open(fileURL,"_blank");
            return data;
          }
        }
      }
    });
  };

  const downloadBill = useCallback(async () => {
    const res = await fetchRequest({
      url: `/patient/${profile.selectedRole.uuid}/reports/${reportId}/download_receipt
    `,
      method: 'GET',
      isAuth: true,
    });
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
    }
  }, [reportId, profile, patient]);

  const { full_name = '', gender = '', age = '' } = patient ? patient : {};
  return (
    <div className="report-wrapper pt-3 d-flex flex-column">
      <div className="view-report-top">
        <div className="d-flex mHide">
          <div className="d-flex justify-content-between w-100 p-3">
            <Details label="Patient Name" value={full_name} />
            <Details label="Age / Sex" value={`${age}/${gender}`} />
            <Details label="Referred Doctor" value={referred_by?.full_name || 'Self'} />
            <Details label="Date" value={created_at} />
          </div>
        </div>
        <div className="content mb-4 p-4">
          <Accordion cardClass="mb-3" className="test-result-acc" testAccordion data={getTestsAccordionData} />
        </div>
      </div>
      <div className="view-report-bottom justify-content-center align-items-center py-2 px-3 footer padRmM">
        <div className="d-flex justify-content-between align-items-center w-100 viewReport">
          <div className="select_all">
            <CheckboxInput
              name="select-all"
              label={selectAllTests ? "Unselect All" : "Select All"}
              checked={selectAllTests}
              blue
              onClick={() => {
                let tests = [];
                !selectAllTests && reportValues.map(({ test_id }) => tests.push(test_id));
                setSelectedTests(tests);
                setSelectAllTests(!selectAllTests);
              }}
              disabled={reportValues.some(item => !item.report_sent)}
            />
          </div>
          <div className="actions p-2">
            <ContainedButton onClick={downloadBill} darkBlue className="mr-2 download-bill-btn">
              <div className="d-flex align-items-center">
                <p className="mr-2">{DownloadReport}</p>
                <p className="pt-1">Download Bill</p>
              </div>
            </ContainedButton>
            <ContainedButton onClick={downloadReport} disabled={!selectedTests.length} black className="download-report-btn">
              <div className="d-flex align-items-center">
                <p className="mr-2">{DownloadReport}</p>
                <p className="pt-1">Download Report</p>
              </div>
            </ContainedButton>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ViewReport;
