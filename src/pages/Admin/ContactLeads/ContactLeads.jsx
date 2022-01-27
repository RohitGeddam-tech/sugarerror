import React, { useState, useCallback, useEffect } from 'react';
import { Checkbox, DownArrow, Filter, More, CalendarFilter } from '../../../assets/icons';
import { TextButton } from '../../../components/Buttons/Button';
import Popover from '../../../components/Popover/Popover';
import Table from '../../../components/Table/Table';
import useWindowSize from '../../../hooks/userWindowSize';
import { fetchRequest } from '../../../utils/api';
import SearchBox from '../../../components/Common/SearchBox/SearchBox';
import ExportExcel from '../../../components/ExportExcel/ExportExcel';
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

const columnDefs = [
  {
    labelAsIcon: Checkbox,
    accessKey: 'checked',
    keyToCheck: 'uuid',
    renderIcon: Checkbox,
    isCheckbox: true,
    isMobile: false, // Show this content on mobile or not
  },
  {
    label: 'Date',
    accessKey: 'created_at',
    dateFilter: { show: true, selectDateRange: false },
  },
  {
    label: 'Name',
    accessKey: 'name',
    classes: 'main-content semi-bold',
  },
  {
    label: 'Email ID',
    accessKey: 'email',
    isMobile: false,
  },
  {
    label: 'Mobile No.',
    accessKey: 'mobile',
    isMobile: false,
  },
  {
    label: 'Type',
    cursor:'pointer',
    accessKey: 'type',
    renderFilterIcon: { icon: Filter, key: 'ref' },
    isMobile: false,
  },
  {
    label: 'Status',
    cursor:'pointer',
    accessKey: 'formatted_status',
    isMobile: false,
    renderFilterIcon: { icon: Filter, key: 'ref' },
    cellRenderer: row => <span className={`semi-bold status-${row.status}`}>{row.formatted_status}</span>,
  },
  {
    label: 'Attended by',
    cursor:'pointer',
    accessKey: 'attended_user.full_name',
    renderFilterIcon: { icon: Filter, key: 'ref' },
    isMobile: false,
  },
  {
    label: '',
    accessKey: 'more',
    isMobile: false,
    cellRenderer: row => (
      <div className="d-flex align-items-center">
        <Popover button={<p className="table-icon">{More}</p>} className="view-detail-popover">
          <TextButton
            link
            to={{ pathname: `/${localStorage.getItem('loginAs')}/contact-leads/${row.uuid}`, state: { leadId: row.uuid } }}
            className={`list-btn`}
          >
            View All Details
          </TextButton>
        </Popover>
      </div>
    ),
  },
];

