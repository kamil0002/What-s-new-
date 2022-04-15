import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import noImg from '../../assets/images/noImg.jpg';
import ThemeContext from '../../Contexts/ThemeContext';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  media: {
    height: 185,
    position: 'relative',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
  },

  btn: {
    fontSize: 12,
  },

  newBadge: {
    fontSize: `12px`,
    background: red[300],
    color: '#fff',
    fontWeight: '600',
    paddingLeft: 7,
    paddingRight: 7,
    paddingTop: 4.5,
    paddingBottom: 4.5,
    position: 'absolute',
    right: 8,
    top: 8,
  },
});

function NewsCard({
  data: { title, description, published, link, image },
  ...props
}) {
  const classes = useStyles();

  const { darkMode } = useContext(ThemeContext);

  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={image ? image : noImg}
          title="News image"
        >
          {props.new && <span className={classes.newBadge}>NEW</span>}
        </CardMedia>
        <CardContent>
          <Typography gutterBottom variant="h4" component="h2">
            {title}
          </Typography>
          <Typography variant="inherit" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.cardFooter}>
        <Button
          className={classes.btn}
          size="large"
          color={darkMode ? 'default' : 'primary'}
          href={link}
          target="_blank"
        >
          More
        </Button>
        <Typography variant="subtitle2" color="textSecondary" component="p">
          {published}
        </Typography>
      </CardActions>
    </Card>
  );
}

export default NewsCard;
