import React, { useState } from 'react';
import './index.css';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CovidPage from './pages/Covid';
import NewsPage from './pages/News';
import Navigation from './components/Navigation/Navigation';
import ThemeContext from './Contexts/ThemeContext';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <BrowserRouter>
      <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
        <ThemeProvider theme={theme}>
          <Paper elevation={0} square>
            <Navigation />
            <Switch>
              <Route exact path="/" component={CovidPage} />
              <Route path="/newses" component={NewsPage} />
            </Switch>
          </Paper>
        </ThemeProvider>
      </ThemeContext.Provider>
    </BrowserRouter>
  );
}

export default App;
