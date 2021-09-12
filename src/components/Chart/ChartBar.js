import React, { useEffect, useState } from 'react';
import numeral from 'numeral';
import { Bar } from 'react-chartjs-2';
import { fetchData } from './../../utils';
import { formatDailyChartData } from './../../utils';

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
  weekly,
  daily,
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
        if (daily) {
          const data = await formatDailyChartData(casesType, country);
          const { labels, barCases } = data;
          setData(barCases);
          setLabels(labels);
        }

        if(weekly) {
          let todaysData;
          let type;
          let sum = 0;
          let labels = [];
          let externalData;
          const fullData = [];
          let barCases = [];
          let weekIndicator;
          let innerArrayIndicator = 0;
          if (casesType === 'vaccinated') {
            todaysData = todayVaccinated;
            if (country === 'worldwide') {
              externalData = await fetchData(
                'https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=56&fullData=false'
              );
              type = externalData;
            } else {
              externalData = await fetchData(
                `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${country}?lastdays=56&fullData=false`
              );
              type = externalData.timeline;
            }
          } else {
            if (country === 'worldwide') {
              externalData = await fetchData(
                `https://disease.sh/v3/covid-19/historical/all?lastdays=56`
              );
              type = externalData[casesType];
            } else {
              externalData = await fetchData(
                `https://disease.sh/v3/covid-19/historical/${country}?lastdays=56`
              );
              console.log(externalData);
              type = externalData?.timeline[casesType];
            }
          }
          for (let i = 0; i < 7; i++) {
            fullData[i] = [];
            labels[i] = [];
          }
          
          for (const day in type) {
            let newDay = new Intl.DateTimeFormat('PL-pl', {day: '2-digit', month: '2-digit'}).format(new Date(day));
            console.log(newDay);
            fullData[innerArrayIndicator].push(type[day]);
            labels[innerArrayIndicator].push(newDay);
            if(fullData[innerArrayIndicator].length === 8) innerArrayIndicator++;
          }
          console.log(fullData);
          for (let i = 0; i < fullData.length; i++) {
  
            for (let j = 0; j < fullData[i].length - 1; j++) {
              sum += fullData[i][j+1] - fullData[i][j];
            }
            barCases.push(sum);
            sum = 0;
          }

          for (let i = 0; i < labels.length; i++) {
            labels[i].shift();
            labels[i].splice(1, 5);
            labels[i] = labels[i].join(' - ');
          }
          console.log("LABELS >>>", labels);
          setData(barCases);
          setLabels(labels);
        }
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
