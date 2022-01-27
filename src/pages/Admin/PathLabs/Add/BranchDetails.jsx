import React from 'react';
import { ContainedButton, TextButton } from '../../../../components/Buttons/Button';
import TextInput from '../../../../components/FormInputs/TextInput/TextInput';
import SelectInput from '../../../../components/FormInputs/SelectInput/SelectInput';
import PackageCard from '../../../../components/Common/PackageCard/PackageCard';
import Checkbox from '../../../../components/FormInputs/Checkbox/CheckboxInput';

const BranchDetails = ({ handleNext }) => {
  return (
    <form className="form-content">
      <div className="paper">
        <label className="paper-label">Branch details</label>
        <div className="row">
          <div className="col-md-12  col-12">
            <Checkbox
              name="same-as-office-address"
              label="Same as office address"
              checked={false}
              //   onClick={() => setRememberMe(!rememberMe)}
            ></Checkbox>
          </div>
        </div>
        <div className="row">
          <div className="w-40 mb-3 col-md-4 col-8">
            <TextInput placeholder="Branch Name"></TextInput>
          </div>
        </div>
        <div className="row">
          <div className="mb-3 col-md-6 col-12">
            <TextInput placeholder="Address Line 1"></TextInput>
          </div>
          <div className="mb-3 col-md-6 col-12">
            <TextInput placeholder="Address Line 2"></TextInput>
          </div>
        </div>
        <div className="row">
          <div className="mb-3 col-md-6 col-6">
            <TextInput placeholder="Pincode"></TextInput>
          </div>
          <div className="mb-3 col-md-6 col-6">
            <TextInput placeholder="City"></TextInput>
          </div>
          <div className="mb-3 col-md-6 col-6">
            <TextInput placeholder="State"></TextInput>
          </div>
        </div>
        <TextButton blue withIcon>
          <span className="add-circle-outline mr-2"></span>ADD MORE BRANCHES
        </TextButton>
      </div>
      <div className="d-flex justify-content-end  mb-3">
        <ContainedButton black color="primary" onClick={handleNext} withIcon>
          Next<span className="arrow-forward-icon  ml-2"></span>
        </ContainedButton>
      </div>
    </form>
  );
};

export default BranchDetails;
