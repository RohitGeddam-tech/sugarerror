import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChart = ({ data, legendPosition = 'right', width, height }) => {
  // Enable pie chart only if data is not empty or null
  return (
    <Pie
      width={width ? Number(width) : null}
      height={height ? Number(height) : null}
      data={data}
      options={{
        cutoutPercentage: 0,
        maintainAspectRatio: false,
        responsive: false,
        elements: {
          arc: {
            borderWidth: 0.2,
          },
        },
        legend: {
          position: legendPosition,
          fullWidth: true,
          labels: {
            boxWidth: 10,
            padding: 15,
          },
        },
      }}
    />
  );
};

export default PieChart;
