import React, { useCallback, useEffect, useState } from 'react';
import { Filter, CalendarFilter } from '../../../../assets/icons';
import PathLabTable from './PathLabTable';
import useWindowSize from '../../../../hooks/userWindowSize';
import SearchBox from '../../../../components/Common/SearchBox/SearchBox';
import { fetchRequest } from '../../../../utils/api';
import ExportExcel from '../../../../components/ExportExcel/ExportExcel';
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

const PathLabsList = () => {
  /* eslint-disable no-unused-vars */
  const [width] = useWindowSize();
  const [pathLabList, setPathLabList] = useState({ data: [], pagination: {} });
  const [filter, setFilter] = useState({
    per_page: 15,
    current_page: 1,
    sort: [],
    date_from: moment().subtract(1, 'year').format('YYYY-MM-DD'),
    date_to: moment().format('YYYY-MM-DD'),
  });
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [packageData, setpackageData] = useState(['paid', 'free']);
  const [PackageFilter, setPackageFilter] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [CityFilter, setCityFilter] = useState([]);
  const [StatusFilter, setStatusFilter] = useState([]);
  const [AppliedFilters , setAppliedFilters] = useState([])
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [statusData, setStatusData] = useState(['Active', 'Inactive' , 'Package Expired']);
  const [PackageFilterAction, setPackageFilterAction] = useState(false);
  const [CityFilterAction, setCityFilterAction] = useState(false);
  const [StatusFilterAction, setStatusFilterAction] = useState(false);
  const [start, setState] = useState({ start: moment(), end: moment() });
  const [update , setUpdate] = useState(null)

  const getSelectedData = useCallback(data => setSelectedData(data), []);

  const getCityData = useCallback(() => {
    setLoading(true);
    const { per_page = 15, current_page, search, date_from, date_to, sort } = filter;
    if (per_page)
      (async () => {
        let url = `/super_admin/cities`;
        const res = await fetchRequest({ url, method: 'GET', isAuth: true });
        if (res && res.status === 200) {
          setLoading(false);
          const { data, meta } = await res.json();
          setCityData(data);
          return data;
        } else {
          setLoading(false);
        }
        return;
      })();
  }, []);

  //Status Filter

  const getStatusData = useCallback(() => {
    setLoading(true);
    const { per_page = 15, current_page, search, date_from, date_to, sort } = filter;
    if (per_page)
      (async () => {
        let url = `/super_admin/cities`;
        const res = await fetchRequest({ url, method: 'GET', isAuth: true });
        if (res && res.status === 200) {
          setLoading(false);
          const { data, meta } = await res.json();
          setCityData(data);
          return data;
        } else {
          setLoading(false);
        }
        return;
      })();
  }, []);

  const getData = useCallback(() => {
    setLoading(true);
    setStatusFilterAction(false);
    setPackageFilterAction(false)
    setCityFilterAction(false)
    for(let i=0; i < PackageFilter.length; i++) {
      if(!AppliedFilters.includes(PackageFilter[i])) {
        AppliedFilters.push(PackageFilter[i])
      }
    }
    for(let i=0; i < StatusFilter.length; i++) {
      if(!AppliedFilters.includes(StatusFilter[i])) {
        AppliedFilters.push(StatusFilter[i])
      }
    }
    for(let i=0; i < CityFilter.length; i++) {
      if(!AppliedFilters.includes(CityFilter[i])) {
        AppliedFilters.push(CityFilter[i])
      }
    }

    const { per_page = 15, current_page, search, date_from, date_to, sort } = filter;
    if (per_page)
      (async () => {
        let url = `/super_admin/labs?per_page=${per_page}${current_page ? `&page=${current_page}` : ''}${
          CityFilter.length !== 0 ? `&cities=${giveCityFilter()}` : ''
        }${StatusFilter.length !== 0 ? `&status=${giveStatusFilter()}` : ''}${
          PackageFilter.length !== 0 ? `&package_type=${givePackageFilter()}` : ''
        }${search ? `&search=${search}` : ''}${date_from ? `&date_from=${date_from}` : ''}${date_to ? `&date_to=${date_to}` : ''}${sort && sort.length ? sort.map(item => `&${item.key}=${item.value}`).join('') : ''}`;
        const res = await fetchRequest({ url, method: 'GET', isAuth: true });
        if (res && res.status === 200) {
          setLoading(false);
          const { data, meta } = await res.json();
          setPathLabList({ data, pagination: meta.pagination });
          return data;
        } else {
          setLoading(false);
        }
        return;
      })();
  }, [filter]);

  useEffect(() => {
    getData();
  }, [filter, getData]);

  useEffect(() => {
    getCityData();
    getStatusData();
  },[])

  const handleCallback = (start, end) => {
    setState({ start, end });
    setFilter({
      ...filter,
      current_page: 1,
      date_from: moment(start._d).format('YYYY-MM-DD'),
      date_to: moment(end._d).format('YYYY-MM-DD'),
    });
  };

  const label = filter.date_from && moment(filter.date_from).format('DD-MM-YYYY') + ' to ' + moment(filter.date_to).format('DD-MM-YYYY');

  const ranges = {
    Today: [moment().toDate(), moment().toDate()],
    Yesterday: [moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()],
    'This Month': [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
    'Last 7 Days': [moment().subtract(6, 'days').toDate(), moment().toDate()],
    'Last 30 Days': [moment().subtract(29, 'days').toDate(), moment().toDate()],
    'Last 6 Months': [moment().subtract(6, 'months').toDate(), moment().toDate()],
    'Last 1 Year': [moment().subtract(1, 'year').toDate(), moment().toDate()],
  };

  const pushFilter = (e, filtername, data) => {
    
    if (filtername === 'City') {
      if (!CityFilter.includes(data)) {
        CityFilter.push(data);
        setUpdate({status:true,data:data})
      } else {
        for (let i = 0; i < CityFilter.length; i++) {
          if (data === CityFilter[i]) {
            CityFilter.splice(i, 1);
            setUpdate({status:false,data:data})
          }
        }

      }
    } else if (filtername === 'Status') {
      if (!StatusFilter.includes(data)) {
        StatusFilter.push(data);
        setUpdate({status:true,data:data})
      } else {
        for (let i = 0; i < StatusFilter.length; i++) {
          if (data === StatusFilter[i]) {
            StatusFilter.splice(i, 1);
            setUpdate({status:false,data:data})
          }
        }

      }
    } else {
      if (!PackageFilter.includes(data)) {
        PackageFilter.push(data);
        setUpdate({status:true,data:data})
      } else {
        for (let i = 0; i < PackageFilter.length; i++) {
          if (data === PackageFilter[i]) {
            PackageFilter.splice(i, 1);
            setUpdate({status:false,data:data})
          }
        }

      }
    }
  };

  const mapCities = () => {
    let AvailabelCities = cityData.map(items => {
      return (
        <div key={items}>
          <label >
            <input onChange={e => pushFilter(e, 'City', items)} checked={CityFilter.includes(items) ? true : false} type="checkbox" /> {items}
          </label>
        </div>
      );
    });
    return AvailabelCities;
  };

  const giveCityFilter = () => {
    let Branches = '';
    CityFilter.forEach(items => {
      if (Branches === '') {
        Branches = items;
      } else {
        Branches = Branches + ',' + items;
      }
    });
    return Branches;
  };

  const mapStatus = () => {
    let AvailabelCities = statusData.map(items => {
      return (
        <div key={items}>
          <label>
            <input onChange={e => pushFilter(e, 'Status', items)} checked={StatusFilter.includes(items) ? true : false} type="checkbox" /> {items}
          </label>
        </div>
      );
    });
    return AvailabelCities;
  };

  const giveStatusFilter = () => {
    let status = '';
    StatusFilter.forEach(items => {
      if (status === '') {
        status = items;
      } else {
        status = status + ',' + items;
      }
    });
    return status;
  };

  const mapPackage = () => {
    let AvailabelPackage = packageData.map(items => {
      return (
        <div key={items}>
          <label key={items}>
            <input onChange={e => pushFilter(e, 'Package', items)} checked={PackageFilter.includes(items) ? true : false} type="checkbox" /> {items}
          </label>
        </div>
      );
    });
    return AvailabelPackage;
  };

  const givePackageFilter = () => {
    let status = '';
    PackageFilter.forEach(items => {
      if (status === '') {
        status = items;
      } else {
        status = status + ',' + items;
      }
    });
    return status;
  };

  const clearAllFilter = (type) => {
    if(type === 'remove_filter') {
    CityFilter.length = 0;
    getData()
    for(let i=0; i < selectedFilters.length; i++) {
      if(selectedFilters[i] === 'City') {
         selectedFilters.splice(i,1)
      }
    }
    setCityFilterAction(false);
    }else {
      let applied =[]
        for(let i=0; i<CityFilter.length; i++) {
          if(AppliedFilters.includes(CityFilter[i])) {
            applied.push(CityFilter[i])
          }
        }
        CityFilter.length=0
        setCityFilter([...CityFilter , ...applied])
        if(CityFilter.length === 0) {
          for(let i=0; i< selectedFilters.length; i++) {
            if(selectedFilters[i] === 'City') {
               selectedFilters.splice(i,1)
            }
          }
        }
      setCityFilterAction(false);
    }
  };

  const clearPackageFilter = (type) => {
    if(type === 'remove_filter') {
      PackageFilter.length = 0;
      getData()
      for(let i=0; i < selectedFilters.length; i++) {
        if(selectedFilters[i] === 'Package Type') {
           selectedFilters.splice(i,1)
        }
      }
      setPackageFilterAction(false);
    }
    else {
        let applied =[]
        for(let i=0; i<PackageFilter.length; i++) {
          if(AppliedFilters.includes(PackageFilter[i])) {
            applied.push(PackageFilter[i])
          }
        }
        PackageFilter.length=0
        setPackageFilter([...PackageFilter , ...applied])
        if(PackageFilter.length === 0) {
          for(let i=0; i< selectedFilters.length; i++) {
            if(selectedFilters[i] === 'Package Type') {
               selectedFilters.splice(i,1)
            }
          }
        }
       setPackageFilterAction(false);
    }
  }

  const clearAllStatusFilter = (type) => {
    if(type === 'remove_filter') {
    StatusFilter.length = 0;
    getData()
    for(let i=0; i < selectedFilters.length; i++) {
      if(selectedFilters[i] === 'Status') {
         selectedFilters.splice(i,1)
      }
    }
    setStatusFilterAction(false);
    }else {
      let applied =[]
        for(let i=0; i<StatusFilter.length; i++) {
          if(AppliedFilters.includes(StatusFilter[i])) {
            applied.push(StatusFilter[i])
          }
        }
        StatusFilter.length=0
        setStatusFilter([...StatusFilter , ...applied])
        if(StatusFilter.length === 0) {
          for(let i=0; i< selectedFilters.length; i++) {
            if(selectedFilters[i] === 'Status') {
               selectedFilters.splice(i,1)
            }
          }
        }
    setStatusFilterAction(false);
    }
  };

  const openFilterAction = (status, type) => {
    if (type === 'Status') {
      setStatusFilterAction(true);
      setCityFilterAction(false);
      setPackageFilterAction(false);
      if(!selectedFilters.includes('Status')) {
        selectedFilters.push(type)
      }
      setSelectedFilters(setSelectedFilters);
    } else if (type === 'City') {
      setCityFilterAction(true);
      setPackageFilterAction(false);
      setStatusFilterAction(false)
      if(!selectedFilters.includes('City')) {
        selectedFilters.push(type)
      }
      setSelectedFilters(setSelectedFilters);
    } else if (type === 'Package Type') {
      setPackageFilterAction(true);
      setStatusFilterAction(false)
      setCityFilterAction(false);
      if(!selectedFilters.includes('Package Type')) {
        selectedFilters.push(type)
        }
      setSelectedFilters(setSelectedFilters);
    }
  };
  return (
    <div className="paper card list-path-lab-container list-container">
      <div className="content-header">
        <div className="row">
          <div className="col-6 col-md-2">
            <p className="semi-bold title">All Path Labs</p>
          </div>
          <div className="col-6 col-md-2">
            <div className="form-group text-right">
              {/* <OutlinedButton className="export-excel" onClick={exportExcel}>
                Export Excel
              </OutlinedButton> */}
              <ExportExcel path={'/super_admin/labs_export'} filter={filter} selectedData={selectedData} />
            </div>
          </div>

          <div className="col-md-4 customDatePicker-wrapper">
            <DateRangePicker
              className="customDatePicker"
              id="customDatePicker"
              initialSettings={{
                maxDate: new Date(),
                startDate: moment().subtract(1, 'year').toDate(),
                endDate: moment().toDate(),
                ranges: ranges,
                autoUpdateInput: true,
              }}
              onCallback={handleCallback}
            >
              <div className="customDatePicker-innerwrapper">
                <span className={label ? 'range-value' : 'range-placeholder'}>{label ? label : 'Select Range'}</span>
                <label className="table-icon d-inline">{CalendarFilter}</label>
              </div>
            </DateRangePicker>
          </div>
          <div className="push-4 col-md-4">
            <SearchBox setFilter={setFilter} filter={filter} placeholder="Search by Name or Mobile No." />
          </div>
        </div>
        {width <= 768 ? (
          <div className="d-flex justify-content-end mr-2 filter">
            <p className="mr-1">{Filter}</p> <p>Filter</p>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="content-body">
      {CityFilterAction === true ? (
            <div className="filter_container">
              <div className='filter_subcontainer_reff'>
                {mapCities()}
              </div>
                <div className='filter_options'>
                  <span onClick={() => clearAllFilter('remove_filter')} style={{ color: 'rgba(223, 116, 106, 1)' }}>
                    Remove filter
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span onClick={() => clearAllFilter('cancel')}>Cancel</span>
                    {CityFilter.length === 0 ?
                    <span style={{ paddingLeft: 10 }}>
                      Apply
                    </span>
                     :
                     <span onClick={() => getData()} style={{ paddingLeft: 10 , color:'blue' }}>
                      Apply
                    </span>
}
                  </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {PackageFilterAction === true ? (
            <div className="filter_container_pac">
              <div className='filter_subcontainer_reff'>
                {mapPackage()}
              </div>
                <div className='filter_options'>
                  <span onClick={() => clearPackageFilter('remove_filter')} style={{ color: 'rgba(223, 116, 106, 1)' }}>
                    Remove filter
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span onClick={() => clearPackageFilter('calcel')}>Cancel</span>
                    {PackageFilter.length === 0 ?
                    <span style={{ paddingLeft: 10 }}>
                      Apply
                    </span>
                     :
                     <span onClick={() => getData()} style={{ paddingLeft: 10,color:'blue' }}>
                        Apply
                      </span>
                      }
                  </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}

          {StatusFilterAction === true ? (
            <div className="filter_container_status">
              <div className='filter_subcontainer_reff'>
                {mapStatus()}
              </div>
                <div className='filter_options'>
                  <span onClick={() => clearAllStatusFilter('remove_filter')} style={{ color: 'rgba(223, 116, 106, 1)' }}>
                    Remove filter
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span onClick={() => clearAllStatusFilter('cancel')}>Cancel</span>
                    {StatusFilter.length === 0 ?  
                    <span style={{ paddingLeft: 10 }}>
                      Apply
                    </span>
                     :
                     <span onClick={() => getData()} style={{ paddingLeft: 10,color:'blue' }}>
                        Apply
                      </span>
                    }
                  </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        <PathLabTable
          setFilter={setFilter}
          selectedFilters={selectedFilters}
          openFilterAction={openFilterAction}
          filter={filter}
          isLoading={loading}
          list={pathLabList}
          getSelectedData={getSelectedData}
        />
      </div>
    </div>
  );
};
export default PathLabsList;
