import React from 'react';
import UpcomingAppointments from './UpcomingAppointments';
const Appointments = props => {
  return (
    <div className="row w-100">
      <div className="col-md-12 col-12">
        <UpcomingAppointments />
      </div>
    </div>
  );
};

export default Appointments;