const ContactLeads = () => {
  /* eslint-disable no-unused-vars */
  const [width] = useWindowSize();
  const [contactLeads, setContactLeads] = useState({ data: [], pagination: {} });
  const [filter, setFilter] = useState({
    per_page: 15,
    sort: [],
    current_page: 1,
    date_from: moment().subtract(1, 'year').format('YYYY-MM-DD'),
    date_to: moment().format('YYYY-MM-DD'),
  });
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState([]);

  const [typeData, setTypeData] = useState([
    { name: 'Contact Form', formatted: 'contact_form' },
    { name: 'Lab Registration', formatted: 'lab_registration' },
  ]);
  const [TypeFilter, setTypeFilter] = useState([]);
  const [TypeFilterAction, setTypeFilterAction] = useState(false);
  const [AppliedFilters , setAppliedFilters] = useState([])
  const [statusData, setStatusData] = useState([]);
  const [StatusFilter, setStatusFilter] = useState([]);
  const [StatusFilterAction, setStatusFilterAction] = useState(false);

  const [attendenceData, setattendenceData] = useState([]);
  const [AttendenceFilter, setAttendenceFilter] = useState([]);
  const [AttendenceFilterAction, setAttendenceFilterAction] = useState(false);
  const [update , setUpdate] = useState(null)
  const [state, setState] = useState({ start: moment(), end: moment() });
  const [selectedFilters, setSelectedFilters] = useState([]);

  const getStatusData = () => {
    setLoading(true);
    const { per_page = 15, current_page, search, date_from, date_to, sort } = filter;
    (async () => {
      let url = `/super_admin/contact_statuses`;
      const res = await fetchRequest({ url, method: 'GET', isAuth: true });
      setLoading(false);
      if (res && res.status === 200) {
        const { data, meta } = await res.json();
        setStatusData(data);
        return data;
      }

      return;
    })();
  };

  const getAttendedByData = () => {
    setLoading(true);
    const { per_page = 15, current_page, search, date_from, date_to, sort } = filter;
    (async () => {
      let url = `/super_admin/contact_lead_attended_by`;
      const res = await fetchRequest({ url, method: 'GET', isAuth: true });
      setLoading(false);
      if (res && res.status === 200) {
        const { data, meta } = await res.json();
        setattendenceData(data);
        return data;
      }

      return;
    })();
  };

  const getData = useCallback(() => {
    setLoading(true);
    setStatusFilterAction(false)
    setAttendenceFilterAction(false)
    setTypeFilterAction(false)
    for(let i=0; i < AttendenceFilter.length; i++) {
      if(!AppliedFilters.includes(AttendenceFilter[i])) {
        AppliedFilters.push(AttendenceFilter[i])
      }
    }
    for(let i=0; i < StatusFilter.length; i++) {
      if(!AppliedFilters.includes(StatusFilter[i])) {
        AppliedFilters.push(StatusFilter[i])
      }
    }
    for(let i=0; i < TypeFilter.length; i++) {
      if(!AppliedFilters.includes(TypeFilter[i])) {
        AppliedFilters.push(TypeFilter[i])
      }
    }

    const { per_page = 15, current_page, search, date_from, date_to, sort } = filter;
    (async () => {
      let url = `/super_admin/contact_lead?per_page=${per_page}${current_page ? `&page=${current_page}` : ''}${
        search ? `&search=${search}` : ''
      }${StatusFilter.length !== 0 ? `&status=${giveStatusFilter()}` : ''}${
        AttendenceFilter.length !== 0 ? `&attended_by=${getAttendeceFilter()}` : ''
      }${TypeFilter.length !== 0 ? `&type=${getTypeFilter()}` : ''}${date_from ? `&date_from=${date_from}` : ''}${
        date_to && date_to !== 'Invalid date' ? `&date_to=${date_to}` : ''
      }${sort && sort.length ? sort.map(item => `&${item.key}=${item.value}`).join('') : ''}`;
      const res = await fetchRequest({ url, method: 'GET', isAuth: true });
      setLoading(false);
      if (res && res.status === 200) {
        const { data, meta } = await res.json();
        setContactLeads({ data, pagination: meta.pagination });
        return data;
      }

      return;
    })();
  }, [filter]);

  useEffect(() => {
    getData({});
  }, [getData]);

  useEffect(() => {
    getAttendedByData();
    getStatusData();
  },[])
  const getListPerPage = pg => {
    setFilter({ ...filter, ...pg });
  };

  const getSelectedData = useCallback(data => setSelectedData(data), []);

  const handleCallback = (start, end) => {
    setState({ start, end });
    setFilter({
      ...filter,
      date_from: moment(start._d).format('YYYY-MM-DD'),
      date_to: moment(end._d).format('YYYY-MM-DD'),
      current_page: 1,
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
    if (filtername === 'Attendedby') {
      if (!AttendenceFilter.includes(data)) {
        AttendenceFilter.push(data);
        setUpdate({status:true,data:data})
      } else {
        for (let i = 0; i < AttendenceFilter.length; i++) {
          if (data === AttendenceFilter[i]) {
            AttendenceFilter.splice(i, 1);
            setUpdate({status:true,data:data})
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
            setUpdate({status:true,data:data})
          }
        }
      }
    } else {
      if (!TypeFilter.includes(data)) {
        TypeFilter.push(data);
        setUpdate({status:true,data:data})
      } else {
        for (let i = 0; i < TypeFilter.length; i++) {
          if (data === TypeFilter[i]) {
            TypeFilter.splice(i, 1);
            setUpdate({status:true,data:data})
          }
        }

      }
    }
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

  const getAttendeceFilter = () => {
    let attendence = '';
    AttendenceFilter.forEach(items => {
      if (attendence === '') {
        attendence = items;
      } else {
        attendence = attendence + ',' + items;
      }
    });
    return attendence;
  };

  const getTypeFilter = () => {
    let type = '';
    TypeFilter.forEach(items => {
      if (type === '') {
        type = items;
      } else {
        type = type + ',' + items;
      }
    });
    return type;
  };

  const mapStatus = () => {
    let AvailableStatus = statusData.map(items => {
      return (
        <div key={items.status}>
          <label>
            <input onChange={e => pushFilter(e, 'Status', items.status)} checked={StatusFilter.includes(items.status) ? true : false} type="checkbox" /> {items.formatted_status}
          </label>
        </div>
      );
    });
    return AvailableStatus;
  };

  const mapType = () => {
    let AvailableStatus = typeData.map(items => {
      return (
        <div key={items.formatted}>
          <label >
            <input onChange={e => pushFilter(e, 'Type', items.formatted)} checked={TypeFilter.includes(items.formatted) ? true : false} type="checkbox" /> {items.name}
          </label>
        </div>
      );
    });
    return AvailableStatus;
  };

  const mapAttendence = () => {
    let Availabelmember = attendenceData.map(items => {
      return (
        <div key={items.uuid}>
          <label>
            <input onChange={e => pushFilter(e, 'Attendedby', items.uuid)} checked={AttendenceFilter.includes(items.uuid) ? true : false} type="checkbox" /> {items.full_name}
          </label>
        </div>
      );
    });
    return Availabelmember;
  };

  const clearAllTypeFilter = (type) => {
    if(type === 'remove_filter') {
    TypeFilter.length = 0;
    getData()
    for(let i=0; i < selectedFilters.length; i++) {
      if(selectedFilters[i] === 'Type') {
         selectedFilters.splice(i,1)
      }
    }
    setTypeFilterAction(false);
    }
    else {
      let applied =[]
      for(let i=0; i<TypeFilter.length; i++) {
        if(AppliedFilters.includes(TypeFilter[i])) {
          applied.push(TypeFilter[i])
        }
      }
      TypeFilter.length=0
      setTypeFilter([...TypeFilter , ...applied])
      if(TypeFilter.length === 0) {
        for(let i=0; i< selectedFilters.length; i++) {
          if(selectedFilters[i] === 'Type') {
             selectedFilters.splice(i,1)
          }
        }
      }
      setTypeFilterAction(false);
    }
  };

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

  const clearAllAttFilter = (type) => {
    if(type === 'remove_filter') {
    AttendenceFilter.length = 0;
    getData()
    for(let i=0; i < selectedFilters.length; i++) {
      if(selectedFilters[i] === 'Attended by') {
         selectedFilters.splice(i,1)
      }
    }
    setAttendenceFilterAction(false);
    }
    else {
      let applied =[]
      for(let i=0; i<AttendenceFilter.length; i++) {
        if(AppliedFilters.includes(AttendenceFilter[i])) {
          applied.push(AttendenceFilter[i])
        }
      }
      AttendenceFilter.length=0
      setAttendenceFilter([...AttendenceFilter , ...applied])
      if(AttendenceFilter.length === 0) {
        for(let i=0; i< selectedFilters.length; i++) {
          if(selectedFilters[i] === 'Attended by') {
             selectedFilters.splice(i,1)
          }
        }
      }
      setAttendenceFilterAction(false);

    }
  };

  const openFilterAction = (status, type) => {
    if (type === 'Status') {
      setStatusFilterAction(true);
      setAttendenceFilterAction(false);
      setTypeFilterAction(false);
      if(!selectedFilters.includes('Status')) {
        selectedFilters.push(type)
        }
      setSelectedFilters(setSelectedFilters);
    } else if (type === 'Type') {
      setTypeFilterAction(true);
      setAttendenceFilterAction(false);
      setStatusFilterAction(false);
      if(!selectedFilters.includes('Type')) {
        selectedFilters.push(type)
        }
        setSelectedFilters(setSelectedFilters);
    } else if (type === 'Attended by') {
      setAttendenceFilterAction(true);
      setStatusFilterAction(false);
      setTypeFilterAction(false);
      if(!selectedFilters.includes('Attended by')) {
        selectedFilters.push(type)
        }
        setSelectedFilters(setSelectedFilters);
    }
  };

  return (
    <div className="paper card contact-lead-container list-container">
      <div className="content-header">
        <div className="row">
          <div className="col-6 col-md-2">
            <p className="semi-bold title">All Contact Leads</p>
          </div>
          <div className="col-6 col-md-2">
            <div className="form-group text-right">
              <ExportExcel path={'/super_admin/contact_lead_export'} filter={filter} selectedData={selectedData} />
            </div>
          </div>


          <div className="col-md-4 col-12 customDatePicker-wrapper">
            {/* <DateInput
            placeholder={selectedDate ? '' : 'Date'}
            value={selectedDate}
            onChange={date => setFilter({ ...filter, selectedDate: date })}
            returnFormat={'YYYY-MM-DD'}
          /> */}
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
          {StatusFilterAction === true ? (
              <div className="filter_container">
                <div className="filter_subcontainer_reff">
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

          {AttendenceFilterAction === true ? (
            <div className="filter_container_att">
               <div className='filter_subcontainer_reff'>
                {mapAttendence()}
              </div>
                <div className='filter_options'>
                  <span onClick={() => clearAllAttFilter('remove_filter')} style={{ color: 'rgba(223, 116, 106, 1)' }}>
                    Remove filter
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span onClick={() => clearAllAttFilter('cancel')}>Cancel</span>
                    {AttendenceFilter.length === 0 ? 
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

          {TypeFilterAction === true ? (
            <div className="filter_container_type">
              <div className='filter_subcontainer_reff'>
                {mapType()}
              </div>
                <div className='filter_options'>
                  <span onClick={() => clearAllTypeFilter('remove_filter')} style={{ color: 'rgba(223, 116, 106, 1)' }}>
                    Remove filter
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span onClick={() => clearAllTypeFilter('cancel')}>Cancel</span>
                    {TypeFilter.length === 0 ?
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


        <Table
          columnDefs={columnDefs}
          tableData={contactLeads.data}
          selectedFilters={selectedFilters}
          openFilterAction={openFilterAction}
          pagination={{ ...contactLeads.pagination, getListPerPage }}
          renderCheckbox={Checkbox}
          isButtonCard={<span className="next-arrow">{DownArrow}</span>}
          setFilter={setFilter}
          filter={filter}
          isLoading={loading}
          listName="leads"
          getSelectedData={getSelectedData}
        ></Table>
      </div>
    </div>
  );
};
export default ContactLeads;
