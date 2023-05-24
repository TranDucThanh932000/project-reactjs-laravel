import styles from "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { publicRoutes } from "./routes";
import { DefaultLayout } from "./layouts";
import classNames from "classnames/bind";
import * as authentication from "./services/authenticationService";
import store from "./store";
import { updateStatusLogin, updateStatusLoading, closeSidebar, updateCurrentUser, updateListFriendOnline } from "./store/actions/commonAction";
import { connect } from "react-redux";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from "@mui/material";
import Chatting from "./views/chatting/Chatting";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import SpeedDialCompontent from './components/SpeedDial';
import Pusher from "pusher-js";

const mapStateToProps = (state) => {
  return {
    loading: state.commonReducer.loading,
    textAlert: state.commonReducer.textAlert,
    modeLight: state.commonReducer.modeLight,
    notiStack: state.commonReducer.notiStack,
    currentUser: state.commonReducer.currentUser,
    listFriendOnline: state.commonReducer.listFriendOnline
  };
};

const cx = classNames.bind(styles);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  textAlign: 'center',
  marginBottom: '5px',
  color: theme.palette.text.secondary,
}));

// const PUSHER_APP_KEY = process.env.PUSHER_APP_KEY;
// const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
// const PUSHER_APP_CLUSTER = process.env.PUSHER_APP_CLUSTER;

const App = (props) => {
  // const navigate = useNavigate();
  const [showAlert, isShowAlert] = useState(false);
  const vertical = "top";
  const horizontal = "right";
  const listFriendOnline = useRef(props.listFriendOnline);

  const darkTheme = createTheme({
    palette: {
      mode: props.modeLight,
    },
  });

  useEffect(async () => {
    //240 là width sidebar
    if(window.innerWidth - 240 < 350) {
      store.dispatch(closeSidebar());
    }
    store.dispatch(updateStatusLoading(true));
    if (! localStorage.getItem("loginToken")) {
      if (window.location.href.includes("login")) {
        store.dispatch(updateStatusLoading(false));
        return;
      }
      // window.location.href = "/login";
    } else {
      let user = await authentication.checkToken(
        localStorage.getItem("loginToken")
      );
      if (!user) {
        if (window.location.href.includes("login")) {
          store.dispatch(updateStatusLoading(false));
          return;
        }
        window.location.href = "/login";
      } else {
        store.dispatch(updateStatusLogin(true));
        user.token = localStorage.getItem("loginToken");
        store.dispatch(updateCurrentUser(user));
        if (window.location.href.includes("login")) {
          window.location.href = "/";
        }
      }
    }
    store.dispatch(updateStatusLoading(false));
  }, []);

  useEffect(async () => {
    if (props.currentUser) {
      var pusher = new Pusher('0c1bb67e922d5e222312', {
        cluster: 'ap1',
        authEndpoint: process.env.REACT_APP_BASE_URL + 'chat/pusher/user-auth',
        auth: {
          headers: {
            "Authorization": "Bearer " + props.currentUser.token,
            "Access-Control-Allow-Origin": "*"
          },
        },
        encrypted: true,
      })

      let channel = pusher.subscribe("presence-online")
      channel.bind("pusher:subscription_succeeded", function (members) {
        let newVal = [];
        Object.keys(members.members).forEach(x => {
          newVal.push(members.members[x]);
        })
        store.dispatch(updateListFriendOnline([...newVal]));
        listFriendOnline.current = [...newVal];
      });
      channel.bind("pusher:member_added", function (member) {
        let newVal = [...listFriendOnline.current];
        newVal.push(member.info);
        store.dispatch(updateListFriendOnline([
          ...newVal
        ]));
        listFriendOnline.current = [...newVal];
      });
      channel.bind("pusher:member_removed", function (member) {
        let newVal = [...listFriendOnline.current];

        let index = newVal.findIndex(x => {
          return x.id === member.id;
        })
        if (index >= 0) {
          newVal.splice(index, 1);
        }
        store.dispatch(updateListFriendOnline([...newVal]));
        listFriendOnline.current = [...newVal];
      });
    }

    return () => {
      if(pusher) {
        pusher.unsubscribe("presence-online");
      }
    }
  }, [props.currentUser])

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Router>
          <div className="App">
            <Routes>
              {publicRoutes.map((route, index) => {
                let Layout = DefaultLayout;
                if (route.layout) {
                  Layout = route.layout;
                } else if (route.layout === null) {
                  Layout = Fragment;
                }
                const Page = route.component;

                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <Layout>
                        <div className={cx("px-2")}>
                          <div className={cx("zIndex100")}>
                            <Page/>
                          </div>
                          <Chatting></Chatting>
                        </div>
                      </Layout>
                    }
                  />
                );
              })}
            </Routes>
          </div>
        </Router>

        {props.loading && (
          <div className="loading-div">
            <div className="loader-img"></div>
          </div>
        )}
        
        <Snackbar
          open={props.textAlert ? true : false}
          onClose={() => isShowAlert(false)}
          anchorOrigin={{ vertical, horizontal }}
        >
          <Alert
            severity="info"
            onClose={() => isShowAlert(false)}
            sx={{ width: "100%" }}
          >
            <strong>{props.textAlert}</strong>
          </Alert>
        </Snackbar>
        
        <Snackbar
          open={true}
          anchorOrigin={{ vertical, horizontal }}
        >
          <Box flexDirection={'column-reverse'}>
            {
              props.notiStack.map(x => (
                <Item sx={{ marginTop: '10px' }}>
                  <Alert severity="info">
                    <div dangerouslySetInnerHTML={{ __html: x.content}}></div>
                  </Alert>
                </Item>
              ))
            }
          </Box>
        </Snackbar>

        <SpeedDialCompontent>
        </SpeedDialCompontent>

      </ThemeProvider>
    </>
  );
};

export default connect(mapStateToProps)(App);
