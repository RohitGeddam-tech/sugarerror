import React, { useEffect, useState } from 'react';
import SelectInput from '../../../../components/FormInputs/SelectInput/SelectInput';
import TextInput from '../../../../components/FormInputs/TextInput/TextInput';
import Textarea from '../../../../components/FormInputs/Textarea/Textarea';
import PackageCard from '../../../../components/Common/PackageCard/PackageCard';
import { OutlinedButton } from '../../../../components/Buttons/Button';
import { fetchRequest } from '../../../../utils/api';
import CheckboxInput from '../../../../components/FormInputs/Checkbox/CheckboxInput';
import Notification from '../../../../components/Notification/Notification';

const defaultState = {
  category: {},
  type: {},
  name: '',
  description: '',
  credits: '',
  amount: '',
  renewable: true,
  trial_package: false,
};
function AddPackages(props) {
  const [packageCategory, setPackageCategory] = useState({ categories: [], types: [] });
  const [initials, setInitials] = useState(defaultState);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [btnLoading, setBtnLoading] = useState(false);

  //component did mount
  useEffect(() => {
    if (!packageCategory.categories.length)
      (async () => {
        const res = await fetchRequest({ url: '/super_admin/package_type_and_category', method: 'GET', isAuth: true });
        res && setBtnLoading(false);
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
    setInitials(initials => ({
      ...initials,
      category: packageCategory.categories.length ? packageCategory.categories[0] : {},
      type: packageCategory.types.length ? packageCategory.types[0] : {},
    }));
  }, [packageCategory]);

  const onHandleChange = (value, key) => {
    let obj = { ...initials };
    obj[key] = value;
    if (key === 'trial_package') {
      obj['amount'] = 0;
    }
    setInitials({ ...obj });
  };

  const handleSubmit = async e => {
    setErrors({});
    setBtnLoading(true);
    setNotification({ show: false, message: '', type: '' });
    e.preventDefault();
    let postObj = {
      ...initials,
      category: initials.category.category,
      type: initials.type.value,
    };
    const res = await fetchRequest({ url: '/super_admin/package', method: 'POST', isAuth: true, body: postObj });
    setBtnLoading(false);
    if (res && res.status === 200) {
      const data = await res.json();
      if (data.success) {
        data.message && setNotification({ show: true, message: data.message, type: 'success' });
      }
      setTimeout(() => props.history.push(`/${localStorage.getItem('loginAs')}/packages/list`), 2000);
    } else {
      const errObj = await res.json();
      setErrors({ ...errObj.errors });
      res.status !== 422 &&
        !Object.keys(errObj.error ? errObj.error : {}).length &&
        errObj.message &&
        setNotification({ show: true, message: errObj.message, type: 'error' });
    }
    return;
  };

  const { categories, types } = packageCategory;
  const { category, type, description, validity, credits, amount, renewable, trial_package } = initials;
  return (
    <div className="add-package-container">
      <Notification {...notification} />
      <div className="row">
        <div className="col-md-7 mr-3">
          <form onSubmit={handleSubmit}>
            <div className="paper">
              <p className="semi-bold title mb-3">Enter the required details</p>
              <div className="row mb-4">
                <div className="form-group col-md-6 col-12">
                  <SelectInput
                    placeholder="Category"
                    options={categories}
                    value={category}
                    onChange={data => onHandleChange(data, 'category')}
                    error={errors && errors['category']}
                    isClearable={false}
                  />
                </div>
                {category.has_types && (
                  <div className="form-group col-md-6 col-12">
                    <SelectInput
                      placeholder="Package Type"
                      options={types}
                      value={type}
                      onChange={data => onHandleChange(data, 'type')}
                      error={errors && errors['type']}
                    />
                  </div>
                )}
              </div>
              <div className="row mb-4">
                <div className="form-group col-md-6 col-12">
                  <TextInput
                    placeholder="Price (₹)"
                    value={amount || ''}
                    onChange={e => onHandleChange(e.target.value, 'amount')}
                    error={errors && errors['amount']}
                    disabled={trial_package}
                  />
                </div>
                <div className="form-group col-md-6 col-12">
                  <TextInput
                    placeholder="Patients"
                    value={credits || ''}
                    onChange={e => onHandleChange(e.target.value, 'credits')}
                    error={errors && errors['credits']}
                  />
                </div>
              </div>
              <div className="row">
                {!category.has_types && (
                  <div className="form-group col-md-5 col-12 mb-4">
                    <TextInput
                      placeholder="Duration (in days)"
                      value={validity || ''}
                      onChange={e => onHandleChange(e.target.value, 'validity')}
                      error={errors && errors['validity']}
                    />
                  </div>
                )}
              </div>
              <div className="row mb-4">
                <div className="form-group col-md-8 col-12">
                  <Textarea
                    placeholder="Description"
                    maxLength={60}
                    value={description || ''}
                    onChange={e => onHandleChange(e.target.value, 'description')}
                    error={errors && errors['description']}
                  />
                </div>
              </div>
              <div className="row mb-4">
                <div className="form-group col-md-5 col-12">
                  <CheckboxInput
                    name="renewable"
                    label="Renewable Package"
                    checked={renewable}
                    value={renewable}
                    blue
                    onClick={() => onHandleChange(!renewable, 'renewable')}
                  />
                </div>
                <div className="form-group col-md-6 col-12">
                  <CheckboxInput
                    name="trial_package"
                    label="Trial Package"
                    checked={trial_package}
                    blue
                    value={trial_package}
                    onClick={() => onHandleChange(!trial_package, 'trial_package')}
                  />
                </div>
              </div>
              <div className="row mt-5 mb-4">
                <div className="col-12">
                  <div className="w-100 d-flex justify-content-center">
                    <OutlinedButton className="mr-2" red onClick={() => setInitials(defaultState) || setErrors({})} disabled={btnLoading}>
                      Cancel
                    </OutlinedButton>
                    <OutlinedButton className="" blue type="submit" disabled={btnLoading} loading={btnLoading}>
                      Create
                    </OutlinedButton>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="col-md-3">
          <PackageCard
            data={{
              name: amount ? `₹ ${amount}` : '-',
              // value: label,
              expiary: category.value === 'custom' ? validity : type ? type.value : '',
              patients: credits,
              details: description,
              isCustom: category.value === 'custom',
            }}
            className={''}
            showBtn={false}
          />
        </div>
      </div>
    </div>
  );
}

export default AddPackages;
