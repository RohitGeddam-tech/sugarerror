import React, { useEffect, useState, useContext } from 'react';
import Card from '../../../../components/Common/Card/Card';
import { fetchRequest } from '../../../../utils/api';
import { rupeeSymbol } from '../../../../utils/constants';
import PieChart from '../../../../components/Graphs/PieChart';
import { compilePieChartData } from '../../../../utils/custom';
import { ProfileContext } from '../../../../context/context';

const Statistics = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAssistAdmin, setAssistAdmin] = useState(false);
  const { profile } = useContext(ProfileContext);
  useEffect(() => {
    getStats();
    if (profile && profile.selectedRole && profile.selectedRole?.role?.name === 'assistant_admin') {
      setAssistAdmin(true);
    }
  }, [profile]);

  const getStats = () => {
    setLoading(true);
    (async () => {
      const res = await fetchRequest({
        url: `/super_admin/dashboard/stats`,
        method: 'GET',
        isAuth: true,
      });

      if (res && res.status === 200) {
        setLoading(false);
        const data = await res.json();
        const temp = data.data;
        if (temp) {
          temp.lab_registration_graph = compilePieChartData(temp.lab_registration_graph);
          temp.client_conversion_graph = compilePieChartData(temp.client_conversion_graph);
        }
        setStats(data.data);
        return data;
      } else {
        setLoading(false);
      }
      return;
    })();
  };

  return (
    <div className="dashboard-container">
      <div className="row">
        <div className="col-md-4 col-12">
          <Card title="Labs Registered" isLoading={loading}>
            <PieChart data={stats.lab_registration_graph} legendPosition="bottom" height="280"></PieChart>
          </Card>
        </div>
        <div className="col-md-4 col-12">
          <Card title="Client conversion graph" isLoading={loading}>
            <PieChart data={stats.client_conversion_graph} height="220" width="320"></PieChart>
          </Card>
          <Card title="Total no. of patients registered" cardType="number" centerHeader={true} isLoading={loading}>
            {stats.total_registered_patients}
          </Card>
        </div>
        <div className="col-md-4 col-12">
          <Card title="Total no. of labs registered" cardType="number" centerHeader={true} isLoading={loading}>
            {stats.total_registered_lab}
          </Card>
          {!isAssistAdmin && (
            <Card title="Total Revenue" cardType="number" centerHeader={true} isLoading={loading}>
              {stats.total_revenue ? `${rupeeSymbol} ${stats.total_revenue}` : ''}
            </Card>
          )}
          <Card title="Total Credits Used" cardType="number" centerHeader={true} isLoading={loading}>
            {stats.total_credit_used}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
