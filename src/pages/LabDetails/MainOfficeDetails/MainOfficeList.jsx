import React, { useState, useEffect, useContext } from 'react';
import Card from '../../../components/Common/Card/Card';
import { Link } from 'react-router-dom';
import { fetchRequest } from '../../../utils/api';
import { ProfileContext } from '../../../context/context';
import Loader from '../../../components/Loader/Loader';

function MainOfficeDetails(props) {
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);
  const [labId, setLabId] = useState(null); //lab_group uuid from profile api
  const [mainOfficeData, setMainOfficeData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { labId } = props.location.state ? props.location.state : {};
    if (labId) {
      setLabId(labId);
    }
  }, [props]);

  useEffect(() => {
    if (profile && loginAs === 'lab-admin') {
      setLabId(profile.selectedRole.uuid);
    } else if (profile && (loginAs === 'super-admin' || loginAs === 'assistant-admin')) {
      setLabId(profile.selectedLabId);
    }
  }, [profile, loginAs]);

  useEffect(() => {
    if (labId)
      (async () => {
        setLoading(true);
        const res = await fetchRequest({ url: `/lab_group/${labId}`, method: 'GET', isAuth: true });
        if (res && res.status === 200) {
          setLoading(false);
          const { data } = await res.json();
          setMainOfficeData(data);
          return data;
        }
        return;
      })();
  }, [labId]);

  const { name, address_line_one, address_line_two, city, state, pincode, mobile, lab_group_id } = mainOfficeData;
  return (
    <>
      <Loader loading={loading} />
      {!loading && (
        <div className="d-flex flex-wrap lab-office-details-wrapper w-100">
          <div className="lab-office-details-card">
            <Card>
              <p className="semi-bold title">{name ? name : '-'}</p>
              <p className="my-2 lab-id">{`Lab ID: ${lab_group_id ? lab_group_id : '-'}`}</p>
              <address className="mt-2 mb-0">
                {address_line_one ? address_line_one : '-'}
                <br /> {address_line_two ? address_line_two : ''}
                <br /> {`${city ? city : '-'}, ${state ? state : '-'}`}
                <br /> {pincode ? pincode : '-'}
              </address>
              <div className="phone-no mb-2">Phone Number: {mobile ? mobile : '-'}</div>
              {loginAs === 'lab-admin' && (
                <Link className="edit-details-link" to={'/lab-admin/setting/edit-main-office-details'}>
                  Edit Office Details
                </Link>
              )}
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
export default MainOfficeDetails;
