import React, { useContext } from 'react'
import styles from './Table.module.scss';
import TableItem from './TableItem';
import ThemeContext from '../../Contexts/ThemeContext';

function Table({ data }) {
  const { darkMode } = useContext(ThemeContext);

  return ( 
    <div className={`${darkMode ? styles.wrapperDark : styles.wrapper}`}>
      <h3 className={`${darkMode ? styles.titleDark : styles.title}`}>Data by country</h3>
      <div className={`${darkMode ? styles.globalDataDark : styles.globalData}`}>
        {data.map(({countryName, flag, cases, deaths, recovered, thirtyDaysCases, thirtyDaysDeaths, thirtyDaysRecovered}, i) => (
          <TableItem
            key={i}
            pos={i+1} 
            countryName={countryName}
            flag={flag}
            cases={cases}
            deaths={deaths}
            recovered={recovered}
            thirtyDaysCases={thirtyDaysCases}
            thirtyDaysDeaths={thirtyDaysDeaths}
            thirtyDaysRecovered={thirtyDaysRecovered}
          />
        ))}
      </div>
    </div>
  )
}

export default Table
