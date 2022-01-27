import React from "react";
import PropTypes from "prop-types";

const Stepper = ({ list = [], activeStep }) => {
  return (
    <div className="stepper-container">
      {list.map((item, ind) => (
        <div
          key={ind}
          className={`step ${
            ind === activeStep
              ? "active-step"
              : ind < activeStep
              ? "completed-step"
              : ""
          }`}
          style={{ width: `${100 / list.length}%` }}
        >
          <div
            className={`step-number ${
              ind !== list.length - 1 ? "show-connector" : ""
            }`}
          >
            <span className="number">{ind + 1}</span>
          </div>
          <div className="step-name">{item}</div>
        </div>
      ))}
    </div>
  );
};

Stepper.propTypes = {
  list: PropTypes.array,
  activeStep: PropTypes.number,
};

export default Stepper;
