import React from 'react';
import { ContainedButton } from '../Buttons/Button';
import Container from '../Wrappers/Container';
// import TextInput from '../FormInputs/TextInput/TextInput';
import Socials from '../Common/Socials/Socials';
import { NavLink } from 'react-router-dom';
import {PhoneIcon} from "../../assets/icons";

function Footer(props) {
  return (
    <footer>
      <Container>
        {/* <div className="footer-subscribe-section">
          <div className="row">
            <div className="col-md-6 col-lg-6 mb-4">
              <h3 className="red-heading">Subscribe to our Newsletter</h3>
            </div>
            <div className="col-md-4 col-lg-3 mb-4">
              <TextInput placeholder="Enter your email ID"></TextInput>
            </div>
            <div className="col-md-2 col-lg-3 mb-4">
              <OutlinedButton redOutline>Subscribe</OutlinedButton>
            </div>
          </div>
        </div> */}
        <div className="flex-column footer-contact py-4 mb-4">
          <div className="d-flex justify-content-center">
            <div className="phone-icon-wrapper">
              {PhoneIcon}
            </div>
            <div className="contact-text">
              Contact our sales team for a free demo, today at <a href="tel:18008910235" className="contact-no">18008910235</a>
            </div>
          </div>
          <ContainedButton black className="call-toll-free-btn mt-3">
            <a href="tel:18008910235" className="d-flex align-items-center">
              <span>Call Toll Free Number</span> {PhoneIcon}
            </a>
          </ContainedButton>
        </div>
        <ul className="navbar-nav text-center on-desktop-hide mobile-footer-nav">
          {/* <li className="pb-4">
            <NavLink to="/faq">FAQs</NavLink>
          </li> */}
          <li className="pb-4">
            <NavLink to="/terms-and-conditions">Terms & Conditions</NavLink>
          </li>
          <li className="pb-5">
            <NavLink to="/privacy-policy">Privacy Policy</NavLink>
          </li>
        </ul>
        <div className="d-flex justify-content-center mb-4 pb-2 text-capitalize footer-nav-links">
          <ul className="navbar-nav text-center mr-5">
            <li className="pb-1">
              <b>Product</b>
            </li>
            {/* <li className="pb-1">For Path Labs</li>
            <li className="pb-1">For Patients</li>
            <li className="pb-1">For Doctors</li> */}
            <li className="pb-1">
              <NavLink to="/packages">Pricing</NavLink>
            </li>
          </ul>
          <ul className="navbar-nav text-center mr-5">
            <li className="pb-1">
              <b>Company</b>
            </li>
            <li className="pb-1">
              <NavLink to="/about">About</NavLink>
            </li>
            <li className="pb-1">
              <NavLink to="/contact">Contact</NavLink>
            </li>
            {/* <li className="pb-1">
              <NavLink to="/blogs">Blogs</NavLink>
            </li> */}
          </ul>
          <ul className="navbar-nav text-center mr-5">
            <li className="pb-1">
              <b>Resources</b>
            </li>
            {/* <li className="pb-1">
              <NavLink to="/faq">FAQs</NavLink>
            </li> */}
            <li className="pb-1">
              <NavLink to="/terms-and-conditions">Terms & Conditions</NavLink>
            </li>
            <li className="pb-1">
              <NavLink to="/privacy-policy">Privacy Policy</NavLink>
            </li>
          </ul>
        </div>
        <Socials parentClasses="footer-social-links justify-content-center mb-4" middleIconClass="mx-5"></Socials>
        <div className="text-center text-capitalize copyright-section">
          <span>copyright &#x24B8; 2020 All Rights reserved</span>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
