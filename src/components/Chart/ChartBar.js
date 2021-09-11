import React, { useEffect, useState } from 'react';
import numeral from 'numeral';
import { Bar } from 'react-chartjs-2';
import { fetchData } from './../../utils';

const barData = {
  // labels: ['Pn.', 'Wt.', 'Śr.', 'Czw.', 'Pt.', 'Sb.', 'Ndz.'],
  datasets: [
    {
      // data: [1296321, 12326629, 5456633, 322645, 113642, 345763, 883483],
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
      },
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
        callback: function (value, index, values) {
          return numeral(value).format('0a').toUpperCase();
        },
      },
    },
  },
});

function ChartBar({
  period,
  casesType,
  country,
  todayCases,
  todayDeaths,
  todayRecovered,
  todayVaccinated,
}) {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        let todaysData;
        let type;
        let externalData;
        let cases = [];
        let barCases = [];
        let labels = [];
        if (casesType === 'cases') todaysData = todayCases;
        if (casesType === 'deaths') todaysData = todayDeaths;
        if (casesType === 'recovered') todaysData = todayRecovered;
        if (casesType === 'vaccinated') {
          todaysData = todayVaccinated;
          if(country === 'worldwide') {
            externalData = await fetchData('https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=7&fullData=false');
            type = externalData;
          } else {
            externalData = await fetchData(
              `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${country}?lastdays=7&fullData=false`
            );
            type = externalData.timeline;
          }
        } else {
  
          if (country === 'worldwide') {
            externalData = await fetchData(
              `https://disease.sh/v3/covid-19/historical/all?lastdays=7`
            );
            type = externalData[casesType];
          } else {
            externalData = await fetchData(
              `https://disease.sh/v3/covid-19/historical/${country}?lastdays=7`
            );
            type = externalData?.timeline[casesType];
          }
        }
        console.log('TYPE >>', type);
        for (const day in type) {
          const date = new Date(day);
          const label = new Intl.DateTimeFormat(navigator.language, {
            weekday: 'short',
          }).format(date);
          label = label.charAt(0).toUpperCase() + label.slice(1);
          labels.push(label);
          cases.push(type[day]);
        }
        for (let i = 0; i < cases.length - 1; i++) {
          barCases[i] = cases[i + 1] - cases[i];
        }
        barCases.push(todaysData);
        setData(barCases);
        labels.splice(0, 1);
        labels.push(
          new Intl.DateTimeFormat(navigator.language, {
            weekday: 'short',
          }).format(new Date(Date.now()))
        );
        setLabels(labels);
        // console.log("BARCASES >>>", barCases);
        // console.log("CASES >>>",data);
        // console.log(labels, 'LABEL');
        // console.log(barCases, ' he');
        // barData.labels = labels;
        // barData.datasets[0].data = barCases;
        // console.log(barData);
        // setData(barData);
        // console.log("DATA >>>", data)
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
