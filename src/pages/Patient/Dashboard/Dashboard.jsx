import React, { useContext, useEffect, useState } from 'react';
import Table from '../../../components/Table/Table';
import Card from '../../../components/Common/Card/Card';
import { fetchRequest } from '../../../utils/api';
import { ProfileContext } from '../../../context/context';
import { rupeeSymbol } from '../../../utils/constants';
import { OutlinedButton } from '../../../components/Buttons/Button';
import {  NextArrow } from '../../../assets/icons';
import MobileCard from '../MobileCard';

const recentReportscolumnDefs = [
  {
    label: 'Date / Time',
    accessKey: 'created_at',
    width: '12%',
  },
  {
    label: 'Lab Name',
    accessKey: 'lab.name',
    classes: 'main-content semi-bold',
    width: '15%',
  },
  {
    label: 'Patient Name',
    accessKey: 'patient.full_name',
    classes: 'patient-name',
    width: '18%',
  },
  {
    label: 'Tests',
    cellRenderer: ({ tests }) => tests.map((test, ind) => (ind === tests.length - 1 ? test : test + ', ')),
    width: '30%',
  },
  {
    label: 'Costs',
    cellRenderer: ({ total_payable }) => rupeeSymbol + ' ' + total_payable,
    width: '15%',
  },
  {
    label: 'Status',
    width: '10%',
    cellRenderer: ({ appointment_status }) => (
      <OutlinedButton className={`patient-status-btn ${appointment_status.name}`}>{appointment_status.formatted_name}</OutlinedButton>
    ),
  },
  // {
  //   label: '',
  //   accessKey: 'more',
  //   isMobile: false,
  //   cellRenderer: row => (
  //     <div className="d-flex align-items-center">
  //       <Popover button={<p className="table-icon">{More}</p>} className="view-detail-popover">
  //         <Link
  //           to={{ pathname: `/${localStorage.getItem('loginAs')}/lab-details/main-office-details` }}
  //           className={`hover-black py-1`}
  //           onClick={() => {
  //             localStorage.setItem('selectedLabId', row.uuid);
  //             setProfileData({ ...profile, selectedLabId: row.uuid });
  //           }}
  //         >
  //           View Lab Details
  //         </Link>
  //       </Popover>
  //     </div>
  //   ),
  // },
];

const pendingPaymentscolumnDefs = [
  {
    label: 'Date / Time',
    accessKey: 'created_at',
    classes: 'main-content semi-bold',
  },
  {
    label: 'Lab Name',
    accessKey: 'lab.name',
  },
  {
    label: 'Amount',
    cellRenderer: ({ total_balance }) => rupeeSymbol + ' ' + total_balance,
  },
];

const Dashboard = () => {
  const { profile } = useContext(ProfileContext);
  const [recentReports, setRecentReports] = useState([]);
  const [pendingPayment, setPendingPayment] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const getOverviewData = () => {
      (async () => {
        setLoading(true);
        const res = await fetchRequest({
          url: `/patient/${profile.selectedRole.uuid}/dashboard`,
          method: 'GET',
          isAuth: true,
        });
        res && setLoading(false);
        if (res && res.status === 200) {
          const data = await res.json();
          const { recent_reports, pending_payments } = data.data;
          recent_reports && recent_reports.length && setRecentReports([...recent_reports]);
          pending_payments && pending_payments.length && setPendingPayment([...pending_payments]);
          return data;
        }
        return;
      })();
    };
    getOverviewData();
  }, [profile]);

  return (
    <div className="dashboard-container patient-dashboard-container">
      <div className="row">
        <div className="col-lg-12 col-xl-8 col-12">
          <Card title="Recent Reports">
            <Table
              isLoading={loading}
              columnDefs={recentReportscolumnDefs}
              tableData={recentReports}
              footerLink={`/${localStorage.getItem('loginAs')}/reports-and-bills`}
              isButtonCard={<span>{NextArrow}</span>}
              MobileCardComponent={MobileCard}
            />
          </Card>
        </div>
        <div className="col-lg-12 col-xl-4 col-12 centered-content">
          <Card title="Pending Payments">
            <Table columnDefs={pendingPaymentscolumnDefs} tableData={pendingPayment} isLoading={loading} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
