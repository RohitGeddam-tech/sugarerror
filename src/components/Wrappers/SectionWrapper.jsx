// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import Container from './Container';

export const SectionWrapper = ({ children, sectionClass }) => {
  return (
    <section className={`section-wrapper ${sectionClass}-section`}>
      <Container>
        <div className="row section-content-wrapper">{children}</div>
      </Container>
    </section>
  );
};

SectionWrapper.propTypes = {
  sectionClass: PropTypes.string,
};
