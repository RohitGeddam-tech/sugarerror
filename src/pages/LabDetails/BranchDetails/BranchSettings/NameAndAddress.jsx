import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRequest } from '../../../../utils/api';
import { ProfileContext } from '../../../../context/context';
import Card from '../../../../components/Common/Card/Card';
import { TextButton } from '../../../../components/Buttons/Button';
import BranchAdd from '../BranchAdd';
import Loader from '../../../../components/Loader/Loader';

const NameAndAddress = () => {
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);
  const [labId, setLabId] = useState(); //lab_group uuid from profile api
  const { branchId } = useParams();
  const [branchDetails, setBranchDetails] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile && loginAs === 'lab-admin') {
      setLabId(profile.selectedRole.uuid);
    } else if (profile && (loginAs === 'super-admin' || loginAs === 'assistant-admin')) {
      setLabId(profile.selectedLabId);
    }
  }, [profile, loginAs]);

  const getBranchData = useCallback(async () => {
    setLoading(true);
    let url = `/lab_group/${labId}/lab/${branchId}`;
    if (loginAs === 'lab') url = `/lab/${profile.selectedRole.uuid}`;
    const res = await fetchRequest({ url, method: 'GET', isAuth: true });
    if (res && res.status === 200) {
      setLoading(false);
      const { data } = await res.json();
      setBranchDetails(data);
      return data;
    }
    return;
  }, [labId, branchId, profile.selectedRole.uuid, loginAs]);

  useEffect(() => {
    if ((loginAs === 'lab-admin' || loginAs === 'super-admin' || loginAs === 'assistant-admin') && labId && branchId) {
      getBranchData();
    }
  }, [labId, branchId, loginAs, getBranchData]);

  useEffect(() => {
    if (loginAs === 'lab' && profile.selectedRole.uuid) {
      getBranchData();
    }
  }, [profile.selectedRole.uuid, loginAs, getBranchData]);

  return (
    <>
      <Loader loading={loading} />
      {!loading && (
        <div className="d-flex flex-wrap branch-details-wrapper w-100">
          {profile.selectedRole.role.actual_role === 'lab_technician' ? (
            <div className="w-100 d-flex justify-content-center">Details not available</div>
          ) : isEditable ? (
            <BranchAdd
              branchDetails={branchDetails}
              isEdit={true}
              setIsEditable={setIsEditable}
              goBackUrl={`/lab-admin/setting/branch-settings/${branchId}/name-and-address`}
              onSuccessCallback={getBranchData}
            ></BranchAdd>
          ) : branchDetails ? (
            <div className="branch-details-card">
              <Card title={branchDetails.name || '-'}>
                <address className="mt-2 mb-0">
                  {`${branchDetails.address_line_one || '-'}, ${branchDetails.address_line_two || ''}, `}
                  <br/>{`${branchDetails.city || '-'}, ${branchDetails.state || '-'}, ${branchDetails.pincode || '-'}`}
                </address>
                <div className="phone-no mb-2">Phone Number: {branchDetails.mobile || '-'}</div>
                {(loginAs === 'lab-admin' || profile?.selectedRole?.role.actual_role === 'lab_manager') && (
                  <div className="d-flex align-items-center fixed-bottom">
                    <TextButton className="link-btn semi-bold blue-text" onClick={() => setIsEditable(true)}>
                      Edit Name & Address
                    </TextButton>
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
};

export default NameAndAddress;
