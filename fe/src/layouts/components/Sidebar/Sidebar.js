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
import { closeSidebar } from "../../../store/actions/commonAction";
import store from "../../../store";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.scss";
import classNames from "classnames/bind";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import Looks4Icon from "@mui/icons-material/Looks4";
import Looks5Icon from "@mui/icons-material/Looks5";
import * as followService from "../../../services/followService";
import { Card, CardActions, CardContent, CardMedia, Popover, Typography } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import HoverPopover from "material-ui-popup-state/HoverPopover";
import PopupState, {
  bindTrigger,
  bindPopover,
  bindHover
} from "material-ui-popup-state";

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
    currentUser: state.commonReducer.currentUser
  };
};

const Sidebar = (props) => {
  const theme = useTheme();
  const [listFollowerRanking, setListFollowerRanking] = React.useState([]);
  const handleDrawerClose = () => {
    store.dispatch(closeSidebar());
  };

  React.useEffect(() => {
    followService.getTop5Follower().then((res) => {
      res.top5.forEach(x => x.followed = false)
      setListFollowerRanking(res.top5);
    });
  }, []);

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
    followService.follow(userId)
    .then(() => {
      let newListFL = JSON.parse(JSON.stringify(listFollowerRanking));
      let index = newListFL.findIndex(x => x.user_id == userId);
      newListFL[index].followed = true;
      setListFollowerRanking(newListFL);
    })
  }

  const handleUnFollow = (userId) => {
    followService.unfollow(userId)
    .then(() => {
      let newListFL = JSON.parse(JSON.stringify(listFollowerRanking));
      let index = newListFL.findIndex(x => x.user_id == userId);
      newListFL[index].followed = false;
      setListFollowerRanking(newListFL);
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
              {listFollowerRanking.map((user, index) => (
                <div key={index}>
                  <PopupState variant="popover" popupId="demo-popup-popover">
                      {(popupState) => (
                          <div>
                              <ListItem
                                variant="contained" {...bindHover(popupState)}
                                aria-haspopup="true"
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
                                    image="/static/images/cards/contemplative-reptile.jpg"
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
                                      !user.followed ? (
                                        <IconButton
                                        disabled={user.user_id == props.currentUser.id ? true : false}
                                        onClick={() => handleFollow(user.user_id)}>
                                          <AddAlertIcon></AddAlertIcon>
                                        </IconButton>
                                      ) : (
                                        <IconButton color="primary" onClick={() => handleUnFollow(user.user_id)}>
                                          <AddAlertIcon></AddAlertIcon>
                                        </IconButton>
                                      )
                                    }
                                    <IconButton>
                                      <PersonAddIcon></PersonAddIcon>
                                    </IconButton>
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
