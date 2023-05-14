import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { connect } from "react-redux";
import {
  openSidebar,
  updateStatusLogin,
  updateModeLight,
  updateCurrentUser,
  pushNotification,
  setNotification,
  updateNotification,
  updateNotiStack,
  removeFirstNotiStack,
} from "../../../store/actions/commonAction";
import {
  openAndCloseChatting,
  updateUsersContacted,
  openAndGetMsg,
} from "../../../store/actions/chattingAction";
import store from "../../../store";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import * as authentication from "../../../services/authenticationService";
import * as notification from "../../../services/notificationService";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Avatar, Button, ListItemAvatar, ListItemText } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import * as chattingService from "../../../services/chattingService";
import Pusher from "pusher-js";
import { StatusRead, TypeNotification } from "../../../utils/constants";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import InformationUser from "../../../components/Popup/informationUser";

const cx = classNames.bind(styles);

const drawerWidth = 240;

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const mapStateToProps = (state) => {
  return {
    open: state.commonReducer.openSidebar,
    logged: state.commonReducer.logged,
    modeLight: state.commonReducer.modeLight,
    usersContacted: state.chattingReducer.usersContacted,
    chatting: state.chattingReducer.chatting,
    currentUser: state.commonReducer.currentUser,
    notifications: state.commonReducer.notifications,
    listFriendOnline: state.commonReducer.listFriendOnline
  };
};

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const Header = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [anchorMessage, setAnchorMessage] = React.useState(null);
  const openListMessage = Boolean(anchorMessage);
  const [anchorNotification, setAnchorNotification] = React.useState(null);
  const openListNotification = Boolean(anchorNotification);
  const [countNotificationUnread, setCountNotificationUnread] =
    React.useState(0);
  const [pusher, setPusher] = React.useState(
    new Pusher("0c1bb67e922d5e222312", {
      cluster: "ap1",
      authEndpoint: "http://localhost:8000/api/v1/chat/pusher/auth",
      auth: {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("loginToken"),
          "Access-Control-Allow-Origin": "*",
        },
      },
      encrypted: true,
    })
  );
  const [channel, setChannel] = React.useState(
    pusher.subscribe("private-notification")
  );

  React.useEffect(() => {
    if (props.currentUser) {
      channel.bind(
        `private-notification-${props.currentUser.id}`,
        function (data) {
          setCountNotificationUnread((prev) => prev + 1);
          let content = "";
          if (data.type === TypeNotification.ADD_FRIEND) {
            content = `<span><b><a href="#" target="_blank">${data.user.name}</a></b> đã gửi lời mời kết bạn</span>`;
          }
          if (data.type === TypeNotification.FOLLOW) {
            content = `<span><b><a href="#" target="_blank">${data.user.name}</a></b> đã theo dõi bạn</span>`;
          }
          setTimeout(() => {
            store.dispatch(removeFirstNotiStack());
          }, 5000);
          store.dispatch(
            updateNotiStack({
              id: data.id,
              content: content,
            })
          );
          store.dispatch(
            pushNotification({
              id: data.id,
              user: data.user,
              type: data.type,
              blog: data.blog,
            })
          );
        }
      );
      notification.getNotification().then((data) => {
        let parseData = data.map((x) => {
          return {
            id: x.id,
            userId: x.owner_user.id,
            userName: x.owner_user.name,
            userImg: "",
            type: x.type,
            status: x.status,
          };
        });
        store.dispatch(setNotification(parseData));
      });
      notification.countNotification().then((data) => {
        setCountNotificationUnread(data);
      });
    }
  }, [props.currentUser]);

  //switch light
  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            "#fff"
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor: props.modeLight === "dark" ? "#8796A5" : "#aab4be",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: props.modeLight === "dark" ? "#003892" : "#001e3c",
      width: 32,
      height: 32,
      "&:before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      borderRadius: 20 / 2,
    },
  }));
  //

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const navigate = useNavigate();

  const handleLogout = async () => {
    setAnchorEl(null);
    handleMobileMenuClose();
    await authentication.logout().then(() => {
      localStorage.removeItem("loginToken");
      store.dispatch(updateStatusLogin(false));
      store.dispatch(updateCurrentUser(null));
      navigate("/login");
    });
  };

  const handleChangeLightMode = () => {
    const mode = localStorage.getItem("light-mode");
    if (mode && mode === "dark") {
      store.dispatch(updateModeLight("light"));
    } else {
      store.dispatch(updateModeLight("dark"));
    }
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = props.currentUser && (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        Chào {props.currentUser.name} - {props.currentUser.id}
      </MenuItem>
      <InformationUser handleMenuClose={handleMenuClose}/>
      <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      
    </Menu>
  );
  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <FormGroup>
          <FormControlLabel
            control={
              <MaterialUISwitch
                checked={props.modeLight === "dark"}
                onChange={handleChangeLightMode}
              />
            }
            sx={{ m: 0 }}
          />
        </FormGroup>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Tin nhắn</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Thông báo</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const handleDrawerOpen = () => {
    store.dispatch(openSidebar());
  };

  const handleRedirectLogin = () => {
    navigate("/login");
  };

  const handleClickListMessage = async (event) => {
    setAnchorMessage(event.currentTarget);
    await chattingService
      .getListUserContacted()
      .then((res) => {
        store.dispatch(updateUsersContacted(res.usersContacted));
      })
      .catch(() => {});
  };

  const handleClickListNotification = (event) => {
    setAnchorNotification(event.currentTarget);
  };

  const handleMarkStatusRead = (event, noti) => {
    event.stopPropagation();
    noti.status =
      noti.status === StatusRead.READED ? StatusRead.UNREAD : StatusRead.READED;
    store.dispatch(updateNotification(noti));
    if (noti.status == StatusRead.READED) {
      setCountNotificationUnread((prev) => prev - 1);
    } else {
      setCountNotificationUnread((prev) => prev + 1);
    }

    notification
      .markStatusRead({
        id: noti.id,
        status: noti.status,
      })
      .then(() => {});
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" open={props.open}>
        <Toolbar
          className={cx("commonBackgroundColor")}
          sx={{ paddingRight: { xs: "0", md: "16px" } }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(props.open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Search className={cx("m-0")}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Tìm kiếm"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
            <input lang="ja-Hrkt" inputmode="kana"/>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton>
              <FormGroup>
                <FormControlLabel
                  control={
                    <MaterialUISwitch
                      checked={props.modeLight === "dark"}
                      onChange={handleChangeLightMode}
                    />
                  }
                  sx={{ m: 0 }}
                />
              </FormGroup>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              id="basic-button"
              aria-controls={openListMessage ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openListMessage ? "true" : undefined}
              onClick={handleClickListMessage}
              className={cx("text-white")}
            >
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorMessage}
              open={openListMessage}
              onClose={() => {
                setAnchorMessage(null);
              }}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {props.usersContacted.map((x) => (
                <MenuItem
                  onClick={() => {
                    if (
                      props.chatting.findIndex(
                        (user) => user.toUserId == x.id
                      ) < 0
                    ) {
                      chattingService
                        .getMessageOfFriend(x.id)
                        .then((res) => {
                          let newUserMsg = {
                            toUserId: x.id,
                            info: res.info,
                            currentMsg: "",
                            msg: [],
                          };
                          res.msgs.forEach((msg) => {
                            newUserMsg.msg.push({
                              message: msg.content,
                              toOther: x.id == msg.to_user_id ? true : false,
                              created_at: msg.created_at,
                              id: msg.id,
                            });
                          });
                          store.dispatch(openAndGetMsg(newUserMsg));
                        })
                        .catch(() => {});
                    } else {
                      store.dispatch(openAndCloseChatting(x.id));
                    }
                    setAnchorMessage(null);
                  }}
                  key={x.id}
                >
                  <ListItemAvatar>
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      variant={props.listFriendOnline.findIndex(user => user.id == x.id) >= 0 ? 'dot' : 'standard'}
                    >
                      <Avatar alt={x.name} src={`https://docs.google.com/uc?id=${x.avatar}`} />
                    </StyledBadge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={x.name}
                    secondary="Cách đây vài năm thôi"
                  />
                </MenuItem>
              ))}
            </Menu>

            {/* notification */}
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
              id="basic-button"
              aria-controls={openListNotification ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openListNotification ? "true" : undefined}
              onClick={handleClickListNotification}
            >
              <Badge badgeContent={countNotificationUnread} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorNotification}
              open={openListNotification}
              onClose={() => {
                setAnchorNotification(null);
              }}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <Box className={cx("menu-notification")}>
                {props.notifications.map((x) => (
                  <MenuItem key={x.id + '-' + x.userId} onClick={() => {}}>
                    <ListItemAvatar>
                      <Avatar>
                        <ImageIcon />
                      </Avatar>
                    </ListItemAvatar>
                    {x.type === TypeNotification.ADD_FRIEND && (
                      <ListItemText
                        secondary={`${x.userName} đã gửi lời kết bạn`}
                      />
                    )}
                    {x.type === TypeNotification.FOLLOW && (
                      <ListItemText
                        secondary={`${x.userName} đã theo dõi bạn`}
                      />
                    )}
                    {x.status === StatusRead.UNREAD ? (
                      <Brightness1Icon
                        style={{ marginLeft: "5px", color: "#c4c1c1" }}
                        onClick={(e) => handleMarkStatusRead(e, x)}
                      ></Brightness1Icon>
                    ) : (
                      <RadioButtonUncheckedIcon
                        style={{ marginLeft: "5px" }}
                        onClick={(e) => handleMarkStatusRead(e, x)}
                      ></RadioButtonUncheckedIcon>
                    )}
                  </MenuItem>
                ))}
              </Box>
              <Box textAlign={"center"}>
                <Button>Đánh dấu đã đọc tất cả</Button>
              </Box>
            </Menu>

            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={
                props.logged ? handleProfileMenuOpen : handleRedirectLogin
              }
              color="inherit"
            >
              {props.logged && <KeyboardArrowDownIcon />}
              {!props.logged && <AccountCircle />}
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
};

export default connect(mapStateToProps)(Header);
