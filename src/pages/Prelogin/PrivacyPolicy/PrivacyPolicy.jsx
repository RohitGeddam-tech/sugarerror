import React, { useEffect } from 'react';
import { SectionWrapper } from '../../../components/Wrappers/SectionWrapper';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <p className="black-heading text-center pt-4">Privacy Policy</p>
      <SectionWrapper sectionClass="privacy-policy">
        <p>
          This Privacy Policy governs the manner in which Sugarlogger Labs Pvt. Ltd.collects, uses, maintains and discloses information
          collected from users (each, a &quot;User&quot;) of the <span className="red">Sugar</span>
          <span className="black">logger.com</span> website (&quot;Site&quot;). This privacy policy applies to the Site and all products and
          services offered by Creliant Labs Private Limited.
        </p>
        <div>
          <h4>Personal identification information</h4>
          We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users
          visit our site, register on the site, respond to a survey, fill out a form, and in connection with other activities, services,
          features or resources we make available on our Site. Users may be asked for, as appropriate, name, email address, phone number. We
          will collect personal identification information from Users only if they voluntarily submit such information to us. Users can
          always refuse to supply personally identification information, except that it may prevent them from engaging in certain Site
          related activities.
        </div>
        <div>
          <h4>Non-personal identification information</h4>
          We may collect non-personal identification information about Users whenever they interact with our Site. Non-personal
          identification information may include the browser name, the type of computer and technical information about Users means of
          connection to our Site, such as the operating system and the Internet service providers utilized and other similar information.
        </div>
        <div>
          <h4>Web browser cookies</h4>
          Our Site may use &quot;cookies&quot; to enhance User experience. User&#39;s web browser places cookies on their hard drive for
          record-keeping purposes and sometimes to track information about them. User may choose to set their web browser to refuse cookies,
          or to alert you when cookies are being sent. If they do so, note that some parts of the Site may not function properly.
        </div>
        <div>
          <h4>How we use collected information</h4>
          <p className="mb-2">Sugarlogger Labs Pvt. Ltd. may collect and use Users personal information for the following purposes:</p>
          <ol>
            <li>
              To improve customer service Information you provide helps us respond to your customer service requests and support needs more
              efficiently.
            </li>
            <li>
              To personalize user experience We may use information in the aggregate to understand how our Users as a group use the services
              and resources provided on our Site.
            </li>
            <li>To improve our Site We may use feedback you provide to improve our products and services.</li>
            <li>
              To process payments We may use the information Users provide about themselves when placing an order only to provide service to
              that order. We do not share this information with outside parties except to the extent necessary to provide the service.
            </li>
            <li>
              To run a promotion, contest, survey or other Site feature To send Users information they agreed to receive about topics we
              think will be of interest to them.
            </li>
            <li>
              To send periodic emails We may use the email address to send User information and updates pertaining to their order. It may
              also be used to respond to their inquiries, questions, and/or other requests. If User decides to opt-in to our mailing list,
              they will receive emails that may include company news, updates, related product or service information, etc. If at any time
              the User would like to unsubscribe from receiving future emails, they may do so by contacting us via our Site.
            </li>
          </ol>
        </div>
        <div>
          <h4>How we protect your information</h4>
          <p className="mb-2">
            We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized
            access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data
            stored on our Site.
          </p>
          <p>
            Sensitive and private data exchange between the Site and its Users happens over a SSL secured communication channel and is
            encrypted and protected with digital signatures.
          </p>
        </div>
        <div>
          <h4>Sharing your personal information</h4>
          We do not sell, trade, or rent Users personal identification information to others. We may share generic aggregated demographic
          information not linked to any personal identification information regarding visitors and users with our business partners, trusted
          affiliates and advertisers for the purposes outlined above. We may use third party service providers to help us operate our
          business and the Site or administer activities on our behalf, such as sending out newsletters or surveys. We may share your
          information with these third parties for those limited purposes provided that you have given us your permission.
        </div>
        <div>
          <h4>Third party websites</h4>
          Users may find advertising or other content on our Site that link to the sites and services of our partners, suppliers,
          advertisers, sponsors, licensors and other third parties. We do not control the content or links that appear on these sites and
          are not responsible for the practices employed by websites linked to or from our Site. In addition, these sites or services,
          including their content and links, may be constantly changing. These sites and services may have their own privacy policies and
          customer service policies. Browsing and interaction on any other website, including websites which have a link to our Site, is
          subject to that website's own terms and policies.
        </div>
        <div>
          <h4>Changes to this privacy policy</h4>
          Sugarlogger Labs Pvt. Ltd.has the discretion to update this privacy policy at any time. When we do, we will post a notification on
          the main page of our Site and send you an email. We encourage Users to frequently check this page for any changes to stay informed
          about how we are helping to protect the personal information we collect. You acknowledge and agree that it is your responsibility
          to review this privacy policy periodically and become aware of modifications.
        </div>
        <div>
          <h4>Your acceptance of these terms</h4>
          By using this Site, you signify your acceptance of this privacy policy and the terms & conditions If you do not agree to this
          policy, please do not use our Site. Your continued use of the Site following the posting of changes to this policy will be deemed
          your acceptance of those changes.
        </div>
        <div>
          <h4>Contacting us</h4>
          If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact
          us at: <br />
          Sugarlogger Labs Private Limited,
        </div>
      </SectionWrapper>
    </>
  );
};

export default PrivacyPolicy;
