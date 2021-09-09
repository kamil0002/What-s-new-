import React from 'react';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import RadioEl from './Radio';

function RadioButtons({ onChange, casesType }) {

  return (
    <FormControl component="fieldset">
      <RadioGroup row aria-label="position" name="position" defaultValue="top" value={casesType} onChange={onChange}>
        <RadioEl name="Zakażenia" value="cases" />
        <RadioEl name="Zgony" value="deaths" />
        <RadioEl name="Wyzdrowiali" value="recovered" />
        <RadioEl name="Zaszczepieni" value="vaccinated" />
      </RadioGroup>
    </FormControl>
  );
}

export default RadioButtons;
