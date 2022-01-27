import React from "react";
import {
  ContainedButton,
  TextButton,
} from "../../../../components/Buttons/Button";
import TextInput from "../../../../components/FormInputs/TextInput/TextInput";
import SelectInput from "../../../../components/FormInputs/SelectInput/SelectInput";
import PackageCard from "../../../../components/Common/PackageCard/PackageCard";

const AddUser = ({ handleNext }) => {
  return (
    <form className="form-content">
      <div className="paper">
        <label className="paper-label">
          Add lab owner details <span>(You can add only one lab owner)</span>
        </label>
        <div className="row">
          <div className="col-8 col-md-5 mb-3">
            <SelectInput
              options={[]}
              value={""}
              onChange={(value) => {}}
              placeholder="User Type"
            ></SelectInput>
          </div>
        </div>
        <div className="row">
          <div className="mb-3 w-100 col-md-6 col-12">
            <TextInput placeholder="Mobile No."></TextInput>
          </div>
          <div className="mb-3 w-100 col-md-6 col-12">
            <TextInput placeholder="Email ID"></TextInput>
          </div>
        </div>
        <div className="row">
          <div className="mb-3 w-100 col-md-6 col-12">
            <TextInput placeholder="First Name"></TextInput>
          </div>
          <div className="mb-3 w-100 col-md-6 col-12">
            <TextInput placeholder="Last name"></TextInput>
          </div>
        </div>
        <div className="row">
          <div className="mb-3 w-100 col-md-6 col-12">
            <TextInput placeholder="Create Password"></TextInput>
          </div>
          <div className="mb-3 w-100 col-md-6 col-12">
            <TextInput placeholder="Confirm Password"></TextInput>
          </div>
        </div>
        <label className="paper-label mt-4">Add co-worker details</label>
        <div>
          <div className="row">
            <div className="mb-3 w-40 col-md-6 col-12">
              <div className="row">
                <div className="col-md-10 col-8">
                  <SelectInput
                    options={[]}
                    value={""}
                    onChange={(value) => {}}
                    placeholder="User Type"
                  ></SelectInput>
                </div>
              </div>
            </div>
            <div className="mb-3 w-100 col-md-6 col-12">
              <div className="row">
                <div className="col-md-10 col-8">
                  <SelectInput
                    options={[]}
                    value={""}
                    onChange={(value) => {}}
                    placeholder="Select Branch"
                  ></SelectInput>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="mb-3 w-100 col-md-6 col-12">
              <TextInput placeholder="Mobile No."></TextInput>
            </div>
            <div className="mb-3 w-100 col-md-6 col-12">
              <TextInput placeholder="Email ID"></TextInput>
            </div>
          </div>
          <div className="row">
            <div className="mb-3 w-100 col-md-6 col-12">
              <TextInput placeholder="First Name"></TextInput>
            </div>
            <div className="mb-3 w-100 col-md-6 col-12">
              <TextInput placeholder="Last name"></TextInput>
            </div>
          </div>
          <div className="row">
            <div className="mb-3 w-100 col-md-6 col-12">
              <TextInput placeholder="Create Password"></TextInput>
            </div>
            <div className="mb-3 w-100 col-md-6 col-12">
              <TextInput placeholder="Confirm Password"></TextInput>
            </div>
          </div>
        </div>
        <TextButton blue withIcon>
          <span className="add-circle-outline  mr-2"></span>ADD MORE ROLES
        </TextButton>
      </div>
      <div className="d-flex justify-content-end mb-3">
        <ContainedButton black color="primary" onClick={handleNext} withIcon>
          Next<span className="arrow-forward-icon  ml-2"></span>
        </ContainedButton>
      </div>
    </form>
  );
};

export default AddUser;
