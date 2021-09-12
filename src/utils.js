import { Circle, Popup } from 'react-leaflet';
import numeral from 'numeral';
import styles from './components/Map/Map.module.scss';

const casesTypeStyle = {
  cases: {
    color: '#EF5350',
    circleScale: 0.07,
  },
  deaths: {
    color: '#EF3560',
    circleScale: 2,
  },
  recovered: {
    color: '#66BB6A',
    circleScale: 0.07,
  },
  vaccinated: {
    color: '#66CA6A',
    circleScale: 0.004,
  },
};


export const fetchData = async (url) => {
  const res = await fetch(url);
  return res.json();
};

//* NEWS PAGE

export const formatArticlesData = (articles) =>
  articles.map((article) => {
    return {
      title: `${article.title.slice(0, 85)}...`,
      description: article.description,
      link: article.url,
      image: article.urlToImage,
      published: new Intl.DateTimeFormat('PL-pl', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(article.publishedAt)),
    };
  });

  //* COVID PAGE 

export const formatThrityDaysInfo = (data) => {
  let yesterday = new Date();
  let twoDaysAgo = new Date();
  let monthAgo = new Date(yesterday);
  monthAgo.setDate(monthAgo.getDate() - 30);
  yesterday.setDate(yesterday.getDate() - 1);
  twoDaysAgo.setDate(yesterday.getDate() - 2);
  yesterday = new Intl.DateTimeFormat('EN', { dateStyle: 'short' }).format(
    yesterday
  );
  monthAgo = new Intl.DateTimeFormat('EN', { dateStyle: 'short' }).format(
    monthAgo
  );
  if (data[yesterday] === undefined) {
    yesterday = new Intl.DateTimeFormat('EN', { dateStyle: 'short' }).format(
      twoDaysAgo
    );
  }
  return data[yesterday] - data[monthAgo];
};

export const formatVaccineData = (data) => {
  if (!data) return;
  let today = new Date();
  let yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 2);
  today.setDate(today.getDate() - 1);

  today = new Intl.DateTimeFormat('EN', { dateStyle: 'short' }).format(today);
  yesterday = new Intl.DateTimeFormat('EN', { dateStyle: 'short' }).format(
    yesterday
  );

  return {
    vaccinated: data[today],
    todayVaccinated: data[today] - data[yesterday],
  };
};

export const sortData = (data) => {
  const sortedData = [...data];
  return sortedData.sort((a, b) => b.cases - a.cases);
};

export const renderCircles = (data, type) => {
  if (data)
    return data.map((country, i) => (
      <Circle
        key={i}
        center={[country.lat, country.long]}
        radius={
          (country[type] === undefined ? 0 : country[type]) *
          casesTypeStyle[type]['circleScale']
        }
        pathOptions={{
          fillColor: casesTypeStyle[type]['color'],
          color: casesTypeStyle[type]['color'],
        }}
      >
        <Popup className={styles.popup}>
          <div className={styles.countryDetails}>
            <img
              className={styles.countryDetailsFlag}
              src={country.flag}
              alt={country.countryName}
            />
            <h4 className={styles.countryDetailsCountryName}>
              {country.countryName}
            </h4>
          </div>
          <div className={styles.countryData}>
            <h5 className={styles.countryDataInfections}>
              Zakażenia: {numeral(country.cases).format('0,0.[00')}
            </h5>
            <h5 className={styles.countryDataDeaths}>
              Zgony: {numeral(country.deaths).format('0,0.[00')}
            </h5>
            <h5 className={styles.countryDataRecovered}>
              Wyzdrowiali: {numeral(country.recovered).format('0,0.[00')}
            </h5>
            <h5 className={styles.countryDataVaccinated}>
              Zasczepieni: {numeral(country.vaccinated).format('0,0.[00')}
            </h5>
          </div>
        </Popup>
      </Circle>
    ));
};

//* Chart DATA

const fetchChartData = async (DAYS, country, casesType) => {
  let externalData;
  let type = [];

  if (casesType === 'vaccinated') {
    if (country === 'worldwide') {
      externalData = await fetchData(
        `https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=${DAYS}&fullData=false`
      );
      type = externalData;
    } else {
      externalData = await fetchData(
        `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${country}?lastdays=${DAYS}&fullData=false`
      );
      type = externalData.timeline;
    }
  } else {
    if (country === 'worldwide') {
      externalData = await fetchData(
        `https://disease.sh/v3/covid-19/historical/all?lastdays=${DAYS}`
      );
      type = externalData[casesType];
    } else {
      externalData = await fetchData(
        `https://disease.sh/v3/covid-19/historical/${country}?lastdays=${DAYS}`
      );
      type = externalData?.timeline[casesType];
    }
  }

  return type;
};

const formatDailyChartData = (type) => {
  const labels = [];
  const cases = [];
  const barCases = [];

  for (const day in type) {
    const date = new Date(day);
    let label = new Intl.DateTimeFormat(navigator.language, {
      weekday: 'short',
    }).format(date);
    label = label.charAt(0).toUpperCase() + label.slice(1);
    labels.push(label);
    cases.push(type[day]);
  }
  for (let i = 0; i < cases.length - 1; i++) {
    barCases[i] = cases[i + 1] - cases[i];
  }
  labels.shift();

  return {
    labels,
    barCases,
  };
};

const formatWeeklyChartData = (type) => {
  let innerArrayIndicator = 0;
  let sum = 0;
  const labels = [];
  const cases = [];
  const barCases = [];

  //* Create inner arrays for each week
  for (let i = 0; i < 7; i++) {
    cases[i] = [];
    labels[i] = [];
  }

  //* Push data into array
  for (const day in type) {
    const newDay = new Intl.DateTimeFormat('PL-pl', {
      day: '2-digit',
      month: '2-digit',
    }).format(new Date(day));
    cases[innerArrayIndicator].push(type[day]);
    labels[innerArrayIndicator].push(newDay);
    if (cases[innerArrayIndicator].length === 8) innerArrayIndicator++;
  }

  //* Calcuate week cases in each array
  for (let i = 0; i < cases.length; i++) {
    for (let j = 0; j < cases[i].length - 1; j++) {
      sum += cases[i][j + 1] - cases[i][j];
    }
    barCases.push(sum);
    sum = 0;
  }

  //* Reformat labels
  for (let i = 0; i < labels.length; i++) {
    labels[i].shift();
    labels[i].splice(1, 5);
    labels[i] = labels[i].join(' - ');
  }

  return {
    labels,
    barCases,
  };
};

export const buildChartData = async (casesType, country, daily) => {
  const DAYS = daily ? 8 : 56;
  const type = await fetchChartData(DAYS, country, casesType);
  let data = {};

  daily
    ? (data = formatDailyChartData(type))
    : (data = formatWeeklyChartData(type));
  return data;
};
