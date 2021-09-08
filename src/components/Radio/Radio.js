import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles((theme) => ({
  label: {
    fontSize: '1.05rem',
    fontWeight: 500,
    marginRight: 8,
    [theme.breakpoints.up('md')]: {
      marginRight: 30,
      fontSize: '1.2rem',
    }
  },

  root: {
    marginLeft: 'auto',
    marginRight: 'auto',
  }
}))

function RadioEl({ name, value, className }) {
  const classes = useStyles();

  return (
    <FormControlLabel
      classes={{ label: classes.label, root: classes.root }}
      className={className}
      value={value}
      control={<Radio color="primary" />}
      label={name}
    ></FormControlLabel>
  );
}

export default RadioEl;
