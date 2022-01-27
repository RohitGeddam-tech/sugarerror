import React from "react";

const Container = ({ children, onClick, reference, fluid = false }) => {
  return (
    <div
      className={fluid ? "container-fluid" : "container"}
      onClick={onClick}
      ref={reference}
    >
      {children}
    </div>
  );
};
export default Container;
