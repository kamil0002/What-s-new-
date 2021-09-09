import React, { useContext } from 'react';
import numeral from 'numeral';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import grey from '@material-ui/core/colors/grey';
import green from '@material-ui/core/colors/green';
import AppContext from '../../context';

const useStyles = makeStyles((theme) => ({
  box: {
    // borderLeftWidth: '10px',
    // borderLeftStyle: 'solid',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop: '1.5rem',
    width: '135px',
    textAlign: 'center',
    cursor: 'pointer',

    [theme.breakpoints.up('sm')]: {
      // paddingLeft: theme.spacing(3),
      // paddingRight: theme.spacing(3),
      paddingTop: theme.spacing(1.2),
      paddingBottom: theme.spacing(1.2),
      width: '170px',
    },

    [theme.breakpoints.up('lg')]: {
      paddingTop: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.5),
    },
  },

  activeBox: {
    borderLeftWidth: '10px',
    borderLeftStyle: 'solid',
  },

  boxHeader: {
    color: grey[700],
    fontWeight: 400,
    fontSize: '.85rem',

    [theme.breakpoints.up('sm')]: {
      fontSize: '1rem',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '1.2rem',
    },
  },
  boxcases: {
    fontWeight: 600,
    fontSize: '1.1rem',

    [theme.breakpoints.up('sm')]: {
      fontSize: '1.25rem',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '1.4rem',
    },
  },
  boxNewCases: {
    fontWeight: 500,
    fontSize: '.7rem',

    [theme.breakpoints.up('lg')]: {
      fontSize: '.8rem',
    },
  },

  positiveDataColor: {
    color: green[400],
    borderLeftColor: green[400],
  },

  negativeDataColor: {
    color: red[400],
    borderLeftColor: red[400],
  },

  darkDataColor: {
    color: 'white',
    borderLeftColor: '#ddd',
  },
}));

function DataBox({ casesType, active, cases, todayCases, negativeBox, onClick }) {
  const classes = useStyles();
  const { darkMode } = useContext(AppContext);

  return (
    <Paper
      onClick={onClick}
      className={`${classes.box} ${ negativeBox
          ? classes.negativeDataColor
          : classes.positiveDataColor
      } ${active && classes.activeBox} ${darkMode && classes.darkDataColor}`}
      elevation={2}
    >
      <h5 className={`${classes.boxHeader} ${darkMode && classes.darkDataColor}`}>{casesType}</h5>
      <p className={classes.boxcases}>
        {numeral(cases).format('0,0.[00')}
      </p>
      <p className={classes.boxNewCases}>
        +{numeral(todayCases).format('0,0.[00')}
      </p>
    </Paper>
  );
}

export default DataBox;
