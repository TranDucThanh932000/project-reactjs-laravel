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

import * as blogService from "../../services/blogService";
import * as blogLikeService from "../../services/blogLikeService";
import store from "../../store";
import { connect } from "react-redux";

import classNames from "classnames/bind";
import styles from "./Blog.module.scss";
import {
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { updateStatusLoading, updateTextAlert } from "../../store/actions/commonAction";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { Box } from "@mui/system";
import Popper from "@mui/material/Popper";
import CreateBlog from "./CreateBlog";
import SkeletonBlog from "./Skeleton";

const mapStateToProps = (state) => {
  return {
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
  const [doneFirstLoad, setDoneFirstLoad] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const colorAvatar = ["red", "pink", "grey", "blue", "green", "yellow", "orange", "gray", "#123333", "#678123"];

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
    await blogService.blogs(items.length, amount).then((res) => {
      if (!res) {
        //too many request
        return;
      }
      //setItems((prev) => prev.push(...res.blogs));
      //như trên không chạy, khả năng do nó k thấy sự thay đổi địa chỉ nên không rerender
      //còn concat này nó đẩy thêm data mới vào và tạo ra 1 mảng có địa chỉ mới
      setItems((prev) => prev.concat(res.blogs));
      if (res.blogs.length === 0) {
        store.dispatch(updateTextAlert('Không còn bài viết nào!'));
        setTimeout(() => {
          store.dispatch(updateTextAlert(''));
        }, 3000)
      }
    });
  };

  const handleCreateBlog = (val) => {
    setItems([val.blog, ...items]);
  };

  //load 9 blog last
  React.useEffect(async () => {
    store.dispatch(updateStatusLoading(true));
    await handleLoadData(9);
    setDoneFirstLoad(true);
    store.dispatch(updateStatusLoading(false));
  }, []);

  const handleScroll = async () => {
    const innerHeight = window.innerHeight;
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    if (scrollY + windowHeight >= (scrollHeight - innerHeight * 0.1)) {
      //get more 6 blogs
      setLoadMore(true);
      await handleLoadData(6);
      setLoadMore(false);
    }
  };

  React.useEffect(() => {
    if (doneFirstLoad) {
      if (loadMore) {
        window.removeEventListener("scroll", handleScroll);
      } else {
        window.addEventListener("scroll", handleScroll);
      }
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [doneFirstLoad, loadMore]);

  const openPopper = Boolean(anchorEl);
  const id = openPopper ? "simple-popper" : undefined;

  //menu
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const [listType, setListType] = React.useState([
    { key: 0, label: 'Tất cả' },
    { key: 1, label: 'jQuery' },
    { key: 2, label: 'Polymer' },
    { key: 3, label: 'React' },
    { key: 4, label: 'Vue.js' },
  ]);

  function getStyles(name, typeChoosed, theme) {
    return {
      fontWeight:
        typeChoosed.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  const theme = useTheme();
  const [typeChoosed, setTypeChoosed] = React.useState([
  ]);

  const handleChange = (event) => {
    var {
      target: { value },
    } = event;

    if(value[value.length - 1].key === 0) {
      value = [listType[0]];
    } else if(value.length > 1 && value[0].key === 0) {
      value = [value[1]];
    }

    setTypeChoosed(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  //

  const handleDeleteSelection = (chipToDelete) => {
    console.log('delete')
    setListType((chips) => chips.filter((chip) => chip.key != chipToDelete.key));
  };

  return (
    <div className={cx("wrapper")}>
      <Grid container spacing={2} sx={{ my: 2 }}>
        <Grid item xs={12} md={6} className={cx('py-0')}>
          <FormControl sx={{ width: 300 }}>
            <InputLabel id="demo-multiple-chip-label">Thể loại</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={typeChoosed}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  <>
                    {selected.map((value) => (
                      <Chip key={value.key} label={value.label} color="primary" onDelete={() => handleDeleteSelection(value)}/>
                    ))}
                  </>
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {listType.map((x) => (
                <MenuItem
                  key={x.key}
                  value={x}
                  style={getStyles(x.label, typeChoosed, theme)}
                >
                  {x.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          container
          direction="row"
          justifyContent={{xs: "", md: "flex-end"}}
          marginTop={{ xs: "10px", md: "0" }}
          className={cx('py-0')}
        >
          <Box>
            <CreateBlog createBlog={handleCreateBlog}></CreateBlog>
          </Box>
        </Grid>
      </Grid>
      <Grid container id="cuadricula">
        {!doneFirstLoad && <SkeletonBlog />}
        {items.length
          ? items.map((x, index) => {
              return (
                <Grid key={index} item className={cx('item')}>
                  <Card sx={{ maxWidth: "100%" }}>
                    <CardHeader
                      avatar={
                        <Avatar
                          sx={{
                            bgcolor: colorAvatar[x.user.id % 10],
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
                    <CardContent>
                      <Box>
                        <Grid container spacing={2}>
                          {x.blog_medias.length > 0 &&
                            x.blog_medias.map((img) => (
                              <Grid key={img.id} item sm={12} md={6}>
                                <CardMedia
                                  component="img"
                                  height="194"
                                  image={`https://docs.google.com/uc?id=${img.url}`}
                                  alt="Image"
                                  aria-describedby={img.id}
                                  className={cx(
                                    "image-blog",
                                    "border-radius-1"
                                  )}
                                />
                              </Grid>
                            ))}
                        </Grid>
                      </Box>
                      <Popper id={id} open={openPopper} anchorEl={anchorEl}>
                        <Box
                          sx={{ border: 1, p: 1, bgcolor: "background.paper" }}
                        >
                          {x.id}
                        </Box>
                      </Popper>
                    </CardContent>
                    <CardContent>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className={cx("word-break")}
                      >
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
                        <Typography paragraph className={cx("word-break")}>
                          {x.content}
                        </Typography>
                      </CardContent>
                    </Collapse>
                  </Card>
                </Grid>
              );
            })
          : doneFirstLoad && <h1>Chưa có bài viết nào!!!</h1>}
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
