import React, { useEffect, useState } from 'react';
import Container from '../../../components/Wrappers/Container';
import { SectionWrapper } from '../../../components/Wrappers/SectionWrapper';
import { ourVision } from '../../../assets';
import { ContainedButton, OutlinedButton } from '../../../components/Buttons/Button';
import Slick from '../../../components/Slick/Slick';
import BookDemoModal from '../../../components/Common/BookDemoModal/BookDemoModal';
import Notification from '../../../components/Notification/Notification';
import membersData from '../../../utils/members.js';
import ConfirmationModal from '../../../components/Modal/ConfirmationModal';

const Card = ({ data }) => {
  return (
    <div className="card team-member-card">
      <div className="card-head">
        <p className="member-role text-right">{data.designation}</p>
      </div>
      <div className="card-body text-center">
        <img src={data.profileImage} className="member-img" alt="Member" />
      </div>
      <div className="card-foot d-flex justify-content-between align-items-center">
        <h5 className="member-name">{data.name}</h5>
        <a href={data.linkedInUrl} target="_blank" rel="noopener noreferrer">
          <span className="linked-in-icon social-icon"></span>
        </a>
      </div>
    </div>
  );
};

const About = ({ width }) => {
  const [actionObject, setActionObject] = useState();
  const [thankYouObject, setThankYouObject] = useState();
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="about-us-main-wrapper">
      <Notification {...notification} />
      {thankYouObject && <ConfirmationModal actionObject={thankYouObject}></ConfirmationModal>}
      <section className={`section-wrapper about-us-section`}>
        <Container>
          <div className="about-us-content">
            <span className="black-heading text-uppercase">ABOUT US</span>
            <br />
            <span className="red-heading">Get to know us better</span>
          </div>
        </Container>
      </section>
      <SectionWrapper sectionClass="our-vision">
        <div className="col-md-6">
          <div className="text-content-wrapper">
            <p className="section-top-hr" />
            <h3 className="content-heading red-heading mb-4">Our Vision</h3>
            <p className="content-info mb-5">
              The dream at sugarlogger is be a technology company that creates cutting edge products, carefully designed with knowledge &
              understanding to give users a great experience. Our first product helps people store and access their medical records with
              ease. The aim is to make life more comfortable as far as this space is concerned.
            </p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="image-content-wrapper">
            <img src={ourVision} alt="Our Vision" className="section-img" />
          </div>
        </div>
      </SectionWrapper>
      <SectionWrapper sectionClass="team-member">
        <div className="col-md-12">
          <div className="text-content-wrapper text-center">
            <p className="section-top-hr mx-auto" />
            <h3 className="content-heading red-heading mb-4">The Faces of Sugarlogger Team</h3>
            <p className="content-info mb-5">Meet our talented team of creative people, managers, and technology experts.</p>
          </div>
          <div className="members-info-wrapper">
            {width <= 767 ? (
              <Slick>
                {membersData.map((val, ind) => (
                  <Card key={ind} data={val}></Card>
                ))}
              </Slick>
            ) : (
              <div className="row">
                {membersData.map((val, ind) => (
                  <div className="col-md-6 col-lg-3" key={ind}>
                    <Card data={val}></Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SectionWrapper>
      <SectionWrapper sectionClass="get-sugarlogger">
        <div className="col-md-12">
          <div className="get-sugarlogger-content-wrapper mx-auto">
            <div className="text-content-wrapper text-center">
              <p className="section-top-hr mx-auto" />
              <h3 className="content-heading white-heading mb-4">Get Sugarlogger today!</h3>
              {/* <p className="content-info text-capitalize white-text mb-5"></p> */}
            </div>
            <div className="btn-wrapper">
              <ContainedButton
                red
                className="text-capitalize free-demo-btn"
                onClick={() =>
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
                  })
                }
              >
                Book a free demo
              </ContainedButton>
              <BookDemoModal actionObject={actionObject} setNotification={setNotification}></BookDemoModal>
              <OutlinedButton red className="sign-up-btn" link to="/packages">
                Sign Up
              </OutlinedButton>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default About;
