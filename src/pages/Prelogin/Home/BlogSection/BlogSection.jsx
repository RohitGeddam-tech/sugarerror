import React from 'react';
import Container from '../../../../components/Wrappers/Container';
import Slick from '../../../../components/Slick/Slick';
import { ContainedButton } from '../../../../components/Buttons/Button';
import blogData from '../../../../utils/blogs';

const BlogSection = () => {
  return (
    <section className={`section-wrapper blog-section`}>
      <Container>
        <div className="blog-section-head text-content-wrapper">
          <p className="section-top-hr" />
          <h3 className="content-heading red-heading mb-3">Blogs</h3>
          <p className="content-info mb-4">Stay updated with us!</p>
        </div>
        <div className="blog-section-body">
          <div className="mobile-slick">
            <Slick>
              {blogData.data.map((data, ind) => (
                <article className="blog-wrapper flex-column mb-2" key={ind}>
                  <div className="blog-img-wrapper">
                    <img src={data.image} className={`blog-img`} alt="Blog Image" />
                    <span className="blog-img-text">{data.image_text}</span>
                  </div>
                  <div className="blog-content">
                    <p className="blog-heading">{data.heading}</p>
                    <p className="blog-para">{data.content}</p>
                  </div>
                  <div className="blog-footer d-flex justify-content-between">
                    <div className="d-flex">
                      <span className="user-icon blog-footer-icon mr-2"></span>
                      <span className="blog-footer-text mr-3">Sugarlogger</span>
                    </div>
                    <div className="d-flex">
                      <span className="calendar-icon blog-footer-icon mr-2"></span>
                      <span className="blog-footer-text mr-3">Jan 20, 2019</span>
                    </div>
                    <div className="d-flex">
                      <span className="comment-icon blog-footer-icon mr-2"></span>
                      <span className="blog-footer-text mr-3">21</span>
                    </div>
                  </div>
                </article>
              ))}
            </Slick>
          </div>
          <div className="web-show">
            <div className="row">
              {blogData.data.map((data, ind) => (
                <div className="col-md-6 col-lg-4 mb-4" key={ind}>
                  <article className="blog-wrapper flex-column mb-2">
                    <div className="blog-img-wrapper">
                      <img src={data.image} className={`blog-img`} alt="Blog Image" />
                      <span className="blog-img-text">{data.image_text}</span>
                    </div>
                    <div className="blog-content">
                      <p className="blog-heading">{data.heading}</p>
                      <p className="blog-para">{data.content}</p>
                    </div>
                    <div className="blog-footer d-flex justify-content-between">
                      <div className="d-flex">
                        <span className="user-icon blog-footer-icon mr-2"></span>
                        <span className="blog-footer-text mr-3">Sugarlogger</span>
                      </div>
                      <div className="d-flex">
                        <span className="calendar-icon blog-footer-icon mr-2"></span>
                        <span className="blog-footer-text mr-3">Jan 20, 2019</span>
                      </div>
                      <div className="d-flex">
                        <span className="comment-icon blog-footer-icon mr-2"></span>
                        <span className="blog-footer-text mr-3">21</span>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* <div className="blog-section-footer">
          <ContainedButton red>Browse More</ContainedButton>
        </div> */}
      </Container>
    </section>
  );
};

export default BlogSection;
