import React from 'react';

const ImagePlaceholder = ({width, height}) => {
  console.log(width, height )
  return <div className="placeholder" style={{ backgroundColor: 'gray', width, height }}></div>;
};

export default ImagePlaceholder;
