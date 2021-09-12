import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';
import Paper from '@material-ui/core/Paper';
import NewsCard from '../components/NewsCard/NewsCard';
import { formatArticlesData } from '../utils';
import { fetchData } from '../utils';
import ThemeContext from '../Contexts/ThemeContext';

const useStyles = makeStyles((theme) => {
  return {

    wrapper: {
      backgroundColor: '#f5f5f5',
    },
    darkWrapper: {
      backgroundColor: '#585858',
    },

    gridWrapper: {
      paddingTop: theme.spacing(6),
      marginBottom: theme.spacing(5),
      width: '90%',
      margin: 'auto',
    },

    gridItem: {
      display: 'flex',
    },

    paginationContainer: {
      display: 'flex',
      justifyContent: 'center',
      paddingBottom: theme.spacing(6),
    },
  };
});

function News() {
  const classes = useStyles();

  const [articlesData, setArticlesData] = useState(null);
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [curPage, setCurPage] = useState(1);

  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    (async () => {
      const data = await fetchData('https://newsapi.org/v2/top-headlines?country=pl&apiKey=188a11c2d49b4c3faf1b90955147dd9b');
      setArticlesData(formatArticlesData(data.articles));
      setDisplayedArticles(formatArticlesData(data.articles.slice(0, 12)));

    })();
  }, []);

  const handleArticlesView = (curPage) => {
    if (curPage === 1) setDisplayedArticles(articlesData.slice(0, 12));
    if (curPage === 2) setDisplayedArticles(articlesData.slice(12, 20));
  };

  const handlePageChange = (_, page) => {
    setCurPage(page);
    handleArticlesView(page);
  };

  return (
    <Paper elevation={0} square className={darkMode ? classes.darkWrapper : classes.wrapper}>
      <div className={classes.gridWrapper}>
        <Grid className={classes.gridContainer} container spacing={4}>
          {displayedArticles &&
            displayedArticles.map((article, i) =>
              i === 0 && curPage === 1 ? (
                <Grid
                  className={classes.gridItem}
                  key={article.title}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                >
                  <NewsCard new data={article} />
                </Grid>
              ) : (
                <Grid
                  className={classes.gridItem}
                  key={article.title}
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                >
                  <NewsCard data={article} />
                </Grid>
              )
            )}
        </Grid>
      </div>
      <div className={classes.paginationContainer}>
        <Pagination
          count={2}
          page={curPage}
          onChange={handlePageChange}
          size="medium"
          color={darkMode ? 'standard' : 'primary'}
          variant="outlined"
        />
      </div>
    </Paper>
  );
}

export default News;
