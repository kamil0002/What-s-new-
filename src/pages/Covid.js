import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { formatThrityDaysInfo } from '../utils';
import { sortData } from '../utils';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import blue from '@material-ui/core/colors/blue';
import Table from './../components/Table/Table';
import Map from './../components/Map/Map';
import DataBox from './../components/DataBox/DataBox';
import { formatVaccineData } from './../utils';

let countriesGlobalInfo = null;
const useStyles = makeStyles((theme) => {
  return {

    wrapper: {
      // background: 'transparent',
      height: '100%',
    },

    topWrapper: {
      width: '95%',
      borderRadius: '12px',
      marginTop: theme.spacing(4),
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
      paddingLeft: theme.spacing(2.5),
      paddingRight: theme.spacing(2.5),
      marginLeft: 'auto',
      marginRight: 'auto',
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

    bottomWrapper: {
      marginTop: theme.spacing(7),
    },

    dropdownMenu: {
      border: `1px solid ${blue[50]}`,
    },
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
    let countriesNames = [];

    fetch('https://disease.sh/v3/covid-19/countries')
      .then((response) => response.json())
      .then((data) => {
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
      });
  }, []);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/historical?lastdays=30')
      .then((response) => response.json())
      .then((data) => {
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
      });
      
      fetch(
        'https://disease.sh/v3/covid-19/vaccine/coverage/countries?lastdays=30&fullData=false'
        )
        .then((response) => response.json())
        .then((data) => {
        data.forEach((country) => {
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
      });
  }, []);

  useEffect(() => {
    let countryCases = null;
    let countryVaccinated = null;

    fetch('https://disease.sh/v3/covid-19/countries/Poland')
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
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      });

    fetch('https://disease.sh/v3/covid-19/vaccine/coverage/countries/Poland')
      .then((response) => response.json())
      .then((data) => {
        countryVaccinated = formatVaccineData(data.timeline);
        setCountryData({ ...countryCases, ...countryVaccinated });
      });
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
                    onClick={() => {setCasesType('totalCases'); setPrevCountry(country)}}
                    casesType="Zakażenia"
                    negativeBox
                    active={casesType === 'totalCases'}
                    totalCases={countryData.totalCases}
                    todayCases={countryData.todayCases}
                  />
                  <DataBox
                    onClick={() => {setCasesType('totalDeaths'); setPrevCountry(country)}}
                    casesType="Zgony"
                    active={casesType === 'totalDeaths'}
                    negativeBox
                    totalCases={countryData.totalDeaths}
                    todayCases={countryData.todayDeaths}
                  />
                  <DataBox
                    onClick={() => {setCasesType('totalRecovered'); setPrevCountry(country)}}
                    casesType="Wyzdrowiali"
                    active={casesType === 'totalRecovered'}
                    totalCases={countryData.totalRecovered}
                    todayCases={countryData.todayRecovered}
                  />
                  <DataBox
                    onClick={() => {setCasesType('totalVaccinated'); setPrevCountry(country)}}
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

      <div>
        <Paper className={classes.bottomWrapper}>Some bottom content</Paper>
      </div>
    </Paper>
  );
}

export default Covid;
