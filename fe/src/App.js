import styles from "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { publicRoutes } from "./routes";
import { DefaultLayout } from "./layouts";
import classNames from "classnames/bind";
import * as authentication from "./services/authenticationService";
import store from "./store";
import { updateStatusLogin, updateStatusLoading, closeSidebar } from "./store/actions/commonAction";
import { connect } from "react-redux";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const mapStateToProps = (state) => {
  return {
    loading: state.commonReducer.loading,
    textAlert: state.commonReducer.textAlert,
    modeLight: state.commonReducer.modeLight
  };
};

const cx = classNames.bind(styles);

const App = (props) => {
  // const navigate = useNavigate();
  const [showAlert, isShowAlert] = useState(false);
  const vertical = "top";
  const horizontal = "right";

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
      let isExisting = await authentication.checkToken(
        localStorage.getItem("loginToken")
      );
      if (!isExisting) {
        if (window.location.href.includes("login")) {
          store.dispatch(updateStatusLoading(false));
          return;
        }
        window.location.href = "/login";
      } else {
        store.dispatch(updateStatusLogin(true));
        if (window.location.href.includes("login")) {
          window.location.href = "/";
        }
      }
    }
    store.dispatch(updateStatusLoading(false));
  }, []);

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
                          <Page />
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
      </ThemeProvider>
    </>
  );
};

export default connect(mapStateToProps)(App);
