import LazyLoad from 'react-lazyload';
import React from 'react';
import ImagePlaceholder from '../Placeholder/ImagePlaceholder';

const LazyImage = ({ src = '', alt = '', className = '', height = 300, width = 300, debounce = 400, offset = [-100, 0] }) => {
  return (
    <div>
      <LazyLoad offset={offset} placeholder={<ImagePlaceholder width={width+"px"} height={height+"px"}/>} debounce={debounce}>
        <img src={src} alt={alt} className={className} width={width+"px"} height={height+"px"} />
      </LazyLoad>
    </div>
  );
};
export default LazyImage;
