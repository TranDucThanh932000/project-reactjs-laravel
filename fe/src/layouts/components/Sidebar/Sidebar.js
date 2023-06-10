import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { connect } from "react-redux";
import { 
  closeSidebar, 
  updateListRankingFollower 
} from "../../../store/actions/commonAction"; 
import store from "../../../store";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import classNames from "classnames/bind";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import Looks4Icon from "@mui/icons-material/Looks4";
import Looks5Icon from "@mui/icons-material/Looks5";
import * as followService from "../../../services/followService";
import * as friendService from "../../../services/friendService";
import { Card, CardActions, CardContent, CardMedia, CircularProgress, Tooltip, Typography } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import HoverPopover from "material-ui-popup-state/HoverPopover";
import PopupState, {
  // bindTrigger,
  bindPopover,
  bindHover
} from "material-ui-popup-state";
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddDisabledIcon from '@mui/icons-material/PersonAddDisabled';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { StatusFriend } from '../../../utils/constants'

const cx = classNames.bind(styles);
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const mapStateToProps = (state) => {
  return {
    open: state.commonReducer.openSidebar,
    sideBarItems: state.commonReducer.sideBarItems,
    currentUser: state.commonReducer.currentUser,
    listFollowerRanking: state.commonReducer.listFollowerRanking,
    modeLight: state.commonReducer.modeLight
  };
};

