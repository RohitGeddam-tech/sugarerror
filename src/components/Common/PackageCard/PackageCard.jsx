import React from 'react';
import { ContainedButton } from '../../Buttons/Button';

const PackageCard = ({ data, className = '', showBtn, BtnFooter, showInfoIcon }) => {
  className = `${className} ${data.isCustom ? 'custom-package' : ''} ${data.isRed ? 'red-content' : ''}`;
  let expiary =
    data.expiary !== ''
      ? (data.expiary === 'monthly_package' && 'for 1 month') ||
        (data.expiary === 'quarterly_package' && 'for 3 months') ||
        (data.expiary === 'half_yearly_package' && 'for 6 months') ||
        (data.expiary === 'yearly_package' && 'for 1 year') ||
        (data.isCustom && `for ${data.expiary || 'x'} days`)
      : '-';
  return (
    <div className={`card package-card text-center ${className}`}>
      <div className="card-head">
        <span className="package-status">{data.status}</span>
        <p className="red-heading package-name">{data.name ? data.name : '-'}</p>
        <p className="package-expiary">{expiary || '-'}</p>
        <div className="package-patients d-flex justify-content-center">
          <p>{data.patients ? data.patients : '0'} patients</p>
          {showInfoIcon && <p className="i-btn-icon ml-2"></p>}
        </div>
      </div>
      <div className="card-body text-center">
        <p>{data.details ? data.details : '---'}</p>
      </div>
      {BtnFooter ? (
        <BtnFooter />
      ) : (
        showBtn && (
          <div className="card-foot">
            {data.isCustom ? (
              <ContainedButton darkBlue link to="/contact">
                Contact Us
              </ContainedButton>
            ) : (
              <ContainedButton link to="/register" black>
                Get Started
              </ContainedButton>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default PackageCard;
