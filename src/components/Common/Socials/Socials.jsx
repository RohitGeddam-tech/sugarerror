import React from 'react';
import PropTypes from 'prop-types';
import { FacebookIcon, InstagramIcon, TwitterIcon } from '../../../assets/icons';

function Socials({ parentClasses, middleIconClass }) {
  return (
    <div className={`d-flex social-links ${parentClasses}`}>
      <div>
        <a href="https://m.facebook.com/sugarlogger/" target="_blank" rel="noopener noreferrer">
          <span className="social-icon">{FacebookIcon}</span>
        </a>
      </div>
      <div className={`${middleIconClass}`}>
        <a href="https://www.instagram.com/sugarlogger_/" target="_blank" rel="noopener noreferrer">
          <span className="social-icon">{InstagramIcon}</span>
        </a>
      </div>
      <div>
        <a href="https://twitter.com/SugarLogger" target="_blank" rel="noopener noreferrer">
          <span className="social-icon">{TwitterIcon}</span>
        </a>
      </div>
    </div>
  );
}

Socials.propTypes = {
  parentClass: PropTypes.string,
};

export default Socials;
