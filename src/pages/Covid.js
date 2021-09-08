import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import blue from '@material-ui/core/colors/blue';
import Table from './../components/Table/Table';
import Map from './../components/Map/Map';
import DataBox from './../components/DataBox/DataBox';
import RadioButtons from '../components/Radio/RadioButtons';
import ChartBar from '../components/Chart/ChartBar';
import { formatThrityDaysInfo } from '../utils';
import { sortData } from '../utils';
import { formatVaccineData } from './../utils';
import { fetchData } from './../utils';

let countriesGlobalInfo = null;

const wrappersBaseStyles = (theme) => ({
  width: '95%',
  borderRadius: '12px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),
});

const useStyles = makeStyles((theme) => {
  return {
    wrapper: {
      // background: 'transparent',
      // height: '100%',
      paddingTop: theme.spacing(4),
      backgroundColor: '#f5f5f5',
    },

    topWrapper: {
      ...wrappersBaseStyles(theme),
    },

    grid: {
      justifyContent: 'center',
    },

    gridCountryDeatils: {
      display: 'flex',
      justifyContent: 'center',

      [theme.breakpoints.up('xs')]: {
        order: -1,
      },
    },

    countryDetails: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',

      [theme.breakpoints.up('sm')]: {
        height: '600px',
      },
    },

    infoBoxes: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },

    gridMap: {
      [theme.breakpoints.up('lg')]: {
        order: -1,
      },
    },

    gridTable: {
      [theme.breakpoints.up('sm')]: {
        order: -2,
      },
    },

    dropdownMenu: {
      border: `1px solid ${blue[50]}`,
    },

    bottomWrapper: {
      ...wrappersBaseStyles(theme),
      marginTop: theme.spacing(7),
      marginBottom: theme.spacing(7),
    },
    radioWrapper: {
      display: 'flex',
      justifyContent: 'center',
    },

    chartWrapper: {
      marginTop: theme.spacing(6),
      display: 'flex',
      justifyContent: 'space-evenly',
      flexWrap: 'wrap',
    },

    chart: {
      width: '400px',
      minWidth: '250px',
      marginBottom: theme.spacing(4),
    }
  };
});

