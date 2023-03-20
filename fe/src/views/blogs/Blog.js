import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import * as blogService from '../../services/blogService';
import * as blogLikeService from '../../services/blogLikeService';
import store from "../../store";
import { connect } from "react-redux";

import classNames from "classnames/bind";
import styles from "./Blog.module.scss";
import { Grid } from "@mui/material";
import { updateStatusLoading } from "../../store/actions/commonAction";
import moment from 'moment';
const mapStateToProps = (state) => {
  return {
    loading: state.commonReducer.loading,
  };
};
const cx = classNames.bind(styles);

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function Blog() {
  const [expanded, setExpanded] = React.useState(false);
  const [items, setItems] = React.useState([]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleFavorite = async (val, index) => {
    const newItems = [...items];
    store.dispatch(updateStatusLoading(true));
    if(val) {
      //like
      await blogLikeService.like(newItems[index].id)
      .then((res) => {
        newItems[index].blog_likes.push(true);
        newItems[index].blog_likes_count = res.newCount;
        setItems(newItems);
      })
    } else {
      //unlike
      await blogLikeService.unlike(newItems[index].id)
      .then((res) => {
        newItems[index].blog_likes.pop();
        newItems[index].blog_likes_count = res.newCount;
        setItems(newItems);
      })
    }
    store.dispatch(updateStatusLoading(false));
  };

  React.useEffect(async () => {
    store.dispatch(updateStatusLoading(true));
    await blogService.blogs()
    .then(res => {
      setItems(res.blogs)
    })
    .finally(() => {
      store.dispatch(updateStatusLoading(false));
    })
  }, [])

  const formatTime = React.useCallback((val) => {
    return moment(val, 'YYYY-MM-DD hh:mm:ss').format('DD/MM/YYYY hh:mm');
  }, [])

  return (
    <div className={cx("wrapper")}>
      <Grid container spacing={2}>
        {items.map((x, index) => {
          return (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <Card sx={{ maxWidth: "100%" }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                      R
                    </Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={ x.user.name }
                  subheader={ formatTime(x.updated_at) }
                />
                <CardMedia
                  component="img"
                  height="194"
                  image={require("src/assets/img/logo/logo.png")}
                  alt="Image"
                />
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    { x.shot_description }
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  {!x.blog_likes.length ? (
                    <IconButton aria-label="add to favorites" onClick={() => handleFavorite(1, index)}>
                      <FavoriteBorderIcon />
                    </IconButton>
                  ) : (
                    <IconButton aria-label="add to favorites" onClick={() => handleFavorite(0, index)}>
                      <FavoriteIcon />
                    </IconButton>
                  )}
                  { x.blog_likes_count }
                  <IconButton aria-label="share">
                    <ShareIcon />
                  </IconButton>
                  <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Typography paragraph>{ x.content }</Typography>
                  </CardContent>
                </Collapse>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

export default connect(mapStateToProps)(Blog);
