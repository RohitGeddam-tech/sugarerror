// @flow
import React from 'react';
import LazyImage from '../LazyImage/LazyImage';
const ArticleWrapper = ({ image = { src: '', className: '' }, heading, para }) => {
  return (
    <article className="blog-wrapper mb-3">
      <div className="blog-img-wrapper">
        <LazyImage src={image.src} className={`blog-img ${image.className}`} alt="Blog" height={80} width={80}/>
      </div>
      <div className="blog-content">
        <p className="blog-heading">{heading}</p>
        <p className="blog-para">{para}</p>
      </div>
    </article>
  );
};
export default ArticleWrapper;
