import React, { useEffect, useState } from 'react';
import SelectInput from '../../../../components/FormInputs/SelectInput/SelectInput';
import { fetchRequest } from '../../../../utils/api';
import PackageCard from '../../../../components/Common/PackageCard/PackageCard';
import { OutlinedButton, ContainedButton } from '../../../../components/Buttons/Button';
import ConfirmationModal from '../../../../components/Modal/ConfirmationModal';

const defaultState = {
  category: {},
  type: {},
};

function PackageList() {
  const [packages, setPackages] = useState([]);
  const [actionObject, setActionObject] = useState({});
  const [packageCategory, setPackageCategory] = useState({ categories: [], types: [] });
  const [initials, setInitials] = useState(defaultState);
  const [loading, setLoading] = useState(false);

  //component did mount
  useEffect(() => {
    if (!packageCategory.categories.length)
      (async () => {
        const res = await fetchRequest({ url: '/super_admin/package_type_and_category', method: 'GET', isAuth: true });
        if (res && res.status === 200) {
          const { data } = await res.json();
          let categories = [],
            types = [];
          categories = data.categories.map(item => ({
            label: item.formatted_category,
            value: item.category,
            ...item,
          }));
          types = data.types.map(item => ({
            label: item.formatted_type,
            value: item.type,
          }));
          setPackageCategory({ categories, types });
          return data;
        }
        return;
      })();
  }, [packageCategory.categories.length]);

  useEffect(() => {
    if (packageCategory.categories.length && packageCategory.types.length) {
      setInitials(initials => ({
        ...initials,
        category: packageCategory.categories[0],
        type: packageCategory.types[0],
      }));
    }
  }, [packageCategory]);

  useEffect(() => {
    if (initials.category && initials.type) {
      getPackages();
    }
  }, [initials]); // eslint-disable-line react-hooks/exhaustive-deps

  const getPackages = async () => {
    setLoading(true);
    if (initials.category || initials.type) {
      let category = initials.category.value,
        type = initials.type.value;
      let url = `/super_admin/package${
        category === 'default' ? `?category=${category}${type ? `&type=${type}` : ''}` : `?category=${category}`
      }`;
      if (category) {
        const res = await fetchRequest({ url, method: 'GET', isAuth: true });
        setLoading(false);
        if (res && res.status === 200) {
          const { data } = await res.json();
          setPackages(data);
          return data;
        }
      }
      return;
    }
  };

  const handlePackageState = async (active, package_id) => {
    let body = { active };
    const res = await fetchRequest({ url: `/super_admin/package/${package_id}`, method: 'PUT', isAuth: true, body });
    if (res && res.status === 200) {
      const data = await res.json();
      if (data.success) {
        getPackages();
      }
    } else {
      const err = await res.json();
      setActionObject({
        title: 'Invalid Action',
        msg: err.message
          ? err.message
          : 'You cannot activate more than 4 packages. Inorder to activate this kindly de-activate any one active pack.',
        cancelAction: 'Go Back',
        isModalOpen: true,
      });
    }
    return;
  };

  const onHandleChange = (value, key) => {
    let obj = { ...initials };
    obj[key] = value;
    setInitials({ ...obj });
  };

  const getActions = (active, package_id) => (
    <div className="d-flex justify-content-center mb-3">
      {!active && (
        <OutlinedButton
          red
          className="delete-btn"
          onClick={() => {
            setActionObject({
              title: 'Confirmation',
              msg: 'Are you sure you want to delete this package? It will be erased completely and you cannot undo it.',
              cancelAction: 'Go Back',
              confirmAction: 'Delete',
              method: 'DELETE',
              url: `/super_admin/package/${package_id}`,
              handleSuccess: getPackages,
              isModalOpen: true,
            });
          }}
        >
          Delete
        </OutlinedButton>
      )}
      {initials.category &&
        initials.category.value === 'default' &&
        (active ? (
          <OutlinedButton
            className="ml-2"
            onClick={() => {
              setActionObject({
                title: 'Confirmation',
                msg: 'Are you sure you want to de-activate this package? It will still be in your records.',
                cancelAction: 'Go Back',
                confirmAction: 'Yes, De-ctivate',
                method: 'PUT',
                data: { active: false },
                url: `/super_admin/package/${package_id}`,
                handleSuccess: getPackages,
                isModalOpen: true,
              });
            }}
          >
            De-Activate
          </OutlinedButton>
        ) : (
          <ContainedButton className="ml-2" black onClick={() => handlePackageState(true, package_id)}>
            Activate
          </ContainedButton>
        ))}
    </div>
  );

  const { categories, types } = packageCategory;
  const { category, type } = initials;

  return (
    <div className="package-container">
      <div className="row mb-3">
        <div className="col-md-2">
          <SelectInput
            placeholder="Category"
            options={categories}
            value={category}
            onChange={data => onHandleChange(data, 'category')}
            isClearable={false}
            hidePlaceholder
            isSearchable={false}
          />
        </div>
        {category.has_types && (
          <div className="col-md-3">
            <SelectInput
              placeholder="Package Type"
              options={types}
              value={type}
              onChange={data => onHandleChange(data, 'type')}
              isClearable={false}
              hidePlaceholder
              isSearchable={false}
            />
          </div>
        )}
      </div>
      <div className="d-flex flex-wrap package-card-wrapper">
        {loading ? (
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : packages.length ? (
          packages.map((item, ind) => (
            <div key={ind} className="package-card-container">
              <PackageCard
                data={{
                  name: item.trial_package ? 'Free trial' : `₹ ${item.amount}`,
                  expiary: item.type || item.validity,
                  patients: item.credits,
                  details: item.description,
                  isRed: item.trial_package,
                  status: item.active ? 'ACTIVE' : '',
                  isCustom: item.category === 'custom',
                }}
                showBtn
                BtnFooter={() => getActions(item.active, item.uuid)}
              />
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
      <ConfirmationModal actionObject={actionObject}></ConfirmationModal>
    </div>
  );
}

export default PackageList;
