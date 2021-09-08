import React from 'react';
import numeral from 'numeral';
import { Bar } from 'react-chartjs-2';

const data = {
  labels: ['Pn.', 'Wt.', 'Śr.', 'Czw.', 'Pt.', 'Sb.', 'Ndz.'],
  datasets: [
    {
      data: [1296321, 12326629, 5456633, 322645, 113642, 345763, 883483],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const options = (title) => ({
  plugins: {
    title: {
      display: true,
      text: `${title}`,
      font: {
        weight: '500',
        size: '16px',
      }
    },
    legend: {
      display: false,
      boxWidth: 0,
    },
  },
  maintainAspectRatio: false,

  scales: {
    y: {
        ticks: {
            // Include a dollar sign in the ticks
            callback: function(value, index, values) {
                return numeral(value).format('0a').toUpperCase();
            }
        }
    }
}
});

function ChartBar({ period }) {
  return (
    <>
      <Bar style={{ height: '370px' }} data={data} options={options(period)} />
    </>
  );
}

export default ChartBar;
