import React from "react";
import { bool, func } from "prop-types";

const Burger = ({ open, setOpen, className = "" }) => {
  var classes = `menu-btn ${className} ${open ? "open" : ""}`;
  const isExpanded = open ? true : false;
  return (
    <div
      open={open}
      onClick={() => setOpen(!open)}
      className={classes}
      aria-label="Toggle menu"
      aria-expanded={isExpanded}
    >
      <div className="menu-btn__burger"></div>
    </div>
  );
};
Burger.propTypes = {
  open: bool.isRequired,
  setOpen: func.isRequired
};

export default Burger;
