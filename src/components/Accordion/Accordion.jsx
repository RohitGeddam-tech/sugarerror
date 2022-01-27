import React from 'react';
import { TextButton } from '../Buttons/Button';

const dummy = {
  heading: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed doeiusmod tempor incididunt ut labore et dolore?',
  body:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
};

function Accordion({ data = [], testAccordion, className, cardClass }) {
  return (
    <div className={`${testAccordion ? 'test-accordion' : 'accordion'} ${className ? className : ''}`} id="accordionExample">
      {data.map((val, ind) => (
        <div className={`card ${cardClass ? cardClass : ''}`} key={ind}>
          <div className="card-header" id="headingOne">
            <h2 className={`mb-0 d-flex align-items-center accordion-content ${val.className ? val.className : ''}`}>
              {val && val.renderCheckBox}
              <TextButton
                className="acc-btn d-flex align-items-center collapse-btn collapsed justify-content-between"
                dataToggle="collapse"
                dataTarget={`#collapse-${ind}`}
                ariaExpanded="true"
                ariaControls={`collapse-${ind}`}
                disabled={val?.disable}
              >
                {(val && val.heading) || dummy.heading}
                <p className="down-arrow">
                  <svg width="18" height="18" viewBox="0 0 9 15" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M0.371183 0.372785C-0.123728 0.867695 -0.123728 1.66717 0.371183 2.16208L5.29491 7.0858L0.371183 12.0095C-0.123728 12.5044 -0.123728 13.3039 0.371183 13.7988C0.866093 14.2937 1.66556 14.2937 2.16047 13.7988L7.98519 7.9741C8.4801 7.47919 8.4801 6.67972 7.98519 6.18481L2.16047 0.360095C1.67825 -0.122126 0.866093 -0.122126 0.371183 0.372785Z"
                      fill="#828282"
                    />
                  </svg>
                </p>
              </TextButton>
            </h2>
          </div>
          <div id={`collapse-${ind}`} className="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
            <div className="card-body">{(val && val.body) || dummy.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Accordion;