const Sidebar = (props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loadingStatusFriend, setLoadingStatusFriend] = React.useState(false);
  const [loadingFollowing, setLoadingFollowing] = React.useState(false);

  const handleDrawerClose = () => {
    store.dispatch(closeSidebar());
  };

  React.useEffect(() => {
    followService.getTop5Follower().then((res) => {
      store.dispatch(updateListRankingFollower([...(res.top5)]));
    });
  }, [props.currentUser]);

  const rankingIcon = (rank) => {
    switch (rank) {
      case 1:
        return <LooksOneIcon sx={{ color: "#FF6347" }}></LooksOneIcon>;
      case 2:
        return <LooksTwoIcon sx={{ color: "#EE82EE" }}></LooksTwoIcon>;
      case 3:
        return <Looks3Icon sx={{ color: "#F5DEB3" }}></Looks3Icon>;
      case 4:
        return <Looks4Icon sx={{ color: "#C0C0C0" }}></Looks4Icon>;
      case 5:
        return <Looks5Icon sx={{ color: "#C0C0C0" }}></Looks5Icon>;
      default:
        return <></>;
    }
  };

  const handleFollow = (userId) => {
    setLoadingFollowing(true);
    followService.follow(userId)
    .then(() => {
      let newListFL = JSON.parse(JSON.stringify(props.listFollowerRanking));
      let index = newListFL.findIndex(x => x.user_id == userId);
      newListFL[index].followed = true;
      store.dispatch(updateListRankingFollower(newListFL));
      setLoadingFollowing(false);
    })
  }

  const handleUnFollow = (userId) => {
    setLoadingFollowing(true);
    followService.unfollow(userId)
    .then(() => {
      let newListFL = JSON.parse(JSON.stringify(props.listFollowerRanking));
      let index = newListFL.findIndex(x => x.user_id == userId);
      newListFL[index].followed = false;
      store.dispatch(updateListRankingFollower(newListFL));
      setLoadingFollowing(false);
    })
  }

  const handleAddFriend = (friend) => {
    setLoadingStatusFriend(true);
    friendService.addFriend(friend)
    .then(() => {
      let newListFL = JSON.parse(JSON.stringify(props.listFollowerRanking));
      let index = newListFL.findIndex(x => x.user_id == friend);
      newListFL[index].user.friend = [];
      newListFL[index].user.is_add_friend = [
        {
          user_id: props.currentUser.id,
          friend,
          status: StatusFriend.WAITTING
        }
      ];
      store.dispatch(updateListRankingFollower(newListFL));
      setLoadingStatusFriend(false);
    })
  }

  const handleUnFriend = (friend) => {
    setLoadingStatusFriend(true);
    friendService.unFriend(friend)
    .then(() => {
      let newListFL = JSON.parse(JSON.stringify(props.listFollowerRanking));
      let index = newListFL.findIndex(x => x.user_id == friend);
      newListFL[index].user.friend = [];
      newListFL[index].user.is_add_friend = [];
      store.dispatch(updateListRankingFollower(newListFL));
      setLoadingStatusFriend(false);
    })
  }

  const handleCancelRequestFriend = (friend) => {
    setLoadingStatusFriend(true);
    friendService.cancelRequest(friend)
    .then(() => {
      let newListFL = JSON.parse(JSON.stringify(props.listFollowerRanking));
      let index = newListFL.findIndex(x => x.user_id == friend);
      newListFL[index].user.friend = [];
      newListFL[index].user.is_add_friend = [];
      store.dispatch(updateListRankingFollower(newListFL));
      setLoadingStatusFriend(false);
    })
  }

  const handleAcceptRequestFriend = (friend) => {
    setLoadingStatusFriend(true);
    friendService.acceptRequest(friend)
    .then(() => {
      let newListFL = JSON.parse(JSON.stringify(props.listFollowerRanking));
      let index = newListFL.findIndex(x => x.user_id == friend);
      newListFL[index].user.friend = [];
      newListFL[index].user.is_add_friend = [
        {
          user_id: friend,
          friend: props.currentUser.id,
          status: StatusFriend.ACCEPTED
        }
      ];
      store.dispatch(updateListRankingFollower(newListFL));
      setLoadingStatusFriend(false);
    })
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer variant="permanent" open={props.open}>
        <DrawerHeader>
          <div className={cx("logo")}>
            {/* <img src={logo} height={"40px"} alt={"logo"} loading="lazy" className={cx('logo_img')}/> */}
            <h3 className={cx("colorCommon")}>COC Mountain</h3>
          </div>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {props.sideBarItems.map((item, index) => (
            <NavLink
              to={item.url}
              key={index}
              className={(nav) => cx({ active: nav.isActive })}
              style={{ color: props.modeLight == 'dark' ? 'white' : 'black' }}
            >
              <ListItem
                key={item.text}
                disablePadding
                sx={{ display: "block" }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: props.open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: props.open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{ opacity: props.open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            </NavLink>
          ))}
        </List>
        <Divider />

        {props.open && (
          <>
            <List className={cx("text-center", "pt-3", "fz20")}>
              Top người theo dõi
            </List>
            <List>
              {props.listFollowerRanking.map((user, index) => (
                <div key={index}>
                  <PopupState variant="popover" popupId="demo-popup-popover">
                      {(popupState) => (
                          <div>
                              <ListItem
                                variant="contained" {...bindHover(popupState)}
                                aria-haspopup="true"
                                disablePadding
                                sx={{ display: "block" }}
                                onClick={() => { navigate('/user/' + user.user.id) }}
                              >
                                <ListItemButton
                                  sx={{
                                    minHeight: 48,
                                    justifyContent: props.open ? "initial" : "center",
                                    px: 2.5,
                                  }}
                                >
                                  <ListItemIcon
                                    sx={{
                                      minWidth: 0,
                                      mr: props.open ? 3 : "auto",
                                      justifyContent: "center",
                                    }}
                                  >
                                    {rankingIcon(index + 1)}
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={user.user.name}
                                    sx={{ opacity: props.open ? 1 : 0 }}
                                  />
                                </ListItemButton>
                              </ListItem>
                              <HoverPopover
                                  {...bindPopover(popupState)}
                                  anchorOrigin={{
                                      vertical: 'bottom',
                                      horizontal: 'right',
                                  }}
                                  transformOrigin={{
                                      vertical: 'top',
                                      horizontal: 'center',
                                  }}
                              >
                                <Card sx={{ maxWidth: 345, minWidth: 250 }}>
                                  <CardMedia
                                    sx={{ height: 140 }}
                                    image={user.user.avatar ? `https://docs.google.com/uc?id=${user.user.avatar}` : "https://png.pngtree.com/thumb_back/fh260/background/20200714/pngtree-modern-double-color-futuristic-neon-background-image_351866.jpg"}
                                    title={user.user.name}
                                  />
                                  <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                      {user.user.name}
                                    </Typography>
                                    {/* <Typography variant="body2" color="text.secondary">
                                      Lizards are a widespread group of squamate reptiles, with over 6,000
                                      species, ranging across all continents except Antarctica
                                    </Typography> */}
                                  </CardContent>
                                  <CardActions>
                                    {
                                      loadingFollowing ? (
                                        <CircularProgress />
                                      ) : 
                                      (
                                        !user.followed ? (
                                          <IconButton
                                          disabled={props.currentUser && user.user_id == props.currentUser.id ? true : false}
                                          onClick={() => {
                                            if (props.currentUser) {
                                              handleFollow(user.user_id)
                                            } else {
                                              navigate("/login");
                                            }
                                          }}>
                                            <AddAlertIcon></AddAlertIcon>
                                          </IconButton>
                                        ) : (
                                          <IconButton color="primary" onClick={() => handleUnFollow(user.user_id)}>
                                            <AddAlertIcon></AddAlertIcon>
                                          </IconButton>
                                        )
                                      )
                                    }
                                    {
                                      loadingStatusFriend ? (
                                        <CircularProgress />
                                      ) : 
                                      ((user.user.friend.length > 0 || user.user.is_add_friend.length > 0)) 
                                      ? 
                                      (
                                        ((user.user.friend.length > 0 && user.user.friend[0].status == StatusFriend.ACCEPTED) || (user.user.is_add_friend.length > 0 && user.user.is_add_friend[0].status == StatusFriend.ACCEPTED)) ? 
                                        (<Tooltip title="Hủy kết bạn"><IconButton onClick={() => handleUnFriend(user.user_id)}><PersonRemoveIcon></PersonRemoveIcon></IconButton></Tooltip>)
                                        : 
                                        ((user.user.friend.length > 0 && user.user.friend[0].status == StatusFriend.WAITTING) ? <Tooltip title="Đồng ý kết bạn"><IconButton onClick={() => handleAcceptRequestFriend(user.user_id)}><HowToRegIcon></HowToRegIcon></IconButton></Tooltip> : <Tooltip title="Hủy yêu cầu kết bạn"><IconButton onClick={() => handleCancelRequestFriend(user.user_id)}><PersonAddDisabledIcon></PersonAddDisabledIcon></IconButton></Tooltip>)
                                      )
                                      : 
                                      (
                                        <IconButton
                                          disabled={props.currentUser && user.user_id == props.currentUser.id ? true : false}
                                          onClick={() => {
                                            if (props.currentUser) {
                                              handleAddFriend(user.user_id)
                                            } else {
                                              navigate("/login");
                                            }
                                          }}
                                        >
                                          <PersonAddIcon></PersonAddIcon>
                                        </IconButton>
                                      )                                    
                                    }

                                  </CardActions>
                                </Card>
                              </HoverPopover>
                          </div>
                      )}
                  </PopupState>
                </div>
              ))}
            </List>
          </>
        )}
      </Drawer>
    </Box>
  );
};

export default connect(mapStateToProps)(Sidebar);
