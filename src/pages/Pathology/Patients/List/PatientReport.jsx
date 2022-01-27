import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ContainedButton } from '../../../../components/Buttons/Button';
import CheckboxInput from '../../../../components/FormInputs/Checkbox/CheckboxInput';
import { ProfileContext } from '../../../../context/context';
import { fetchRequest } from '../../../../utils/api';
import PdfDocument from './PdfDocument';
import { BlobProvider} from '@react-pdf/renderer';
import { formatReportValues } from '../../../../utils/custom';

const PatientReport = () => {
  const loginAs = localStorage.getItem('loginAs');
  const history = useHistory();
  const reportState = history.location.state ? history.location.state : {};
  const { profile } = useContext(ProfileContext);
  const [testData, setTestData] = useState({});
  const [reportData, setReportData] = useState({
    letterhead_type: 'default',
    logo: { imagePreviewUrl: '' },
    letterhead: {},
    footer: {},
    print_letterhead: false,
    techniciansSign: { technician_name: '', technician_degree: '', print_technician_sign: false },
    doctorsSign: { doctor_name: '', doctor_degree: '', print_doctor_sign: false },
  });

  const {patientId,labId,testIds} = reportState;
  const getDataById = useCallback(async () => {
    if (patientId && labId) {
      const res = await fetchRequest({ url: `/lab/${labId}/patient_entry/${patientId}`, method: 'GET', isAuth: true });
      if (res && res.status === 200) {
        const { data } = await res.json();
        if (data) {
          const selectedTests = data.appointment_test.filter(test=> testIds.includes(test.uuid));
          setTestData({ ...testData, ...reportState, tests: formatReportValues(data,selectedTests), patient: data.patient });
        }
        return data;
      } else {
        return;
      }
    }
  }, [patientId, labId, testData, reportState]);

  useEffect(() => {
    getDataById();
  }, []); 

  useEffect(() => {
    setTestData(reportState);
  }, [reportState]);

  const getBranchDetails = useCallback(
    url => {
      (async () => {
        const res = await fetchRequest({
          url,
          method: 'GET',
          isAuth: true,
        });
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
          setReportData({
            ...reportData,
            ...data,
            logo: { imgPath: logo },
            footer: { imgPath: footer },
            letterhead: { imgPath: letterhead, print_letterhead: print_letterhead },
            print_letterhead: print_letterhead,
            letterhead_type,
            techniciansSign: {
              technician_name,
              technician_degree,
              print_technician_sign: print_technician_sign,
              imgPath: technician_sign,
            },
            doctorsSign: { imgPath: doctor_sign, doctor_name, doctor_degree, print_doctor_sign: print_doctor_sign },
            email
          });
          return data;
        }
        return;
      })();
    },
    [profile?.selectedRole, reportData], // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    if (testData) {
      let url = null;
      if (loginAs === 'lab-admin' && testData.lab?.uuid) url = `/lab_group/${profile.selectedRole.uuid}/lab/${testData.lab.uuid}`;
      else if (loginAs === 'lab') url = `/lab/${profile.selectedRole.uuid}`;
      if (url) {
        getBranchDetails(url);
      }
    }
  }, [testData]); // eslint-disable-line react-hooks/exhaustive-deps
  const [show, setHide] = useState(true);

  const {
    letterhead_type,
    letterhead,
    techniciansSign,
    doctorsSign,
    print_letterhead,
    formatted_lab_name: labName,
    print_doctor_sign,
    print_technician_sign,
  } = reportData;

  const { tests, patient, formatted_created_at } = testData;

  let tempLetterHead = print_letterhead,
    tempDoctorSign = print_doctor_sign,
    tempTechSign = print_technician_sign;

  const handlePrint = () =>{
    window.frames['my-frame'] && window.frames['my-frame'].print();
  }

  return (
    <div className="report-card">
      <div className="row ml-5 mt-2 mb-4 align-items-center">
        <div className="col-10 d-flex report-preview-options">
          {letterhead_type === 'custom' && (
            <CheckboxInput
              className="mr-4"
              name="registerWithSameDetails"
              label={`${tempLetterHead ? 'Hide' : 'Show'} Letterhead and footer`}
              checked={tempLetterHead ? letterhead.print_letterhead === false : letterhead.print_letterhead === true}
              value={tempLetterHead ? letterhead.print_letterhead === false : letterhead.print_letterhead === true}
              onClick={() =>
                setReportData({
                  ...reportData,
                  letterhead: { ...letterhead, print_letterhead: letterhead.print_letterhead ? false : true },
                })
              }
              blue
            />
          )}
          {techniciansSign?.imgPath && (
            <CheckboxInput
              className="mr-4"
              name="registerWithSameDetails"
              label={`${tempTechSign ? 'Hide' : 'Show'} Technician’s Signature`}
              checked={tempTechSign ? techniciansSign.print_technician_sign === false : techniciansSign.print_technician_sign === true}
              value={tempTechSign ? techniciansSign.print_technician_sign === false : techniciansSign.print_technician_sign === true}
              onClick={() =>
                setReportData({
                  ...reportData,
                  techniciansSign: { ...techniciansSign, print_technician_sign: techniciansSign.print_technician_sign ? false : true },
                })
              }
              blue
            />
          )}
          {doctorsSign?.imgPath && (
            <CheckboxInput
              className="mr-5"
              name="registerWithSameDetails"
              label={`${tempDoctorSign ? 'Hide' : 'Show'} Doctor’s Signature`}
              value={tempDoctorSign ? doctorsSign.print_doctor_sign === false : doctorsSign.print_doctor_sign === true}
              checked={tempDoctorSign ? doctorsSign.print_doctor_sign === false : doctorsSign.print_doctor_sign === true}
              onClick={() =>
                setReportData({
                  ...reportData,
                  doctorsSign: { ...doctorsSign, print_doctor_sign: doctorsSign.print_doctor_sign ? false : true },
                })
              }
              blue
            />
          )}
          <div className="d-flex justify-content-end mb-3 ml-5">
          <ContainedButton lightBlue onClick={handlePrint}> 
            Print
          </ContainedButton>
          </div>
        </div>
        <BlobProvider document={ <PdfDocument data={{ tests, reportData, patient: { ...patient, formatted_created_at } }}></PdfDocument>}>
            {({ url }) => {
              return <iframe name="my-frame" id="my-frame" title="my-frame" style={{ width: 595, height: 845 }} src={url}></iframe>
            }}
          </BlobProvider>
      </div>
    </div>
  );
};

export default PatientReport;
