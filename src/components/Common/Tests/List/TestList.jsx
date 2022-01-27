import React, { useState, useEffect, useCallback, useContext } from 'react';
import { More, AddTestIcon, Filter } from '../../../../assets/icons';
import { ContainedButton } from '../../../Buttons/Button';
import Table from '../../../Table/Table';
import { fetchRequest } from '../../../../utils/api';
import SearchBox from '../../SearchBox/SearchBox';
import Popover from '../../../Popover/Popover';
import { Link } from 'react-router-dom';
import { ProfileContext } from '../../../../context/context';

const TestList = () => {
  const loginAs = localStorage.getItem('loginAs');
  const { profile } = useContext(ProfileContext);
  //const [actionObject, setActionObject] = useState(); //lab_group uuid from profile api
  const [masterTestList, setMasterTestList] = useState({});
  const [filter, setFilter] = useState({ per_page: 15, sort: [] });
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [catData, setCatData] = useState([]);
  const [CatFilter, setCatFilter] = useState([]);
  const [update , setUpdate] = useState({})
  const [CatFilterAction, setCatFilterAction] = useState(false);
  const [AppliedFilters , setAppliedFilters] = useState([])
  const [typeData, setTypeData] = useState([
    { name: 'Test', formatted: 'test' },
    { name: 'Group', formatted: 'group' },
    { name: 'Panel', formatted: 'panel' },
  ]);
  const [TypeFilter, setTypeFilter] = useState([]);
  const [TypeFilterAction, setTypeFilterAction] = useState(false);

  let testMasterBaseUrl = '/super_admin/';
  if(loginAs == "lab-admin") testMasterBaseUrl = `/lab_group/${profile?.selectedRole?.uuid}/`;
  else if(loginAs == "lab") testMasterBaseUrl = `/lab/${profile?.selectedRole?.uuid}/`;

  const [loading, setLoading] = useState(false);
  const headers = [
    {
      label: 'Test Name',
      accessKey: 'name',
    },
    {
      label: 'Short Name',
      accessKey: 'short_name',
    },
    {
      label: 'Category',
      cursor:'pointer',
      renderFilterIcon: { icon: Filter, key: 'ref' },
      accessKey: 'test_category.name',
      renderFilterIcon: { icon: Filter, key: 'test_category' },
    },
    {
      label: 'Type',
      cursor:'pointer',
      renderFilterIcon: { icon: Filter, key: 'ref' },
      accessKey: 'type',
      renderFilterIcon: { icon: Filter, key: 'type' },
    },
    {
      label: '',
      accessKey: 'actions',
      renderIcon: More,
      cellRenderer: row => (
        <Popover button={<p className="table-icon">{More}</p>} className="edit-patient-popover">
          <Link to={['lab-admin','lab'].includes(loginAs) ? `/${loginAs}/setting/view-test/${row.uuid}`:`/${loginAs}/view-test/${row.uuid}`} className={`status-edit small-text py-1 cursor-pointer`}>
            View Test Details
          </Link>
        </Popover>
      ),
    },
  ];

  const getCatList = useCallback(() => {
    setLoading(true);
    const { per_page = 15, current_page, search, sort } = filter;
    (async () => {
      const res = await fetchRequest({
        url: `${testMasterBaseUrl}test_categories`,
        method: 'GET',
        isAuth: true,
      });
      setLoading(false);
      if (res && res.status === 200) {
        const { data } = await res.json();
        setCatData(data);
        return data;
      }
      return;
    })();
  }, []); 

  const getMasterTestList = useCallback(() => {
    setLoading(true);
    const { per_page = 15, current_page, search, sort } = filter;
    (async () => {
      
      const res = await fetchRequest({
        url: `${testMasterBaseUrl}tests?per_page=${per_page}${current_page ? `&page=${current_page}` : ''}${
          CatFilter.length !== 0 ? `&categories=${giveCaFilter()}` : ''
        }${TypeFilter.length !== 0 ? `&type=${getTypeFilter()}` : ''}${search ? `&search=${search}` : ''}${
          sort && sort.length ? sort.map(item => `&${item.key}=${item.value}`).join('') : ''
        }`,
        method: 'GET',
        isAuth: true,
      });
      setLoading(false);
      if (res && res.status === 200) {
        const { data, meta } = await res.json();
        setMasterTestList({ data, pagination: meta.pagination });
        return data;
      }
      return;
    })();
  }, [filter]);

  useEffect(() => {
    getMasterTestList({});
    
  }, [getMasterTestList]);

  useEffect(() => {
   getCatList();
  }, [])

  const getListPerPage = pg => {
    setFilter({ ...filter, ...pg });
  };

  const pushFilter = (e, filtername, data) => {
    if (filtername === 'Cat') {
      if (!CatFilter.includes(data)) {
        CatFilter.push(data);
        setUpdate({status:true,data:data})
      } else {
        for (let i = 0; i < CatFilter.length; i++) {
          if (data === CatFilter[i]) {
            CatFilter.splice(i, 1);
            setUpdate({status:true,data:data})
          }
        }

      }
    } else if (filtername === 'Type') {
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

  const mapCategories = () => {
    let AvailabelBranches = catData.map(items => {
      return (
        <div>
          <label>
            <input onChange={e => pushFilter(e, 'Cat', items.uuid)} type="checkbox" /> {items.name}
          </label>
        </div>
      );
    });
    return AvailabelBranches;
  };

  const giveCaFilter = () => {
    let cat = '';
    CatFilter.forEach(items => {
      if (cat === '') {
        cat = items;
      } else {
        cat = cat + ',' + items;
      }
    });
    return cat;
  };

  const mapType = () => {
    let AvailableStatus = typeData.map(items => {
      return (
        <div>
          <label>
            <input onChange={e => pushFilter(e, 'Type', items.formatted)} type="checkbox" /> {items.name}
          </label>
        </div>
      );
    });
    return AvailableStatus;
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

  const clearAllFilter = (type) => {
    if(type === 'remove_filter') {
      CatFilter.length = 0;
      getMasterTestList()
      for(let i=0; i < selectedFilters.length; i++) {
        if(selectedFilters[i] === 'Category') {
           selectedFilters.splice(i,1)
        }
      }
      setTypeFilterAction(false);
      }
      else {
        let applied =[]
        for(let i=0; i<CatFilter.length; i++) {
          if(AppliedFilters.includes(CatFilter[i])) {
            applied.push(CatFilter[i])
          }
        }
        CatFilter.length=0
        setCatFilter([...CatFilter , ...applied])
        if(CatFilter.length === 0) {
          for(let i=0; i< selectedFilters.length; i++) {
            if(selectedFilters[i] === 'Category') {
               selectedFilters.splice(i,1)
            }
          }
        }
        setCatFilterAction(false);
      }
  };

  const clearAllTypeFilter = (type) => {
    if(type === 'remove_filter') {
      TypeFilter.length = 0;
      getMasterTestList()
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

  const openFilterAction = (status, type) => {
    if (type === 'Category') {
      setCatFilterAction(true);
      selectedFilters.push(type)
    } else if (type === 'Type') {
      setTypeFilterAction(true);
      selectedFilters.push(type)
    }
  };
  const addTestLink = ['lab-admin','lab'].includes(loginAs) ? `/${loginAs}/setting/add-test` : `/${loginAs}/add-test`;
  return (
    <div className="d-flex flex-wrap w-100">
      <div className={`paper paper-card test-master-list`}>
        <div className={`content-header d-flex align-items-baseline justify-content-between`}>
          <p className="semi-bold title">Test Master List</p>
          <div className="d-flex">
            <ContainedButton lightBlue className="add-with-icon mr-3" link to={addTestLink}>
              <div className="d-flex align-items-center">
                <p className="mr-2">{AddTestIcon}</p>
                <p className="pt-1">Add New Test</p>
              </div>
            </ContainedButton>
            <div className="push-4">
              <SearchBox setFilter={setFilter} filter={filter} placeholder="Search by Name or Short Name" />
            </div>
          </div>
        </div>

        {CatFilterAction === true ? (
          <div className="filter_container_status">
            <div className='filter_subcontainer_reff'>
            {mapCategories()}
            </div>
            <div className='filter_options'>
              <span onClick={() => clearAllFilter('remove_filter')} style={{ color: 'rgba(223, 116, 106, 1)' }}>
                Remove filter
              </span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span onClick={() => clearAllFilter('cancel')}>Cancel</span>
                {CatFilter.length === 0 ?
                <span style={{ paddingLeft: 10 }}>
                  Apply
                </span>
                 :
                 <span onClick={() => getMasterTestList()} style={{ paddingLeft: 10,color:'blue' }}>
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
          <div className="filter_container_status">
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
                 <span onClick={() => getMasterTestList()} style={{ paddingLeft: 10,color:'blue' }}>
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
          columnDefs={headers}
          selectedFilters={selectedFilters}
          openFilterAction={openFilterAction}
          tableData={masterTestList.data}
          pagination={{ ...masterTestList.pagination, getListPerPage }}
          setFilter={setFilter}
          filter={filter}
          isLoading={loading}
          listName="tests"
        />
      </div>
    </div>
  );
};

export default TestList;