function Covid() {
  const classes = useStyles();
  const [countriesInfo, setCountriesInfo] = useState([]);
  const [countriesNames, setCountriesNames] = useState();
  const [country, setCountry] = useState('Poland');
  const [prevCountry, setPrevCountry] = useState('Poland');
  const [countryData, setCountryData] = useState({});
  const [mapCenter, setMapCenter] = useState([52, 20]);
  const [mapZoom, setMapZoom] = useState(4);
  const [casesType, setCasesType] = useState('totalCases');

  useEffect(() => {
    (async () => {
      try {
        let countriesNames = [];
        const data = await fetchData(
          'https://disease.sh/v3/covid-19/countries'
        );
        countriesGlobalInfo = data.map((country) => ({
          countryName: country.country,
          flag: country.countryInfo.flag,
          lat: country.countryInfo.lat,
          long: country.countryInfo.long,
          totalCases: country.cases,
          totalDeaths: country.deaths,
          totalRecovered: country.recovered,
        }));
        sortData(countriesGlobalInfo);
        countriesNames = countriesGlobalInfo.map(
          (country) => country.countryName
        );
        countriesNames.sort((a, b) => a - b);
        setCountriesNames(countriesNames);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);
  //* May occur problem later on
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchData(
          'https://disease.sh/v3/covid-19/historical?lastdays=30'
        );
        data.forEach((country) => {
          const foundedCountry = countriesGlobalInfo.findIndex(
            (c) => c.countryName === country.country
          );
          const thirtyDaysCases = formatThrityDaysInfo(country.timeline.cases);
          const thirtyDaysDeaths = formatThrityDaysInfo(
            country.timeline.deaths
          );
          const thirtyDaysRecovered = formatThrityDaysInfo(
            country.timeline.recovered
          );
          return (countriesGlobalInfo[foundedCountry] = {
            ...countriesGlobalInfo[foundedCountry],
            thirtyDaysCases,
            thirtyDaysDeaths,
            thirtyDaysRecovered,
          });
        });

        const newData = await fetchData(
          'https://disease.sh/v3/covid-19/vaccine/coverage/countries?lastdays=30&fullData=false'
        );
        newData.forEach((country) => {
          const foundedCountry = countriesGlobalInfo.findIndex(
            (c) => c.countryName === country.country
          );
          const totalVaccinated = formatVaccineData(country.timeline);
          return (countriesGlobalInfo[foundedCountry] = {
            ...countriesGlobalInfo[foundedCountry],
            ...totalVaccinated,
          });
        });
        setCountriesInfo(sortData(countriesGlobalInfo));
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        let countryCases = null;
        let countryVaccinated = null;
        const data = await fetchData(
          'https://disease.sh/v3/covid-19/countries/Poland'
        );
        countryCases = {
          totalCases: data.cases,
          todayCases: data.todayCases,
          totalDeaths: data.deaths,
          todayDeaths: data.todayDeaths,
          totalRecovered: data.recovered,
          todayRecovered: data.todayRecovered,
        };
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);

        const newData = await fetchData(
          'https://disease.sh/v3/covid-19/vaccine/coverage/countries/Poland'
        );
        countryVaccinated = formatVaccineData(newData.timeline);
        setCountryData({ ...countryCases, ...countryVaccinated });
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleCountryChange = async (e) => {
    const selectedCountry = e.target.value;
    setPrevCountry(country);
    setCountry(selectedCountry);
    let countryCases = null;
    let countryVaccinated = null;
    if (selectedCountry === 'worldwide') {
      fetch('https://disease.sh/v3/covid-19/all')
        .then((response) => response.json())
        .then((data) => {
          countryCases = {
            totalCases: data.cases,
            todayCases: data.todayCases,
            totalDeaths: data.deaths,
            todayDeaths: data.todayDeaths,
            totalRecovered: data.recovered,
            todayRecovered: data.todayRecovered,
          };
        });

      await fetch('https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=3')
        .then((response) => response.json())
        .then((data) => {
          countryVaccinated = formatVaccineData(data);
        });
      setCountryData({ ...countryCases, ...countryVaccinated });
      setMapZoom(2);
      setMapCenter([40.86666667, 34.56666667]);
      return;
    }

    await fetch(`https://disease.sh/v3/covid-19/countries/${selectedCountry}`)
      .then((response) => response.json())
      .then((data) => {
        countryCases = {
          lat: data.countryInfo.lat,
          long: data.countryInfo.long,
          totalCases: data.cases,
          todayCases: data.todayCases,
          totalDeaths: data.deaths,
          todayDeaths: data.todayDeaths,
          totalRecovered: data.recovered,
          todayRecovered: data.todayRecovered,
        };
        setMapZoom(6);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      });

    await fetch(
      `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${selectedCountry}`
    )
      .then((response) => response.json())
      .then((data) => {
        countryVaccinated = formatVaccineData(data.timeline);
      });
    setCountryData({ ...countryCases, ...countryVaccinated });
  };

  return (
    <Paper square elevation={0} className={classes.wrapper}>
      <Paper className={classes.topWrapper}>
        <Grid container spacing={5} className={classes.grid}>
          <Grid
            item
            xs={12}
            sm={8}
            md={7}
            lg={4}
            xl={3}
            className={classes.gridTable}
          >
            <Table data={countriesInfo} />
          </Grid>
          <Grid item xs={12} lg={6} xl={7} className={classes.gridMap}>
            <Map
              newCountry={prevCountry === country}
              casesType={casesType}
              data={countriesInfo}
              center={mapCenter}
              zoom={mapZoom}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={3}
            lg={2}
            xl={2}
            className={classes.gridCountryDeatils}
          >
            <div className={classes.countryDetails}>
              <FormControl>
                <Select
                  className={classes.dropdownMenu}
                  id="countrySelect"
                  defaultValue="Poland"
                  value={country}
                  variant="outlined"
                  onChange={handleCountryChange}
                >
                  <MenuItem value="worldwide">Worldwide</MenuItem>
                  {countriesNames &&
                    countriesNames.map((country, i) => (
                      <MenuItem key={i} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              {countryData && (
                <div className={classes.infoBoxes}>
                  <DataBox
                    onClick={() => {
                      setCasesType('totalCases');
                      setPrevCountry(country);
                    }}
                    casesType="Zakażenia"
                    negativeBox
                    active={casesType === 'totalCases'}
                    totalCases={countryData.totalCases}
                    todayCases={countryData.todayCases}
                  />
                  <DataBox
                    onClick={() => {
                      setCasesType('totalDeaths');
                      setPrevCountry(country);
                    }}
                    casesType="Zgony"
                    active={casesType === 'totalDeaths'}
                    negativeBox
                    totalCases={countryData.totalDeaths}
                    todayCases={countryData.todayDeaths}
                  />
                  <DataBox
                    onClick={() => {
                      setCasesType('totalRecovered');
                      setPrevCountry(country);
                    }}
                    casesType="Wyzdrowiali"
                    active={casesType === 'totalRecovered'}
                    totalCases={countryData.totalRecovered}
                    todayCases={countryData.todayRecovered}
                  />
                  <DataBox
                    onClick={() => {
                      setCasesType('totalVaccinated');
                      setPrevCountry(country);
                    }}
                    casesType="Zaszczepieni"
                    active={casesType === 'totalVaccinated'}
                    totalCases={countryData.totalVaccinated}
                    todayCases={countryData.todayVaccinated}
                  />
                </div>
              )}
            </div>
          </Grid>
        </Grid>
      </Paper>

      <Paper className={classes.bottomWrapper}>
        <div className={classes.radioWrapper}>
          <RadioButtons
            onChange={(e) => setCasesType(e.target.value)}
            casesType={casesType}
          />
        </div>
        <div className={classes.chartWrapper}>
          <div className={classes.chart}>
            <ChartBar period="Dane dziennie" />
          </div>
          <div className={classes.chart}>
            <ChartBar period="Dane tygodniowo"/>
          </div>
          <div className={classes.chart}>
            <ChartBar period="Dane miesięcznie" />
          </div>
        </div>
      </Paper>
    </Paper>
  );
}

export default Covid;
