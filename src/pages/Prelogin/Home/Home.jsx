import React, { useEffect, useState } from 'react';
import { SectionWrapper } from '../../../components/Wrappers/SectionWrapper';
import { ContainedButton } from '../../../components/Buttons/Button';
import { heroImage, saveMoney, mobileImage, saveTime, satisfiedCustomer, savePaper } from '../../../assets/index';
import BookDemoModal from '../../../components/Common/BookDemoModal/BookDemoModal';
import ArticleWrapper from '../../../components/Common/ArticleWrapper/ArticleWrapper';
import Notification from '../../../components/Notification/Notification';
import ConfirmationModal from '../../../components/Modal/ConfirmationModal';
import LazyImage from '../../../components/Common/LazyImage/LazyImage';

function Home() {
  const [actionObject, setActionObject] = useState();
  const [thankYouObject, setThankYouObject] = useState();
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Notification {...notification} />
      <SectionWrapper sectionClass="landing">
        {thankYouObject && <ConfirmationModal actionObject={thankYouObject}></ConfirmationModal>}
        <div className="col-md-6">
          <div className="left-landing-section">
            <h2 className="landing-content-heading black-heading text-uppercase mb-4">Welcome to Sugarlogger</h2>
            <p className="landing-content-info mb-4">
              Sugarlogger is a one-stop solution for pathology labs to manage their businesses smoothly. All your billing details, patients
              detail, and reports accessible at the click of your mouse. It also means happy customers because of the convenience for your
              patients.
            </p>
            <div className="landing-content-btn mb-4">
              <ContainedButton
                red
                className="mr-3"
                onClick={() => {
                  setActionObject({
                    title: 'Schedule your free demo',
                    confirmAction: 'Submit',
                    isModalOpen: true,
                    handleSuccess: () => {
                      setThankYouObject({
                        title: 'Thank you',
                        msg: 'Thank you for your interest. Our team will get in touch with you soon.',
                        cancelAction: 'Close',
                        isModalOpen: true,
                        isThankYouModal: true,
                      });
                    },
                  });
                }}
              >
                Book a Free Demo
              </ContainedButton>
              <BookDemoModal actionObject={actionObject} setNotification={setNotification}></BookDemoModal>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="right-landing-section">
            <LazyImage src={heroImage} alt="Hero" className="img-fluid landing-section-img" />
          </div>
        </div>
      </SectionWrapper>
      <SectionWrapper sectionClass="why-sugarlogger">
        <div className="col-lg-4 order-lg-2">
          <div className="image-content-wrapper on-mobile-hide">
          <LazyImage src={mobileImage} alt="Mobile" className="section-img" width={275} height={500}/>
          </div>
        </div>
        <div className="col-lg-8 order-lg-1">
          <div className="text-content-wrapper">
            <p className="section-top-hr" />
            <h3 className="content-heading red-heading mb-4">Why Sugarlogger</h3>
            <div className="content-extra mb-4">
              <ArticleWrapper
                image={{ src: savePaper, className: 'save-paper-img' }}
                heading="Saves Paper"
                para="No more unnecessary printing of reports unless required"
              ></ArticleWrapper>
              <ArticleWrapper
                image={{ src: saveTime, className: 'save-time-img' }}
                heading="Saves Time"
                para="No more waiting around for patients to come and collect their reports."
              ></ArticleWrapper>
              <ArticleWrapper
                image={{ src: saveMoney, className: 'save-money-img' }}
                heading="Saves Money"
                para="No more expenditure on letterheads and papers for printing."
              ></ArticleWrapper>
              <ArticleWrapper
                image={{ src: satisfiedCustomer, className: 'satisfied-customer-img' }}
                heading="Satisfied Customer"
                para="Readily accessible patient reports on your mobile phone. No more storing of reports on a paper in files."
              ></ArticleWrapper>
            </div>
          </div>
        </div>
      </SectionWrapper>
      {/* <CustomerReview></CustomerReview> */}
      {/* <BlogSection></BlogSection> */}
    </>
  );
}
export default Home;
