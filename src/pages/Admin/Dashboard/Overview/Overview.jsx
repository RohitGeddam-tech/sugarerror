import React, { useEffect, useState } from 'react';
import Table from '../../../../components/Table/Table';
import { Chat } from '../../../../assets/icons';
import Card from '../../../../components/Common/Card/Card';
import { fetchRequest } from '../../../../utils/api';
import { rupeeSymbol } from '../../../../utils/constants';
import Notification from '../../../../components/Notification/Notification';

const recentRegcolumnDefs = [
  {
    label: 'Date',
    accessKey: 'date',
  },
  {
    label: 'Name',
    accessKey: 'name',
    classes: 'main-content semi-bold',
  },
  {
    label: 'Package Name',
    accessKey: 'package_name',
  },
];

const dropdown1 = [
  { label: 'Paid', value: 'paid' },
  { label: 'Trial', value: 'trial' },
];

const dropdown2 = [
  { label: 'By days', value: 'days' },
  { label: 'By Patient Credit', value: 'credits' },
];

const defaultLoadingState = {
  all: false,
  recentRegistration: false,
  packageToExpire: false,
  todaysRegistration: false,
};

const Overview = () => {
  const [recentRegistration, setRecentRegistration] = useState([]);
  const [packageToExpire, setPackageToExpire] = useState([]);
  const [todaysRegistration, setTodaysRegistration] = useState([]);
  const [todaysRevenue, setTodaysRevenue] = useState([]);
  const [filter, setFilters] = useState({});
  const { registrationFilter, expireFilter, countFilter } = filter;
  const [loading, setLoading] = useState({
    ...defaultLoadingState,
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const packageToExpirecolumnDefs = [
    {
      label: 'Name',
      accessKey: 'name',
      classes: 'main-content semi-bold',
    },
    {
      label: 'Package Name',
      accessKey: 'package_name',
    },
    {
      label: expireFilter && expireFilter.value === 'credits' ? 'Credits' : 'Days Left',
      accessKey: expireFilter && expireFilter.value === 'credits' ? 'credits' : 'days_left',
    },
    {
      label: 'Action',
      accessKey: 'more',
      renderIconText: 'Send a reminder SMS',
      cellRenderer: row => (
        <span className="cursor-pointer" onClick={() => sendPackageExpiryMessage(row.uuid)}>
          {Chat}
        </span>
      ),
    },
  ];

  useEffect(() => {
    getOverviewData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    registrationFilter && getRecentRegistration();
  }, [registrationFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    expireFilter && getPackageToExpire();
  }, [expireFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    countFilter && getTodaysRegistration();
  }, [countFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateLoadingState = (key, isLoading) => {
    const tempLoader = { ...loading };
    tempLoader[key] = isLoading;
    setLoading(tempLoader);
  };

  const getOverviewData = () => {
    updateLoadingState('all', true);
    (async () => {
      const res = await fetchRequest({
        url: '/super_admin/dashboard/overview',
        method: 'GET',
        isAuth: true,
      });

      if (res && res.status === 200) {
        updateLoadingState('all', false);
        const data = await res.json();
        const { recent_registration, package_about_to_expire, todays_registration_count, todays_revenue } = data.data;
        recent_registration && recent_registration.data.length && setRecentRegistration([...recent_registration.data]);
        package_about_to_expire && package_about_to_expire.data.length && setPackageToExpire([...package_about_to_expire.data]);
        setTodaysRegistration(todays_registration_count.data);
        setTodaysRevenue(todays_revenue);

        return data;
      } else {
        updateLoadingState('all', false);
      }
      return;
    })();
  };

  const sendPackageExpiryMessage = labId => {
    (async () => {
      const res = await fetchRequest({
        url: `/super_admin/dashboard/overview/package_about_to_expire_msg/${labId}`,
        method: 'POST',
        isAuth: true,
      });

      if (res && res.status === 200) {
        const data = await res.json();
        data.message &&
          setNotification({
            show: true,
            message: data.message,
            type: 'success',
          });
        return data;
      } else {
        const errObj = await res.json();
        res.status !== 422 &&
          !Object.keys(errObj.error ? errObj.error : {}).length &&
          errObj.message &&
          setNotification({ show: true, message: errObj.message, type: 'error' });
      }
      return;
    })();
  };

  const getRecentRegistration = () => {
    updateLoadingState('recentRegistration', true);
    (async () => {
      let key = registrationFilter.value;
      const res = await fetchRequest({ url: `/super_admin/dashboard/overview/recent_registration/${key}`, method: 'GET', isAuth: true });

      if (res && res.status === 200) {
        updateLoadingState('recentRegistration', false);
        const data = await res.json();
        setRecentRegistration(data.data);
        return data;
      } else {
        updateLoadingState('recentRegistration', false);
      }
      return;
    })();
  };

  const getPackageToExpire = () => {
    updateLoadingState('packageToExpire', true);
    (async () => {
      let key = expireFilter.value;
      const res = await fetchRequest({
        url: `/super_admin/dashboard/overview/package_about_to_expire/${key}`,
        method: 'GET',
        isAuth: true,
      });
      if (res && res.status === 200) {
        updateLoadingState('packageToExpire', false);
        const data = await res.json();
        setPackageToExpire(data.data);
        return data;
      } else {
        updateLoadingState('packageToExpire', false);
      }
      return;
    })();
  };

  const getTodaysRegistration = () => {
    updateLoadingState('todaysRegistration', true);
    (async () => {
      let key = countFilter.value;
      const res = await fetchRequest({
        url: `/super_admin/dashboard/overview/todays_registration_count/${key}`,
        method: 'GET',
        isAuth: true,
      });

      if (res && res.status === 200) {
        updateLoadingState('todaysRegistration', false);
        const data = await res.json();
        setTodaysRegistration(data.data.count);
        return data;
      } else {
        updateLoadingState('todaysRegistration', false);
      }
      return;
    })();
  };

  const handleChange = (value, key) => {
    let data = { ...filter };
    data[key] = value;
    setFilters({ ...data });
  };

  return (
    <div className="dashboard-container">
      <Notification {...notification} />
      <div className="row">
        <div className="col-md-4 col-12 wd-35">
          <Card
            title="Recent Registrations"
            list={dropdown1}
            value={registrationFilter || Object.assign({}, dropdown1[0])}
            onSelectInputChange={value => handleChange(value, 'registrationFilter')}
          >
            <Table
              columnDefs={recentRegcolumnDefs}
              tableData={recentRegistration}
              footerLink={`/${localStorage.getItem('loginAs')}/path-labs/list`}
              isLoading={loading['all'] || loading['recentRegistration']}
            />
          </Card>
        </div>
        <div className="col-md-4 col-12 centered-content wd-35">
          <Card
            title="Packages about to expire"
            list={dropdown2}
            value={expireFilter || Object.assign({}, dropdown2[0])}
            onSelectInputChange={value => handleChange(value, 'expireFilter')}
          >
            <Table
              columnDefs={packageToExpirecolumnDefs}
              tableData={packageToExpire}
              footerLink={`/${localStorage.getItem('loginAs')}/path-labs/list`}
              isLoading={loading['all'] || loading['packageToExpire']}
            />
          </Card>
        </div>
        <div className="col-md-4 col-12 wd-30">
          <Card
            title="Today’s Registration Count"
            list={dropdown1}
            value={countFilter || Object.assign({}, dropdown1[0])}
            onSelectInputChange={value => handleChange(value, 'countFilter')}
            cardType="number"
            isLoading={loading['all'] || loading['todaysRegistration']}
          >
            {todaysRegistration}
          </Card>
          <Card title="Today’s Revenue" cardType="number" centerHeader={true} isLoading={loading['all']}>
            {rupeeSymbol} {todaysRevenue}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Overview;
