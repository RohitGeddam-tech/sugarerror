import React, { useEffect, useState } from 'react';
import { ContainedButton, OutlinedButton } from '../../../../components/Buttons/Button';
import TextInput from '../../../../components/FormInputs/TextInput/TextInput';
import SelectInput from '../../../../components/FormInputs/SelectInput/SelectInput';
import PackageCard from '../../../../components/Common/PackageCard/PackageCard';
import Textarea from '../../../../components/FormInputs/Textarea/Textarea';
import { fetchRequest } from '../../../../utils/api';
import CheckboxInput from '../../../../components/FormInputs/Checkbox/CheckboxInput';

const PackageDetails = ({ data, setData, handleSavePathLab, handleCancel, setCustomPackageData, error, setError, cancel }) => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState({});
  const [customPackage, setCustomPackage] = useState({
    amount: '',
    description: '',
    label: '',
    name: '',
    type: '',
    validity: '',
    credits: '',
    renewable: false,
    custom: false,
  });

  useEffect(() => {
    if (cancel) {
      setSelectedPackage({});
      setCustomPackage({});
    }
  }, [cancel]);

  useEffect(() => {
    setCustomPackageData({ ...customPackage });
  }, [customPackage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!packages.length)
      (async () => {
        const res = await fetchRequest({ url: '/super_admin/package', method: 'GET', isAuth: true });
        if (res && res.status === 200) {
          const { data } = await res.json();
          let packageList = [...data]
            .filter(val => val.active)
            .reduce((result, item) => {
              let { type, category, amount, uuid } = item;
              if (result[type] && category === 'default')
                result[type] = [
                  ...result[type],
                  { label: item.trial_package ? 'Free trial' : amount ? `₹ ${amount}` : '-', value: uuid, ...item },
                ];
              else if (result[category] && category === 'custom')
                result[category] = [
                  ...result[category],
                  { label: item.trial_package ? 'Free trial' : amount ? `₹ ${amount}` : '-', value: uuid, ...item },
                ];
              else
                result[type ? type : category] = [
                  { label: item.trial_package ? 'Free trial' : amount ? `₹ ${amount}` : '-', value: uuid, ...item },
                ];
              return result;
            }, []);
          let packageKeys = Object.keys(packageList);
          let packages = [
            { key: 'monthly_package' },
            { key: 'quarterly_package' },
            { key: 'half_yearly_package' },
            { key: 'yearly_package' },
          ];
          packageKeys.forEach(item => {
            const index = packages.findIndex(pack => item === pack.key);
            if (index >= 0)
              packages[index] = {
                label: item.split('_').join(' ').replace('package', 'pack'),
                options: packageList[item],
              };
          });
          packages.push({ label: <div>+ Custom Pack</div>, value: 'custom' });
          setPackages(packages);
          return data;
        }
        return;
      })();
  }, [packages.length]);

  useEffect(() => {
    if (selectedPackage.uuid) setData(selectedPackage.uuid);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data?.uuid && data?.category == "default") {
      setSelectedPackage(data)
    }
  }, [data]); 

  const onHandleChange = (value, key) => {
    let obj = { ...customPackage };
    obj[key] = value;
    setCustomPackage({ ...obj });
  };

  const handlePackageChange = data => {
    setError({});
    if (data.value === 'custom') {
      setCustomPackage({ ...customPackage, custom: true, name: 'Custom' });
      setSelectedPackage({});
      setData({});
    } else {
      setSelectedPackage(data) || setCustomPackage({ ...customPackage, custom: false });
      setData(data);
    }
  };

  const { amount, description, label, type, validity, credits, custom, renewable } = customPackage;
  return (
    <div className="form-content">
      <div className="paper">
        <div className="row">
          <div className="col-sm-12 col-md-5">
            <label className="paper-label">Package details</label>
            <div className="row">
              <div className="form-group mb-3 col-12">
                <SelectInput
                  options={packages.map(item => ({
                    label: item.description,
                    value: item.uuid,
                    ...item,
                    subMenu:
                      item.services &&
                      item.services.length &&
                      item.services.map(subMenu => ({ label: subMenu.name, value: subMenu.uuid, ...subMenu })),
                  }))}
                  onChange={data => handlePackageChange(data)}
                  value={custom ? { label: 'Custom package', value: 'custom' } : selectedPackage}
                  placeholder="Package Type"
                  error={error && error['package']}
                ></SelectInput>
              </div>
            </div>
            {custom ? (
              <>
                <div className="row">
                  <div className="form-group mb-3 col-8 col-md-12">
                    <TextInput
                      value={validity || ''}
                      onChange={option => onHandleChange(option.target.value, 'validity')}
                      error={error && error['validity']}
                      placeholder="Validity"
                    ></TextInput>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group mb-3 col-8 col-md-12">
                    <TextInput
                      value={credits || ''}
                      onChange={option => onHandleChange(option.target.value, 'credits')}
                      error={error && error['credits']}
                      placeholder="Credits"
                    ></TextInput>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group mb-3 col-8 col-md-12">
                    <TextInput
                      value={amount || ''}
                      type="number"
                      onChange={option => onHandleChange(option.target.value, 'amount')}
                      error={error && error['amount']}
                      placeholder="Price(Rs)"
                    ></TextInput>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group mb-3 col-12">
                    <Textarea
                      value={description || ''}
                      maxLength={60}
                      onChange={option => onHandleChange(option.target.value, 'description')}
                      error={error && error['description']}
                      placeholder="Description"
                    ></Textarea>
                  </div>
                </div>
                <div className="row">
                  <div className="form-group mb-3 col-12">
                    <CheckboxInput
                      name="renewable"
                      label="Renewable Package"
                      checked={renewable}
                      value={renewable}
                      blue
                      onClick={() => onHandleChange(!renewable, 'renewable')}
                    />
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="col-sm-12 col-md-7">
            <div className="w-75 mx-auto pt-3 px-3">
              <PackageCard
                data={{
                  name: selectedPackage.trial_package
                    ? 'Free trial'
                    : custom
                    ? 'Custom'
                    : selectedPackage.amount
                    ? `₹ ${selectedPackage.amount}`
                    : '-',
                  value: selectedPackage.label || label,
                  expiary: selectedPackage.type || validity,
                  patients: selectedPackage.credits || credits,
                  details: selectedPackage.description || description,
                  isRed: selectedPackage.trial_package,
                  isCustom: custom,
                }}
                className={(selectedPackage.type ? selectedPackage.type : type) === 'free' ? 'active' : ''}
                showBtn={false}
              />
            </div>
          </div>
        </div>
        {selectedPackage.trial_package && (
          <div className="row my-4">
            <div className="col-md-12">
              <OutlinedButton red className="mr-2" onClick={handleCancel}>
                Cancel
              </OutlinedButton>
              <ContainedButton lightBlue color="primary" withIcon onClick={handleSavePathLab}>
                Register Lab
              </ContainedButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default PackageDetails;
