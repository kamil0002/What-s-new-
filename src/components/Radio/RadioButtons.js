import React from 'react';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import RadioEl from './Radio';

function RadioButtons({ onChange, casesType }) {

  return (
    <FormControl component="fieldset">
      <RadioGroup row aria-label="position" name="position" defaultValue="top" value={casesType} onChange={onChange}>
        <RadioEl name="Zakażenia" value="totalCases" />
        <RadioEl name="Zgony" value="totalDeaths" />
        <RadioEl name="Wyzdrowiali" value="totalRecovered" />
        <RadioEl name="Zaszczepieni" value="totalVaccinated" />
      </RadioGroup>
    </FormControl>
  );
}

export default RadioButtons;
