import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, More, CalendarFilter } from '../../../../assets/icons';
import { OutlinedButton, TextButton } from '../../../../components/Buttons/Button';
import SearchBox from '../../../../components/Common/SearchBox/SearchBox';
import ConfirmationModal from '../../../../components/Modal/ConfirmationModal';
import Notification from '../../../../components/Notification/Notification';
import Popover from '../../../../components/Popover/Popover';
import Table from '../../../../components/Table/Table';
import { ProfileContext } from '../../../../context/context';
import useWindowSize from '../../../../hooks/userWindowSize';
import { fetchRequest } from '../../../../utils/api';
import { rupeeSymbol } from '../../../../utils/constants';
import EditAmountModal from './EditAmountModal';
import UpdatePatientModal from './UpdatePatientModal';
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';

const defaultFilterAction = {referral:false,branch:false,status:false};
const defaultFilterObject = { referral: [],branch: [],status: []};
const PatientsList = props => {
  /* eslint-disable no-unused-vars */
  const [width] = useWindowSize();
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);
  const [patientList, setPatientList] = useState([]);
  const [actionObject, setActionObject] = useState({});
  const [editAmountObject, setEditAmountObject] = useState({});

  const [filterAction,setFilterAction] = useState({...defaultFilterAction})

  const [tempFilters, setTempFilters] = useState({ referral: [],branch: [],status: []});
  const [appliedFilters, setAppliedFilters] = useState({ referral: [],branch: [],status: []});
  const { referral: referralFilter,branch: branchFilter,status: statusFilter } = appliedFilters;

  const [selectedFilters, setSelectedFilters] = useState([]); // ['referral','branch','status']

  const [searchReffDoct, setSearchReffDoct] = useState('');
  const [updatePatientObject, setUpdatePatientObject] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isLabAdmin, setLabAdmin] = useState(null);
  const [filter, setFilter] = useState({
    per_page: 15,
    sort: [],
    current_page: 1,
    date_from: moment().subtract(1, 'year').format('YYYY-MM-DD'),
    date_to: moment().format('YYYY-MM-DD'),
  });
  const getPatientColumns = filter => {
    const cols = [
      {
        label: 'Date',
        accessKey: 'created_at',
        dateFilter: { show: true, selectDateRange: true },
        selectsDateRange: true,
        width: '9%',
      },
      {
        label: 'Name',
        accessKey: 'patient.full_name',
        width: '12%',
      },
      {
        label: 'Mobile No.',
        accessKey: 'patient.mobile',
        width: '9%',
      },
      {
        label: 'referral',
        width: '12%',
        cursor: 'pointer',
        renderFilterIcon: { icon: Filter, key: 'ref' },
        cellRenderer: ({ referred_by }) => referred_by?.full_name || 'Self',
      },
      {
        label: 'Test',
        width: '22%',
        cellRenderer: ({ tests }) => tests.map((test, ind) => (ind === tests.length - 1 ? test : test + ', ')),
      },
      {
        label: 'Pending Fees',
        accessKey: 'total_balance',
        width: '12%',
        cellRenderer: ({ editAmount, total_balance, uuid, total_paid, total_payable, lab, editable }) => (
          <div className="d-flex justify-content-end">
            {editAmount ? (
              <></>
            ) : (
              <span style={parseInt(total_balance) > 0 ? {} : { marginRight: '27px' }}>
                {rupeeSymbol} {total_balance}
              </span>
            )}
            {parseInt(total_balance) > 0 && (
              <Popover button={<p className="table-icon ml-1">{More}</p>} className="edit-patient-popover">
                <div
                  onClick={() => {
                    setEditAmountObject({
                      title: '',
                      confirmAction: 'Save',
                      isModalOpen: true,
                      url: `/lab/${loginAs === 'lab-admin' && lab?.uuid ? lab.uuid : profile.selectedRole.uuid}/patient_entry/${uuid}/payments`,
                      method: 'PUT',
                      isEdit: true,
                      data: {
                        total_balance,
                        total_paid,
                        total_payable,
                      },
                      setNotification: setNotification,
                      handleSuccess: data => {
                        data.message &&
                          setNotification({
                            show: true,
                            message: data.message,
                            type: 'success',
                          });
                        setTimeout(() => getPatientList(), 2000);
                      },
                    });
                  }}
                  className="small-text py-1 cursor-pointer"
                >
                  Edit Amount
                </div>
              </Popover>
            )}
          </div>
        ),
      },
      {
        label: 'status',
        width: '10%',
        cursor: 'pointer',
        renderFilterIcon: { icon: Filter, key: 'status' },
        cellRenderer: ({ appointment_status }) => (
          <OutlinedButton className={`patient-status-btn ${appointment_status.name}`}>{appointment_status.formatted_name}</OutlinedButton>
        ),
      },
      {
        label: 'Action',
        width: '10%',
        cellRenderer: row => {
          return (
            <div className="d-flex align-items-center">
              <OutlinedButton
                black
                onClick={() => {
                  setUpdatePatientObject({
                    isModalOpen: true,
                    setNotification,
                    data: { ...row, labId: loginAs === 'lab-admin' ? row.lab.uuid : profile.selectedRole.uuid },
                    handleSuccess: getPatientList,
                    filter: filter,
                  });
                }}
              >
                Update
              </OutlinedButton>
              {row.editable && (
                <Popover button={<p className="table-icon">{More}</p>} className="edit-patient-popover">
                  <Link
                    to={{
                      pathname: `/${localStorage.getItem('loginAs')}/edit-patient`,
                      state: { patientId: row.uuid, branchId: loginAs === 'lab-admin' ? row.lab.uuid : profile.selectedRole.uuid },
                    }}
                    className={`status-edit small-text py-1 cursor-pointer`}
                  >
                    Edit details
                  </Link>
                  <div
                    onClick={() =>
                      setActionObject({
                        title: 'Confirmation',
                        msg: 'Are you sure you want to delete this patient? It will be erased completely and you cannot undo it.',
                        cancelAction: 'Go Back',
                        confirmAction: 'Delete',
                        method: 'DELETE',
                        url: `/lab/${loginAs === 'lab-admin' ? row.lab.uuid : profile.selectedRole.uuid}/patient_entry/${row.uuid}`,
                        handleSuccess: data => {
                          data.message &&
                            setNotification({
                              show: true,
                              message: data.message,
                              type: 'success',
                            });
                          setTimeout(() => getPatientList(), 2000);
                        },
                        setNotification: setNotification,
                        isModalOpen: true,
                      })
                    }
                    className={`status-delete small-text py-1 cursor-pointer`}
                  >
                    Delete Patient Entry
                  </div>
                </Popover>
              )}
            </div>
          );
        },
      },
    ];
    if (isLabAdmin?.admin) {
      cols.splice(5, 0, {
        label: 'branch',
        accessKey: 'lab.name',
        width: '10%',
      });
    }
    return cols;
  };
  const [patientColumnDefs, setPatientColumnDefs] = useState([...getPatientColumns(filter)]);

  const [loading, setLoading] = useState(false);
  const [refferedData, setRefferedData] = useState([]);

  const [BranchesData, setBranchesData] = useState([]);
  const [StatusData, setStatusData] = useState([]);
  const [update, setUpdate] = useState([]);
  const [filterIt, setFilterIt] = useState([]);
  const [start, setState] = useState({ start: moment(), end: moment() });

  useEffect(() => {
    if (profile?.selectedRole?.role?.name === 'lab_admin') {
      setLabAdmin({ admin: true });
    } else setLabAdmin({ admin: false });
  }, [profile.selectedRole]);

  const getReffData = async () => {
    setLoading(true);
    let url = `${profile.selectedRole.role.name === 'lab_admin' ? '/lab_group' : '/lab'}/${profile.selectedRole.uuid}/referred_by`;
    let statusRes = await fetchRequest({
      url,
      method: 'GET',
      isAuth: true,
    });

    if (statusRes && statusRes.status === 200) {
      setLoading(false);
      const { data, meta } = await statusRes.json();
      setRefferedData([...data,{full_name:"Self",uuid:'self'}]);
    }
  };

  const getStatusData = async () => {
    setLoading(true);
    let statusRes = await fetchRequest({
      url: `/get_appointment_statuses`,
      method: 'GET',
      isAuth: true,
    });

    if (statusRes && statusRes.status === 200) {
      setLoading(false);
      const { data, meta } = await statusRes.json();
      setStatusData(data);
    }
  };

  const getBranchesData = async () => {
    setLoading(true);
    let url = profile.selectedRole.role.name === 'lab_admin' ? `lab_group` : `lab`;
    let statusRes = await fetchRequest({
      url: `/${url}/${profile.selectedRole.uuid}/get_labs`,
      method: 'GET',
      isAuth: true,
    });

    if (statusRes && statusRes.status === 200) {
      setLoading(false);
      const { data, meta } = await statusRes.json();
      setBranchesData(data);
    }
  };

  const onApplyFilter = (type) => {
    let temp = [...selectedFilters], tempApplied = {...appliedFilters};

    tempApplied[type] = tempFilters[type]

    if (!temp.includes(type)) {
      temp.push(type);
    }

    setAppliedFilters(tempApplied);
    setSelectedFilters(temp);
    return getPatientList(0,tempApplied);
  }

  const getPatientList = useCallback(
    async (isExport,applied) => {
      !isExport && setLoading(true);    
      let mainFilter = applied || appliedFilters;
      setFilterAction({...defaultFilterAction})
      const { per_page, current_page, search, date_from, date_to, sort } = filter;
      let url = profile.selectedRole.role.name === 'lab_admin' ? `lab_group` : `lab`;
      if (url) {
        const statusRes = await fetchRequest({
          url: `/${url}/${profile.selectedRole.uuid}/patient_entry?per_page=${profile.perPageData ? profile.perPageData : per_page}${
            current_page ? `&page=${current_page}` : ''
          }${mainFilter.referral.length ? `&referred_by=${getCommaSeperatedIds(mainFilter.referral)}` : ''}${
            mainFilter.branch.length ? `&branch=${getCommaSeperatedIds(mainFilter.branch)}` : ''
          }${mainFilter.status.length ? `&filter_appointment_status=${getCommaSeperatedIds(mainFilter.status)}` : ''}${search ? `&search=${search}` : ''}${
            date_from ? `&date_from=${date_from}` : ''
          }${date_to && date_to !== 'Invalid date' ? `&date_to=${date_to}` : ''}${
            sort && sort.length ? sort.map(item => `&${item.key}=${item.value}`).join('') : ''
          }${isExport ? '&export=1' : ''}`,
          method: 'GET',
          isAuth: true,
        });
        if (statusRes && statusRes.status === 200) {
          if (isExport) {
            const data = await statusRes.blob();
            const file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;' });
            const fileURL = URL.createObjectURL(file);
            const downloadLink = document.createElement('a');
            const fileName = `patients.xlsx`;
            downloadLink.href = fileURL;
            downloadLink.download = fileName;
            downloadLink.click();
          } else {
            setLoading(false);
            const { data, meta } = await statusRes.json();

            setPatientList({ data: data, pagination: meta.pagination });
          }
        } else setLoading(false);

        return;
      }
    },
    [profile, profile.selectedRole, filter,referralFilter,branchFilter,statusFilter],
  ); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getPatientList();
    setPatientColumnDefs([...getPatientColumns(filter)]);
  }, [filter]);

  useEffect(() => {
    getBranchesData();
    getStatusData();
    getReffData();
  }, []);

  const getListPerPage = useCallback(pg => {
    setFilter(filter => ({ ...filter, ...pg }));
  }, []);

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

  const pushFilter = (filtername, data) => {
    let temp = {...tempFilters};

    let filterData = [...temp[filtername]] || [];

    if (!filterData?.includes(data)) {
      filterData.push(data);
      setUpdate({ status: true, data });
    } else {
      for (let i = 0; i < filterData.length; i++) {
        if (data === filterData[i]) {
          filterData.splice(i, 1);
          setUpdate({ status: false, data });
        }
      }
    }
    temp[filtername] = filterData;
    setTempFilters(temp);
  };

  const onRemoveFilter = (type) => {
    let ind = selectedFilters.indexOf(type);
    let tempApplied = {...appliedFilters,[type]:[]};
    if (ind !== -1){
      selectedFilters.splice(ind,1);
      setSelectedFilters(selectedFilters)
    }
    setTempFilters({...tempFilters,[type]:[]});
    setFilterAction({...filterAction,[type]:false});
    setAppliedFilters(tempApplied);
    return getPatientList(0,tempApplied);
  }

  const onClearFilter = (type) => {
    let temp = {...tempFilters};
    if (!appliedFilters[type].length){
      let ind = selectedFilters.indexOf(type);
      selectedFilters.splice(ind,1);
      setSelectedFilters(selectedFilters);
    }
    temp[type] = appliedFilters[type];
    setTempFilters(temp);
    setFilterAction({...filterAction,[type]:false})
  };

  const mapBranches = () => {
    let AvailabelBranches = BranchesData.map(items => {
      return (
        <div key={items.uuid}>
          <label>
            <input onChange={e => pushFilter('branch', items.uuid)} checked={tempFilters.branch.includes(items.uuid) ? true : false} type="checkbox" />{' '}
            {items.name}
          </label>
        </div>
      );
    });
    return AvailabelBranches;
  };

  const mapStatuses = () => {
    let AvailabelStatus = StatusData.map(items => {
      return (
        <div key={items.name}>
          <label>
            <input onChange={e => pushFilter('status', items.name)} checked={tempFilters.status.includes(items.name) ? true : false} type="checkbox" />{' '}
            {items.formatted_name}
          </label>
        </div>
      );
    });
    return AvailabelStatus;
  };

  const mapReffers = () => {
    let AvailabelStatus;
    AvailabelStatus = refferedData.map(items => {
      return (
        <div key={items.uuid}>
          <label>
            <input
              className="reff_checkbox"
              onChange={e => pushFilter('referral', items.uuid)}
              checked={tempFilters.referral.includes(items.uuid) ? true : false}
              type="checkbox"
            />{' '}
            {items.full_name}
          </label>
        </div>
      );
    });
    return AvailabelStatus;
  };

  const SearchedDoct = () => {
    let AvailabelStatus = refferedData
      .filter(items => (`${items.full_name.toLowerCase()}`).includes(searchReffDoct.toLowerCase()))
      .map(items => {
        return (
          <div key={items.uuid}>
            <label>
              <input onChange={e => pushFilter('referral', items.uuid)} checked={tempFilters.referral.includes(items.uuid) ? true : false} type="checkbox" />{' '}
              {items.full_name}
            </label>
          </div>
        );
      });
    return AvailabelStatus;
  };

  const getCommaSeperatedIds = (data) => {
    let str = '';
    data.forEach(items => {
      if (str === '') {
        str = items;
      } else {
        str = str + ',' + items;
      }
    });
    return str;
  };

  const openFilterAction = (status, type) => {
    let temp = [...selectedFilters];
    setFilterAction({...defaultFilterAction,[type]:true});
    
    if(!temp.includes(type)){
      temp.push(type);
    }
    for (const key in appliedFilters) {
      if(key !== type ){
        if(appliedFilters[key].length && !temp.includes(key)) temp.push(key);
        else if(!appliedFilters[key].length && temp.includes(key)){
          let ind = temp.indexOf(key);
          ind !== -1 && temp.splice(ind,1)
        }
      }
    }
    setSelectedFilters(temp);
  };

  return (
    <div className="paper card list-path-lab-container list-container">
      <Notification {...notification} />
      <div className="content-header">
        <div className="row">
          <div className="col-2 col-md-2">
            <p className="semi-bold title">All patients</p>
          </div>
          <div className="col-4 col-md-2">
            <div className="form-group text-right">
              <OutlinedButton className="export-excel" onClick={() => getPatientList(1)}>
                Export Excel
              </OutlinedButton>
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
                <span className={label ? 'range-value' : 'range-placeholder'}>{label ? label : 'Select date range'}</span>
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
        {filterAction.status ? (
          <div className="filter_container_status">
            <div className="filter_subcontainer_reff">{mapStatuses()}</div>
            <div className="filter-options d-flex justify-content-between">
              <TextButton onClick={() => onRemoveFilter('status')} className="remove-filter-btn" red>
                Remove filter
              </TextButton>
              <div className="d-flex justify-content-between">
                <TextButton onClick={() => onClearFilter('status')} className="cancel-btn">
                  Cancel
                </TextButton>
                <TextButton onClick={() => onApplyFilter('status')} className="apply-btn" disabled={!tempFilters.status.length} blue>
                  Apply
                </TextButton>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}

        {filterAction.branch ? (
          <div className="filter_container">
            <div className="filter_subcontainer_reff">{mapBranches()}</div>
            <div className="filter-options d-flex justify-content-between">
              <TextButton onClick={() => onRemoveFilter('branch')} className="remove-filter-btn" red>
                Remove filter
              </TextButton>
              <div className="d-flex justify-content-between">
                <TextButton onClick={() => onClearFilter('branch')} className="cancel-btn">
                  Cancel
                </TextButton>
                <TextButton onClick={() => onApplyFilter('branch')} className="apply-btn" disabled={!tempFilters.branch.length} blue>
                  Apply
                </TextButton>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}

        {filterAction.referral ? (
          <div className="filter_container_reff d-flex flex-column">
            <div className="reff_doctor_search">
              <label htmlFor="reff_doctor_search">Dr. </label>
              <input value={searchReffDoct} onChange={e => setSearchReffDoct(e.target.value)} id="reff_doctor_search"/>
            </div>
            <div className="filter_subcontainer_reff">{searchReffDoct === '' ? mapReffers() : SearchedDoct()}</div>
            <div className="filter-options d-flex justify-content-between">
              <TextButton onClick={() => onRemoveFilter('referral')} className="remove-filter-btn" red>
                Remove filter
              </TextButton>
              <div className="d-flex justify-content-between">
                <TextButton onClick={() => onClearFilter('referral')} className="cancel-btn">
                  Cancel
                </TextButton>
                <TextButton onClick={() => onApplyFilter('referral')} className="apply-btn" disabled={!tempFilters.referral.length} blue>
                  Apply
                </TextButton>
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}

        <Table
          columnDefs={patientColumnDefs}
          selectedFilters={selectedFilters}
          openFilterAction={openFilterAction}
          tableData={patientList.data}
          setFilter={setFilter}
          isLoading={loading}
          filter={filter}
          pagination={{ ...patientList.pagination, getListPerPage }}
          listName="patients"
          tableClassName="patient-table"
        />
        <ConfirmationModal actionObject={actionObject} />
        <EditAmountModal actionObject={editAmountObject} />
        <UpdatePatientModal actionObject={updatePatientObject} isLabAdmin={isLabAdmin} />
      </div>
    </div>
  );
};
export default PatientsList;
