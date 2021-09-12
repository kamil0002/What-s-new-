import React, { useEffect, useState } from 'react';
import numeral from 'numeral';
import { Bar } from 'react-chartjs-2';
import { fetchData } from './../../utils';
import { buildChartData } from './../../utils';

const options = (title) => ({
  plugins: {
    title: {
      display: true,
      text: `${title}`,
      font: {
        weight: '500',
        size: '16px',
      },
    },
    legend: {
      display: false,
      boxWidth: 0,
    },

    tooltip: {
      callbacks: {
        label: function(context) {
          var label = context.dataset.label || '';

          if (label) {
              label += ': ';
          }
          if (context.parsed.y !== null) {
              label += numeral(context.parsed.y).format('+0.[0,');
          }
          return label;
      }
      },
    },
  },
  maintainAspectRatio: false,

  scales: {
    y: {
      ticks: {
        // Include a dollar sign in the ticks
        callback: function (value, index, values) {
          return numeral(value).format('0a').toUpperCase();
        },
      },
    },
  },
});

function ChartBar({
  daily,
  period,
  casesType,
  country,
}) {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    (async () => {
      try {
          const data = await buildChartData(casesType, country, daily);
          const { labels, barCases } = data;
          setData(barCases);
          setLabels(labels);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [casesType, country]);

  return (
    <div>
      {data.length > 0 && (
        <Bar
          style={{ height: '370px' }}
          data={{
            labels: labels,
            datasets: [
              {
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(50,230,100, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                  'rgba(50,230,100, 0.2)',
                ],
                borderWidth: 1,
                data: data,
              },
            ],
          }}
          options={options(period)}
        />
      )}
    </div>
  );
}

export default ChartBar;
