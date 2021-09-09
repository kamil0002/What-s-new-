import React, {useContext} from 'react';
import numeral from 'numeral';
import styles from './TableItem.module.scss';
import AppContext from './../../context';

function TableItem({ countryName, flag, cases, deaths, recovered, thirtyDaysCases, thirtyDaysDeaths, thirtyDaysRecovered, pos }) {

  const { darkMode } = useContext(AppContext);

  return (
    <div className={`${darkMode ? styles.countryInfoDark : styles.countryInfo}`}>
      <div className={styles.countryInfoCaption}>
        <img
          className={styles.countryInfoCaptionFlag}
          src={flag}
          alt={countryName}
        />
        <h5 className={`${darkMode ? styles.countryInfoCaptionNameDark : styles.countryInfoCaptionName}`}>{countryName} <span>({pos})</span></h5>
        <p className={`${darkMode ? styles.countryInfoCaptionNavDark : styles.countryInfoCaptionNav}`}>
          <span>Zakażenia</span> / <span>Zgony</span> / <span>Wyzdrowiali</span>
        </p>
      </div>
      <div className={styles.countryInfoDetails}>
        <p className={`${darkMode ? styles.countryInfoDetailsDataDark : styles.countryInfoDetailsData}`}>
          30 dni - <span>{numeral(thirtyDaysCases).format('0,0.[00')}</span> / <span>{numeral(thirtyDaysDeaths).format('0,0.[00')}</span> /{' '}
          <span>{thirtyDaysRecovered > 0 ? numeral(thirtyDaysRecovered).format('0,0.[00') : '?'}</span>
        </p>
        <p className={`${darkMode ? styles.countryInfoDetailsDataDark : styles.countryInfoDetailsData}`}>
          Łącznie - <span>{numeral(cases).format('0,0.[00')}</span> / <span>{numeral(deaths).format('0,0.[00')}</span> /{' '}
          <span>{numeral(recovered).format('0,0.[00')}</span>
        </p>
      </div>
    </div>
  );
}

export default TableItem;
