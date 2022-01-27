import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Filter, More } from '../../../../assets/icons';
import { OutlinedButton, TextButton } from '../../../../components/Buttons/Button';
import SearchBox from '../../../../components/Common/SearchBox/SearchBox';
import ConfirmationModal from '../../../../components/Modal/ConfirmationModal';
import Notification from '../../../../components/Notification/Notification';
import Table from '../../../../components/Table/Table';
import { ProfileContext } from '../../../../context/context';
import { fetchRequest } from '../../../../utils/api';
import '../../ReferredDoctor/List/DoctorList.scss'

const DoctorList = props => {
  const { profile } = useContext(ProfileContext);
  const [doctorList, setDoctorList] = useState({});
  const [AppliedFilters , setAppliedFilters] = useState([])
  const [CityFilter, setCityFilter] = useState([]);
  const [CityData, setCityData] = useState([]);
  const [CityFilterAction, setCityFilterAction] = useState(false);

  const [SkillFilter, setSkillFilter] = useState([]);
  const [skillData, setSkillData] = useState(['	Haematology', 'ortho']);
  const [SkillFilterAction, setSkillFilterAction] = useState(false);
  const [filterIt, setFilterIt] = useState([]);
  const [update , setUpdate] = useState(null)

  const [selectedFilters , setSelectedFilters] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [actionObject, setActionObject] = useState({});
  const [filter, setFilter] = useState({ per_page: 15, sort: [] });
  const [loading, setLoading] = useState(false);

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
  }, [filter]);

  const getListData = useCallback(() => {
    setLoading(true);
    setCityFilterAction(false)
    for(let i=0; i < CityFilter.length; i++) {
      if(!AppliedFilters.includes(CityFilter[i])) {
        AppliedFilters.push(CityFilter[i])
      }
    }
    const { per_page = 15, current_page, search, date, sort } = filter;
    if (profile.selectedRole.uuid)
      (async () => {
        const res = await fetchRequest({
          url: `${profile.selectedRole.role.name === 'lab_admin' ? '/lab_group' : '/lab'}/${
            profile.selectedRole.uuid
          }/referred_by?per_page=${per_page}${current_page ? `&page=${current_page}` : ''}${search ? `&search=${search}` : ''}${
            date ? `&date=${date}` : ''
          }${CityFilter.length !== 0 ? `&city=${giveBranchFilter()}` : ''}${
            SkillFilter.length !== 0 ? `&specialist_in=${getSkillFilter()}` : ''
          }${sort && sort.length ? sort.map(item => `&${item.key}=${item.value}`).join('') : ''}`,
          method: 'GET',
          isAuth: true,
        });
        if (res && res.status === 200) {
          setLoading(false);
          const { data, meta } = await res.json();
          if (CityFilter.length === 0 && SkillFilter.length === 0) {
            setDoctorList({ data: data, pagination: meta.pagination });
          }
        } else setLoading(false);
        return;
      })();
  }, [profile.selectedRole, filter]);

  const getListPerPage = useCallback(pg => {
    setFilter(filter => ({ ...filter, ...pg }));
  }, []);

  useEffect(() => {
    getListData();
  }, [filter, getListData]);

  useEffect(() => {
    getCityData()
  },[])

  const handleDeleteAppointment = useCallback(
    data => {
      if (data.success) {
        getListData();
        setNotification({ show: true, message: data.message, type: 'success' });
      } else setNotification({ show: true, message: data.message, type: 'error' });
    },
    [getListData],
  );

  const columnDefs = [
    {
      label: 'Name',
      cellRenderer: row => `${row.first_name} ${row.last_name}`,
      width: '30%',
    },
    {
      label: 'Mobile No.',
      accessKey: 'mobile',
      width: '20%',
    },
    {
      label: 'City',
      cursor:'pointer',
      renderFilterIcon: { icon: Filter, key: 'ref' },
      accessKey: 'city',
      width: '20%',
    },
    {
      label: 'Specializaztion',
      accessKey: 'specialist_in',
      width: '20%',
    },
    {
      label: 'Action',
      accessKey: 'more',
      renderIcon: More,
      width: '10%',
      cellRenderer: row => (
        <div className="d-flex align-items-center">
          {/* <OutlinedButton
            black
            link
            to={{ pathname: `/${localStorage.getItem('loginAs')}/referred-doctor-update`, state: { ...row } }}
            className="mr-3"
          >
            Edit Details
          </OutlinedButton> */}
          <OutlinedButton
            red
            onClick={() => {
              setNotification({ show: false, message: '', type: '' });
              setActionObject({
                title: 'Confirmation',
                msg: 'Are you sure you want to delete this doctor? It will be erased completely and you cannot undo it.',
                cancelAction: 'Go Back',
                confirmAction: 'Delete',
                method: 'DELETE',
                url: `/lab/${row.lab_id}/referred_by/${row.uuid}`,
                handleSuccess: handleDeleteAppointment,
                handleFailure: handleDeleteAppointment,
                isModalOpen: true,
              });
            }}
          >
            Remove
          </OutlinedButton>
        </div>
      ),
    },
  ];

  const pushFilter = (e, filtername, data) => {
    if (filtername === 'City') {
      if (!CityFilter.includes(data)) {
        CityFilter.push(data);
        setUpdate({status:true,data:data})
      } else {
        for (let i = 0; i < CityFilter.length; i++) {
          if (data === CityFilter[i]) {
            CityFilter.splice(i, 1);
            setUpdate({status:true,data:data})
          }
        }
      }
    } else if (filtername === 'Skill') {
      if (!SkillFilter.includes(data)) {
        SkillFilter.push(data);
      } else {
        for (let i = 0; i < SkillFilter.length; i++) {
          if (data === SkillFilter[i]) {
            SkillFilter.splice(i, 1);
          }
        }
        getListData();
      }
    }
  };
 
  const clearAllFilter = (type) => {
    if(type === 'remove_filter') {
    CityFilter.length = 0;
    setCityFilterAction(false);
    getListData()
    for(let i=0; i < selectedFilters.length; i++) {
      if(selectedFilters[i] === 'City') {
         selectedFilters.splice(i,1)
      }
    }
    }
    else {
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
      setSelectedFilters([]);
    }
  };

  const openFilterAction = (status, type) => {
    if (type === 'City') {
      setCityFilterAction(true);
      if(!selectedFilters.includes('City')) {
        selectedFilters.push(type)
        }
      setSelectedFilters(setSelectedFilters);
    }
  };

  const clearAllSkillFilter = () => {
    setSkillFilter([]);
    setFilterIt([]);
    setSkillFilterAction(false);
  };

  const mapBranches = () => {
    let AvailabelBranches = CityData.map(items => {
      return (
        <div>
          <label>
            <input class='list_checkbox' onClick={e => pushFilter(e, 'City', items)} checked={CityFilter.includes(items) ? true : false} type="checkbox" /> {items}
          </label>
        </div>
      );
    });
    return AvailabelBranches;
  };

  const mapSkill = () => {
    let AvailabelStatus = skillData.map(items => {
      return (
        <div key={items}>
          <label>
            <input onChange={e => pushFilter(e, 'Skill', items)} type="checkbox" /> {items}
          </label>
        </div>
      );
    });
    return AvailabelStatus;
  };

  const giveBranchFilter = () => {
    let branch = '';
    CityFilter.forEach(items => {
      if (branch === '') {
        branch = items;
      } else {
        branch = branch + ',' + items;
      }
    });
    return branch;
  };

  const getSkillFilter = () => {
    let skill = '';
    SkillFilter.forEach(items => {
      if (skill === '') {
        skill = items;
      } else {
        skill = skill + ',' + items;
      }
    });
    return skill;
  };

  return (
    <div className="paper card list-path-lab-container list-container">
      <Notification {...notification} />
      <div className="content-header">
        <div className="row justify-content-between">
          <div className="col-6 col-md-6">
            <p className="semi-bold title">All Doctors</p>
          </div>
          <div className="push-4 col-md-4">
            <SearchBox filter={filter} setFilter={setFilter} placeholder="Search by Name or Mobile No." />
          </div>
        </div>
      </div>

      {CityFilterAction === true ? (
        <div className="filter_container">
          <div className='filter_subcontainer_reff'>
            {mapBranches()}
          </div>
          <div className="filter-options d-flex justify-content-between">
            <TextButton onClick={() => clearAllFilter('remove_filter')} className="remove-filter-btn" red>
              Remove filter
            </TextButton>
            <div className="d-flex justify-content-between">
              <TextButton onClick={() => clearAllFilter('cancel')} className="cancel-btn">
                Cancel
              </TextButton>
              <TextButton onClick={() => getListData()} className="apply-btn" disabled={!CityFilter.length} blue>
                Apply
              </TextButton>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      {SkillFilterAction === true ? (
        <div className="filter_container_status">
          <div className='filter_subcontainer_reff'>
          {mapSkill()}
          </div>
          <div className="filter-options d-flex justify-content-between">
              <TextButton onClick={() => clearAllSkillFilter()} className="remove-filter-btn" red>
                Remove filter
              </TextButton>
              <div className="d-flex justify-content-between">
                <TextButton onClick={() => setSkillFilterAction(false)} className="cancel-btn">
                  Cancel
                </TextButton>
                <TextButton onClick={() => getListData()} className="apply-btn" disabled={!SkillFilter.length} blue>
                  Apply
                </TextButton>
              </div>
            </div>
        </div>
      ) : (
        <div></div>
      )}

      <div className="content-body">
        <Table
          columnDefs={columnDefs}
          tableData={doctorList.data}
          openFilterAction={openFilterAction}
          selectedFilters={selectedFilters}
          pagination={{ ...doctorList.pagination, getListPerPage }}
          filter={filter}
          setFilter={setFilter}
          isLoading={loading}
          listName="doctors"
        />
      </div>
      <ConfirmationModal actionObject={actionObject} />
    </div>
  );
};

export default DoctorList;
