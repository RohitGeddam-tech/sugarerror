import React from 'react';

import Slider from 'react-slick';

export default function Slick({ children }) {
  return (
    <Slider
      dots={true}
      centerMode={true}
      slidesToShow={3}
      slidesToScroll={3}
      speed={500}
      className={'center'}
      infinite={true}
      centerPadding={'60px'}
      responsive={[
        {
          breakpoint: 768,
          settings: {
            // arrows: true,
            centerMode: true,
            slidesToShow: 3,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 767,
          settings: {
            // arrows: true,
            centerMode: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: false,
          },
        },
      ]}
    >
      {children}
    </Slider>
  );
}
