import * as React from "react";
// import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
// import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CircularProgress from "@mui/material/CircularProgress";
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import * as blogService from "../../services/blogService";
import * as blogLikeService from "../../services/blogLikeService";
import * as categoryService from '../../services/categoryService'
import store from "../../store";
import { connect } from "react-redux";

import classNames from "classnames/bind";
import styles from "./Blog.module.scss";
import {
  Button,
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
import { Link, useNavigate } from "react-router-dom";
import GroupCheckBox from "../../components/GroupCheckBox";

const mapStateToProps = (state) => {
  return {
    logged: state.commonReducer.logged
  };
};
const cx = classNames.bind(styles);

// const ExpandMore = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//   transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
//   marginLeft: "auto",
//   transition: theme.transitions.create("transform", {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

function Blog(props) {
  // const [expanded, setExpanded] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [loadMore, setLoadMore] = React.useState(false);
  const [doneFirstLoad, setDoneFirstLoad] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const colorAvatar = ["red", "pink", "grey", "blue", "green", "yellow", "orange", "gray", "#123333", "#678123"];
  const [listType, setListType] = React.useState([]);
  const [typeChoosed, setTypeChoosed] = React.useState([]);
  const [resetItemLength, setResetItemLength] = React.useState(false);
  //popper search
  const [listChildrenGroupCheckBox, setListChildrenGroupCheckBox] = React.useState([
    { key: 'view', label: "Nhiều lượt xem nhất", handleChange: () => { mostView() }, checked: false },
    { key: 'blog_likes_count', label: "Nhiều like nhất", handleChange: () => { mostLike() }, checked: false },
  ]);
  const [sortBy, setSortBy] = React.useState("");
  const [anchorElPopperSearch, setAnchorElPopperSearch] = React.useState(null);
  const openPopperDetailSearch = Boolean(anchorElPopperSearch);
  const idPopperSearch = openPopperDetailSearch ? 'simple-popper-2' : undefined;
  const navigate = useNavigate();

  const handleClickPopperSearch = (event) => {
    setAnchorElPopperSearch(anchorElPopperSearch ? null : event.currentTarget);
  };

  const formatTime = React.useCallback((val) => {
    return moment(val, "YYYY-MM-DD hh:mm:ss").format("DD/MM/YYYY hh:mm");
  }, []);
  
  const sortByGroupCheckBox = async (listCheckBox) => {
    let txtSearch = "";
    listCheckBox.forEach(x => {
      if(x.checked) {
        txtSearch += (x.key + ",");
      }
    })
    if(txtSearch.length > 0) {
      txtSearch = txtSearch.substring(0, txtSearch.length - 1);
    }
    setSortBy(txtSearch);
    store.dispatch(updateStatusLoading(true));
    await handleLoadData(15, typeChoosed, false, txtSearch);
    store.dispatch(updateStatusLoading(false));
  }

  const mostView = React.useCallback(() => {
    let newValue = listChildrenGroupCheckBox.map(x => {
      if(x.key === 'view') {
        x.checked = !x.checked;
      }
      return x;
    })
    setListChildrenGroupCheckBox(newValue);
    sortByGroupCheckBox(newValue);
  }, [listChildrenGroupCheckBox]);

  const mostLike = React.useCallback(() => {
    let newValue = listChildrenGroupCheckBox.map(x => {
      if(x.key === 'blog_likes_count') {
        x.checked = !x.checked;
      }
      return x;
    })
    setListChildrenGroupCheckBox(newValue);
    sortByGroupCheckBox(newValue);
  }, [listChildrenGroupCheckBox]);

  const handleChangeParentGroupCheckBox = React.useCallback((value) => {
    let newValue = listChildrenGroupCheckBox.map(x => {
      x.checked = value
      return x;
    })
    setListChildrenGroupCheckBox(newValue);
    sortByGroupCheckBox(newValue);
  }, [listChildrenGroupCheckBox]);

  const checkAllGroupCheckBox = () => {
    let check = true;
    listChildrenGroupCheckBox.forEach((x) => {
      if (!x.checked) {
        check = false;
      }
    });
    return check;
  };

  // const handleExpandClick = () => {
  //   setExpanded(!expanded);
  // };

  const handleFavorite = async (val, index) => {
    if(! props.logged) {
      navigate('/login');
      return;
    }
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

  const handleLoadData = async (amount, categories, isScroll, sortBy) => {
    await blogService.blogs(isScroll ? items.length : 0, amount, categories, sortBy).then((res) => {
      if (!res) {
        //too many request
        return;
      }
      //setItems((prev) => prev.push(...res.blogs));
      //như trên không chạy, khả năng do nó k thấy sự thay đổi địa chỉ nên không rerender
      //còn concat này nó đẩy thêm data mới vào và tạo ra 1 mảng có địa chỉ mới
      if (isScroll) {
        setItems((prev) => prev.concat(res.blogs));
      } else {
        setItems(() => [].concat(res.blogs));
      }
      setResetItemLength((prev) => !prev);
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

  const getListType = () => {
    categoryService.getListType().then((res) => {
      setListType([{
        id: '',
        name: 'Tất cả'
      }, 
      ...res]);
    })
  }

  //load 15 blog last of any category
  React.useEffect(async () => {
    store.dispatch(updateStatusLoading(true));
    getListType();
    await handleLoadData(15, '', false, '');
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
      await handleLoadData(6, typeChoosed, true, sortBy);
      setLoadMore(false);
    }
  };

  React.useEffect(() => {
    if (doneFirstLoad) {
      if (!loadMore) {
        window.addEventListener("scroll", handleScroll);
      }
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [doneFirstLoad, loadMore, typeChoosed, resetItemLength, sortBy]);

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

  function getStyles(name, typeChoosed, theme) {
    return {
      fontWeight:
        typeChoosed.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  const theme = useTheme();

  const handleChange = async (event) => {
    var {
      target: { value },
    } = event;

    if(value[value.length - 1].id === '') {
      value = [listType[0]];
    } else if(value.length > 1 && value[0].id === '') {
      value = [value[1]];
    }

    setTypeChoosed(
      // On autofill we get a stringified value.
      () => typeof value === "string" ? value.split(",") : value
    );
    store.dispatch(updateStatusLoading(true));
    await handleLoadData(15, value, false, sortBy);
    store.dispatch(updateStatusLoading(false));
  };
  //

  const handleDeleteSelection = async (chipToDelete) => {
    setTypeChoosed((chips) => chips.filter((chip) => chip.id != chipToDelete.id));
    store.dispatch(updateStatusLoading(true));
    await handleLoadData(6, typeChoosed.filter((chip) => chip.id != chipToDelete.id), false, sortBy);
    store.dispatch(updateStatusLoading(false));
  };

  return (
    <div className={cx("wrapper")}>
      <Grid container spacing={2} sx={{ my: 2 }}>
        <Grid item xs={12} md={4} className={cx('py-0')}>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel id="demo-multiple-chip-label">Thể loại</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={typeChoosed}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Thể loại" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  <>
                    {selected.map((value) => (
                      <Chip key={value.id} label={value.name} color="primary" 
                      deleteIcon={
                        <CancelIcon
                          onMouseDown={(event) => event.stopPropagation()}
                        />
                      }
                      onDelete={() => handleDeleteSelection(value)}/>
                    ))}
                  </>
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {
                listType.map((x) => (
                  <MenuItem
                    key={x.id}
                    value={x}
                    style={getStyles(x.name, typeChoosed, theme)}
                  >
                    {x.name}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4} className={cx('py-0')}>
          <Button aria-describedby={idPopperSearch} type="button" onClick={handleClickPopperSearch} variant="outlined" endIcon={<ArrowDropDownIcon />} >
            Bộ lọc chi tiết
          </Button>
          <Popper style={{zIndex: '100'}} id={idPopperSearch} open={openPopperDetailSearch} anchorEl={anchorElPopperSearch}>
            <Box sx={{ border: '1px solid grey', p: 1, bgcolor: 'background.paper', borderRadius: '10px', boxShadow: '0px 0px 20px 3px rgba(0, 0, 0, 0.5)' }}>
              <GroupCheckBox 
              listChildren={listChildrenGroupCheckBox}
              handleChangeParent={handleChangeParentGroupCheckBox}
              labelParent={"Tất cả"}
              checkAll={checkAllGroupCheckBox}
              ></GroupCheckBox>
            </Box>
          </Popper>
        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          container
          direction="row"
          justifyContent={{xs: "", md: "flex-end"}}
          marginTop={{ xs: "10px", md: "0" }}
          className={cx('py-0')}
        >
          <Box>
            <CreateBlog createBlog={handleCreateBlog} listType={listType} MenuProps={MenuProps}></CreateBlog>
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
                          src={`https://docs.google.com/uc?id=${x.user.avatar}`}
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
                    <Link to={`/${x.id}`}>
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
                    </Link>
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
                      {/* <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                      >
                        <ExpandMoreIcon />
                      </ExpandMore> */}
                    </CardActions>
                    {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
                      <CardContent>
                        <Typography paragraph className={cx("word-break")}>
                          {x.content}
                        </Typography>
                      </CardContent>
                    </Collapse> */}
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
