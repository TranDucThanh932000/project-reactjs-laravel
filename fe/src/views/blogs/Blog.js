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
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import * as blogService from "../../services/blogService";
import * as blogLikeService from "../../services/blogLikeService";
import store from "../../store";
import { connect } from "react-redux";

import classNames from "classnames/bind";
import styles from "./Blog.module.scss";
import { Grid } from "@mui/material";
import { updateStatusLoading } from "../../store/actions/commonAction";
import moment from "moment";
import { Box } from "@mui/system";
import Popper from '@mui/material/Popper';
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
  const [loadMore, setLoadMore] = React.useState(false);
  const [noLongerBlog, setNoLongerBlog] = React.useState(false);
  const [doneFirstLoad, setDoneFirstLoad] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const vertical = 'top';
  const horizontal = 'right';
  const colorAvatar = ["red", "pink", "grey", "blue", "green", "yellow"];

  const formatTime = React.useCallback((val) => {
    return moment(val, "YYYY-MM-DD hh:mm:ss").format("DD/MM/YYYY hh:mm");
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleFavorite = async (val, index) => {
    const newItems = [...items];
    store.dispatch(updateStatusLoading(true));
    if (val) {
      //like
      await blogLikeService.like(newItems[index].id).then((res) => {
        newItems[index].blog_likes.push(true);
        newItems[index].blog_likes_count = res.newCount;
        setItems(newItems);
      });
    } else {
      //unlike
      await blogLikeService.unlike(newItems[index].id).then((res) => {
        newItems[index].blog_likes.pop();
        newItems[index].blog_likes_count = res.newCount;
        setItems(newItems);
      });
    }
    store.dispatch(updateStatusLoading(false));
  };

  const handleLoadData = async (amount) => {
    setNoLongerBlog(false);
    await blogService
      .blogs(items.length, amount)
      .then((res) => {
        if(!res) {
          //too many request
          return;
        }
        //setItems((prev) => prev.push(...res.blogs));
        //như trên không chạy, khả năng do nó k thấy sự thay đổi địa chỉ nên không rerender
        //còn concat này nó đẩy thêm data mới vào và tạo ra 1 mảng có địa chỉ mới
        setItems((prev) => prev.concat(res.blogs));
        if(res.blogs.length === 0) {
          setNoLongerBlog(true);
        }
      })
  }

  //load 9 blog last
  React.useEffect(async () => {
    store.dispatch(updateStatusLoading(true));
    await handleLoadData(9)
    setDoneFirstLoad(true);
    store.dispatch(updateStatusLoading(false));
  }, []);

  const handleScroll = async () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    if (scrollY + windowHeight >= scrollHeight) {
      //get more 6 blogs
      setLoadMore(true);
      await handleLoadData(6);
      setLoadMore(false);
    }
  }

  React.useEffect(() => {
    if (doneFirstLoad) {
      if (loadMore) {
        window.removeEventListener('scroll', handleScroll);
      } else {
        window.addEventListener('scroll', handleScroll);
      }
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [doneFirstLoad, loadMore])

  const handleHover = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  }

  const openPopper = Boolean(anchorEl);
  const id = openPopper ? 'simple-popper' : undefined;

  return (
    <div className={cx("wrapper")}>
      <Grid container spacing={2}>
        {items.length ? items.map((x, index) => {
          return (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <Card sx={{ maxWidth: "100%" }}>
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: colorAvatar[Math.floor(Math.random() * 5)],
                      }}
                      aria-label="recipe"
                    >
                      {x.user.name[0]}
                    </Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={x.user.name}
                  subheader={formatTime(x.updated_at)}
                />
                <CardMedia
                  component="img"
                  height="194"
                  image={require("src/assets/img/logo/logo.png")}
                  alt="Image"
                  aria-describedby={x.id}
                  onClick={handleHover}
                />
                <button aria-describedby={id} type="button" onClick={handleHover}>btn</button>
                <Popper id={id} open={openPopper} anchorEl={anchorEl}>
                  <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
                    { x.id }
                  </Box>
                </Popper>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {x.short_description}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  {!x.blog_likes.length ? (
                    <IconButton
                      aria-label="add to favorites"
                      onClick={() => handleFavorite(1, index)}
                    >
                      <FavoriteBorderIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      aria-label="remove to favorites"
                      onClick={() => handleFavorite(0, index)}
                    >
                      <FavoriteIcon sx={{ color: "pink" }} />
                    </IconButton>
                  )}
                  {x.blog_likes_count}
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
                    <Typography paragraph>{x.content}</Typography>
                  </CardContent>
                </Collapse>
              </Card>
              <Snackbar open={noLongerBlog} onClose={() => setNoLongerBlog(false)} autoHideDuration={3000} anchorOrigin={{ vertical, horizontal }}>
                <Alert severity="info" onClose={() => setNoLongerBlog(false)} sx={{ width: '100%' }}>
                  <strong>Không còn bài viết nào!</strong>
                </Alert>
              </Snackbar>
            </Grid>
          )})
          : 
          ( doneFirstLoad && <h1>Chưa có bài viết nào!!!</h1> ) 
        }
      </Grid>
      {loadMore && (
        <Box
          alignItems="center"
          textAlign="center"
          height="100px"
          display="flex"
        >
          <Box width="100%">
            <CircularProgress sx={{ color: "pink" }} />
          </Box>
        </Box>
      )}
    </div>
  );
}

export default connect(mapStateToProps)(Blog);