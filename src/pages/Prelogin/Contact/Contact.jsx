import React, { useEffect, useState } from 'react';
import Container from '../../../components/Wrappers/Container';
import Socials from '../../../components/Common/Socials/Socials';
import TextInput from '../../../components/FormInputs/TextInput/TextInput';
import Textarea from '../../../components/FormInputs/Textarea/Textarea';
import { ContainedButton } from '../../../components/Buttons/Button';
import { fetchRequest } from '../../../utils/api';
import Notification from '../../../components/Notification/Notification';
import ConfirmationModal from '../../../components/Modal/ConfirmationModal';

const defaultState = {
  name: '',
  email: '',
  mobile: '',
  description: '',
};
export default function Contact() {
  const [contactData, setContactData] = useState({ ...defaultState });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [thankYouObject, setThankYouObject] = useState();
  const { name, email, mobile, description } = contactData;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (value, key) => {
    let obj = { ...contactData };
    obj[key] = value;
    setContactData({ ...obj });
  };

  const handleOnSend = async () => {
    setErrors({});
    setNotification({ show: false, message: '', type: '' });
    let body = { ...contactData };

    const res = await fetchRequest({ url: '/contact_us', method: 'POST', body });
    if (res && res.status === 200) {
      const data = await res.json();
      if (data.success) {
        setContactData({ ...defaultState });
        data.message &&
          setThankYouObject({
            title: 'Thank you',
            msg: 'Thank you for writing to us. We will contact you shortly.',
            cancelAction: 'Close',
            isModalOpen: true,
            isThankYouModal: true,
          });
      }
    } else {
      const errObj = await res.json();
      setErrors({ ...errObj.errors });
      res.status !== 422 &&
        !Object.keys(errObj.error ? errObj.error : {}).length &&
        errObj.message &&
        setNotification({ show: true, message: errObj.message, type: 'error' });
    }
  };

  return (
    <section className={`section-wrapper contact-us-section`}>
      <Notification {...notification} />
      {thankYouObject && <ConfirmationModal actionObject={thankYouObject}></ConfirmationModal>}
      <Container>
        <div className="contact-us-wrapper row flex-column">
          <div className="enquiry-question">
            <span className="black-heading text-uppercase">HAVE A QUESTION?</span>
            <br />
            <span className="red-heading">We’ll answer</span>
            <p className="para my-5">
              Feel free to get in touch with us. We are always open to questions, doubts and new suggestions. Write to us or reach us and
              we’ll get back to you soon.
            </p>
          </div>
          <div className="write-us-section">
            <div className="flex-column mb-4">
              <div className="primary-gray">You can also write to us at:</div>
              <div><a href="mailto:sugarlogger.info@gmail.com">sugarlogger.info@gmail.com</a></div>
            </div>
            <div className="flex-column mb-4">
              <div className="primary-gray">Feel like talking? Call us</div>
              <div><a href="tel:18008910235">18008910235</a></div>
            </div>
            <div className="flex-column mb-4">
              <div className="primary-gray mb-3">Follow us on:</div>
              <div>
                <Socials parentClasses="contact-us-social-links" middleIconClass="mx-4"></Socials>
              </div>
            </div>
          </div>
          <div className="form-section order-1">
            <form action="" className="contact-us-form">
              <div className="form-group">
                <TextInput
                  value={name}
                  onChange={e => handleChange(e.target.value, 'name')}
                  error={errors && errors['name']}
                  placeholder="Name*"
                />
              </div>
              <div className="form-group">
                <TextInput
                  value={email}
                  onChange={e => handleChange(e.target.value, 'email')}
                  error={errors && errors['email']}
                  placeholder="Email*"
                />
              </div>
              <div className="form-group">
                <TextInput
                  value={mobile}
                  onChange={e => handleChange(e.target.value, 'mobile')}
                  error={errors && errors['mobile']}
                  placeholder="Mobile No.*"
                />
              </div>
              <div className="form-group">
                <Textarea
                  value={description}
                  onChange={e => handleChange(e.target.value, 'description')}
                  error={errors && errors['description']}
                  placeholder="What do you want to say*"
                  rows="4"
                ></Textarea>
              </div>
              <div className="form-group">
                <ContainedButton red className="send-btn" onClick={handleOnSend}>
                  Send
                </ContainedButton>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
