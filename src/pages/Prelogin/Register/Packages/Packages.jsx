import React, { useState, useEffect } from 'react';
import Container from '../../../../components/Wrappers/Container';
import SelectInput from '../../../../components/FormInputs/SelectInput/SelectInput';
import Slick from '../../../../components/Slick/Slick';
import { ContainedButton } from '../../../../components/Buttons/Button';

import { cloudStorage, onlineShare, efficient, easyToUse } from '../../../../assets/index';
import { SectionWrapper } from '../../../../components/Wrappers/SectionWrapper';
import PackageCard from '../../../../components/Common/PackageCard/PackageCard';
import useWindowSize from '../../../../hooks/userWindowSize';
import { fetchRequest } from '../../../../utils/api';

const options = [
  { value: 'monthly_package', label: 'Monthly Packs', formatted_label: 'for 1 month' },
  { value: 'quarterly_package', label: 'Quarterly Packs', formatted_label: 'for 3 months' },
  { value: 'half_yearly_package', label: 'Half-Yearly Packs', formatted_label: 'for 6 months' },
  { value: 'yearly_package', label: 'Yearly Packs', formatted_label: 'for 1 year' },
];

const Packages = props => {
  const [width] = useWindowSize();
  const [selectedPackage, setPackage] = useState({
    value: 'monthly_package',
    label: 'Monthly Packs',
  });
  const [packages, setPackages] = useState([]);

  // const customPackage = {
  //   name: 'Custom',
  //   expiary: 'for x months',
  //   patients: 'x',
  //   details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  //   isCustom: true,
  // };

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      const res = await fetchRequest({ url: '/packages', method: 'GET', isAuth: false });
      if (res && res.status === 200) {
        const data = await res.json();
        setPackages(data);
        return data;
      }
      return;
    })();
  }, []);

  const getPackageCard = packages => {
    return (
      <>
        {packages.length ? (
          packages.map(
            val =>
              val.type === selectedPackage.value && val.packages.length
                ? val.packages.map((item, key) => (
                    <PackageCard
                      key={key}
                      data={{
                        name: item.trial_package ? 'Free trial' : `₹ ${item.amount}`,
                        expiary: item.type,
                        patients: item.credits,
                        details: item.description,
                        isRed: item.trial_package,
                      }}
                      // className={item.trial_package ? 'active' : ''}
                      showBtn
                      BtnFooter={() => (
                        <div className="d-flex justify-content-center mb-3">
                          <ContainedButton link to={{ pathname: '/register', state: { ...item } }} black>
                            Get Started
                          </ContainedButton>
                        </div>
                      )}
                    />
                  ))
                : null, // If we pass Empty Fragment. We also need to add key for the same. Hence making it to null
          )
        ) : (
          <></>
        )}
      </>
    );
  };

  return (
    <>
      <div className="package-section">
        <div className="clip-image-wrapper our-packages-wrapper">
          <div className="package-container-headings">
            <Container>
              <h2 className="black-heading text-uppercase pt-5 pb-3">Our Packages</h2>
              <h3 className="red-heading pb-4">Find a plan according to your requirement</h3>
            </Container>
          </div>
          <div className="package-container-content">
            <Container>
              <div className="package-header">
                {width <= 767 ? (
                  <div className="form-group">
                    <SelectInput options={options} value={selectedPackage} onChange={value => setPackage(value)}></SelectInput>
                  </div>
                ) : (
                  <ul className="nav package-nav mb-4">
                    {options.map((val, ind) => (
                      <li
                        className={`nav-item ${selectedPackage.value === val.value ? 'active' : ''}`}
                        key={ind}
                        onClick={() => setPackage(val)}
                      >
                        <span className="nav-link" data-active={val.value}>
                          {val.label}
                        </span>
                        <span className="nav-border"></span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="package-body">
                {width <= 767 ? (
                  <>
                    <Slick>{getPackageCard(packages)}</Slick>
                    {/* <div className="custom-package-wrapper">
                      <PackageCard data={customPackage} showBtn showInfoIcon></PackageCard>
                    </div> */}
                  </>
                ) : (
                  <>
                    <div className="d-flex package-card-wrapper">
                      {getPackageCard(packages)}
                      {/* {width >= 992 ? <PackageCard data={customPackage} showBtn></PackageCard> : ''} */}
                    </div>
                    {/* {width < 992 && width >= 768 ? (
                      <div className="custom-package-wrapper">
                        <PackageCard data={customPackage} showBtn></PackageCard>
                      </div>
                    ) : (
                      ''
                    )} */}
                  </>
                )}
              </div>
            </Container>
          </div>
        </div>
        <div className="features-wrapper text-center mx">
          <Container>
            <div className="row">
              <div className="col-md-6 col-lg-3">
                <div className="flex feature">
                  <img src={cloudStorage} alt="Cloud Storage" className="feature-img mt-4 mb-4" />
                  <p className="feature-name">Unlimited Storage</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="flex feature">
                  <img src={onlineShare} alt="Online Share" className="feature-img mb-3" />
                  <p className="feature-name">Share reports & bills completely online</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="flex feature">
                  <img src={efficient} alt="Efficient Lab Management" className="feature-img mb-3" />
                  <p className="feature-name">Efficient Lab Management</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="flex feature">
                  <img src={easyToUse} alt="Easy to Use" className="feature-img mb-3" />
                  <p className="feature-name">Easy to Use</p>
                </div>
              </div>
            </div>
            {/* <div className="show-more-feature">
              <ContainedButton black>View All Features</ContainedButton>
           <OutlinedButton>+ 100 more features</OutlinedButton> 
            </div> */}
          </Container>
        </div>
        <SectionWrapper sectionClass="contact-us">
          <div className="col-md-12">
            <div className="contact-us">
              <div className="text-content-wrapper text-center">
                <p className="section-top-hr mx-auto" />
                <h3 className="content-heading white-heading mb-4">Not sure about the right plan?</h3>
              </div>
              <div className="btn-wrapper text-center">
                <ContainedButton red link to="/contact">
                  Contact Us
                </ContainedButton>
              </div>
            </div>
          </div>
        </SectionWrapper>
        {/* <SectionWrapper sectionClass="questions-asked">
          <div className="col-md-12 col-lg-11">
            <div className="contact-us">
              <div className="text-content-wrapper">
                <p className="section-top-hr" />
                <h3 className="content-heading red-heading mb-4">Frequently Asked Questions</h3>
              </div>
              <div className="questions-wrapper text-center">
                <Accordion></Accordion>
              </div>
            </div>
          </div>
        </SectionWrapper> */}
      </div>
    </>
  );
};

export default Packages;
