import React from 'react';
import { customer } from '../../../../assets';
import Container from '../../../../components/Wrappers/Container';
import ArticleWrapper from '../../../../components/Common/ArticleWrapper/ArticleWrapper';
import Slick from '../../../../components/Slick/Slick';

const CustomerReview = () => {
  return (
    <section className={`section-wrapper customer-review-section`}>
      <Container>
        <div className="text-content-wrapper">
          <p className="section-top-hr" />
          <h3 className="content-heading white-heading mb-3">Customer Reviews</h3>
          <p className="content-info mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.
          </p>
        </div>
        <Slick>
          <ArticleWrapper
            image={{ src: customer, className: 'customer-img' }}
            heading="Rajkumar Remalli"
            para="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore."
          ></ArticleWrapper>
          <ArticleWrapper
            image={{ src: customer, className: 'customer-img' }}
            heading="Rajkumar Remalli"
            para="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore."
          ></ArticleWrapper>
          <ArticleWrapper
            image={{ src: customer, className: 'customer-img' }}
            heading="Rajkumar Remalli"
            para="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore."
          ></ArticleWrapper>
          <ArticleWrapper
            image={{ src: customer, className: 'customer-img' }}
            heading="Rajkumar Remalli"
            para="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore."
          ></ArticleWrapper>
        </Slick>
      </Container>
    </section>
  );
};

export default CustomerReview;
