import React from 'react';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import RadioEl from './Radio';

function RadioButtons({ onChange, casesType }) {

  return (
    <FormControl component="fieldset">
      <RadioGroup row aria-label="position" name="position" defaultValue="top" value={casesType} onChange={onChange}>
        <RadioEl name="Cases" value="cases" />
        <RadioEl name="Deaths" value="deaths" />
        <RadioEl name="Recovered" value="recovered" />
        <RadioEl name="Vaccinated" value="vaccinated" />
      </RadioGroup>
    </FormControl>
  );
}

export default RadioButtons;
