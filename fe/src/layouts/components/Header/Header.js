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
} from "../../../store/actions/commonAction";
import {
  openAndCloseChatting,
  updateUsersContacted,
  openAndGetMsg
} from "../../../store/actions/chattingAction";
import store from "../../../store";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import * as authentication from "../../../services/authenticationService";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import {
  Avatar,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import * as chattingService from "../../../services/chattingService"

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
    currentUser: state.commonReducer.currentUser
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

const Header = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [anchorMessage, setAnchorMessage] = React.useState(null);
  const openListMessage = Boolean(anchorMessage);

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
  const renderMenu = (
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
      <MenuItem onClick={handleMenuClose}>Chào {props.currentUser.name} - {props.currentUser.id}</MenuItem>
      <MenuItem onClick={handleMenuClose}>Thông tin cá nhân</MenuItem>
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

  const handleClickListMessage = (event) => {
    setAnchorMessage(event.currentTarget);
    chattingService.getListUserContacted()
    .then((res) => {
      store.dispatch(updateUsersContacted(res.usersContacted));
    })
    .catch(() => {})
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" open={props.open}>
        <Toolbar className={cx("commonBackgroundColor")} sx={{ paddingRight: {xs: "0", md: "16px"} }}>
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
              {
                props.usersContacted.map(x => (
                  <MenuItem
                    onClick={() => {
                      if(props.chatting.findIndex(user => user.toUserId == x.id) < 0) {
                        chattingService.getMessageOfFriend(x.id)
                        .then((res) => {
                          let newUserMsg = {
                            toUserId: x.id,
                            currentMsg: '',
                            msg: []
                          };
                          res.msgs.forEach(msg => {
                            newUserMsg.msg.push({
                              message: msg.content,
                              toOther: x.id == msg.to_user_id ? true : false,
                              created_at: msg.created_at,
                              id: msg.id
                            })
                          });
                          store.dispatch(openAndGetMsg(newUserMsg));
                        })
                        .catch(() => {})
                      } else {
                        store.dispatch(openAndCloseChatting(x.id));
                      }
                      setAnchorMessage(null);
                    }}
                    key={x.id}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <ImageIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={x.name} secondary="Cách đây vài năm thôi" />
                  </MenuItem>
                  
                ))
              }
            </Menu>

            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
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
