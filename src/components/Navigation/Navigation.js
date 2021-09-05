import React, { useContext } from 'react';
import styles from './Navigation.module.scss';
import { NavLink } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';
import AppContext from '../../context';


function Navigation() {
  const { darkMode, setDarkMode } = useContext(AppContext);

  return (
    <nav>
      <div className={styles.wrapper}>
        <div className={styles.title}>
          <h1>What's new?</h1>
          <span className={styles.titleImage}></span>
        </div>
        <ul className={styles.list}>
          <li>
            <Switch
              checked={darkMode}
              color='default'
              onChange={() => setDarkMode(!darkMode)}
            ></Switch>
          </li>
          <li className={styles.listItem}>
            <NavLink
              activeClassName={styles.listItemLinkActive}
              className={styles.listItemLink}
              exact
              to="/"
            >
              COVID-19
            </NavLink>
          </li>
          <li className={styles.listItem}>
            <NavLink
              activeClassName={styles.listItemLinkActive}
              className={styles.listItemLink}
              to="/newses"
            >
              NEWS
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
