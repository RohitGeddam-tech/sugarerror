import React from 'react';

const Loader = ({ loading = false }) => {
  return (
    loading && (
      <div className="loader-wrapper d-flex justify-content-center w-100">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  );
};

export default Loader;
