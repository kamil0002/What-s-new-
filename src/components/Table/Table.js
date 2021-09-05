import React, { useContext } from 'react'
import styles from './Table.module.scss';
import TableItem from './TableItem';
import AppContext from '../../context';

function Table({ data }) {
  const { darkMode } = useContext(AppContext);

  return ( 
    <div className={`${darkMode ? styles.wrapperDark : styles.wrapper}`}>
      <h3 className={`${darkMode ? styles.titleDark : styles.title}`}>Dane według krajów</h3>
      <div className={`${darkMode ? styles.globalDataDark : styles.globalData}`}>
        {data.map(({countryName, flag, totalCases, totalDeaths, totalRecovered, thirtyDaysCases, thirtyDaysDeaths, thirtyDaysRecovered}, i) => (
          <TableItem
            key={i}
            pos={i+1} 
            countryName={countryName}
            flag={flag}
            totalCases={totalCases}
            totalDeaths={totalDeaths}
            totalRecovered={totalRecovered}
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
