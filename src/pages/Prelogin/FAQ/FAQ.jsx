import React, { useEffect, useState } from 'react';
import NavTab from '../../../components/NavTab/NavTab';
import { SectionWrapper } from '../../../components/Wrappers/SectionWrapper';
import Accordion from '../../../components/Accordion/Accordion';
import faqData from '../../../utils/faqs';

let tabData = [
  { name: 'Path Labs', isActive: true },
  { name: 'Patients', isActive: false },
  { name: 'Doctors', isActive: false },
];

const FAQ = props => {
  const [activeTab, setActiveTab] = useState(tabData[0]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <SectionWrapper sectionClass="faq">
      <div className="col-md-12">
        <div className="content-wrapper text-center">
          <span className="black-heading">FAQs</span>
          <div className="row">
            <div className="col-md-11">
              <NavTab tabData={tabData} activeTab={activeTab} onTabChange={tab => setActiveTab(tab)}>
                <Accordion data={faqData.data}></Accordion>
              </NavTab>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default FAQ;
