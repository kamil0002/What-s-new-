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

export const formatDailyChartData = async (
  casesType,
  country,
  todayCases = 0,
  todayDeaths = 0,
  todayRecovered = 0,
  todayVaccinated = 0
) => {
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
    if (country === 'worldwide') {
      externalData = await fetchData(
        'https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=8&fullData=false'
      );
      type = externalData;
    } else {
      externalData = await fetchData(
        `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${country}?lastdays=8&fullData=false`
      );
      type = externalData.timeline;
    }
  } else {
    if (country === 'worldwide') {
      externalData = await fetchData(
        `https://disease.sh/v3/covid-19/historical/all?lastdays=8`
      );
      type = externalData[casesType];
    } else {
      externalData = await fetchData(
        `https://disease.sh/v3/covid-19/historical/${country}?lastdays=8`
      );
      type = externalData?.timeline[casesType];
    }
  }
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
  labels.shift();

  return {
    labels,
    barCases,
  };
};
