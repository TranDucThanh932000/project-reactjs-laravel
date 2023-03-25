import styles from "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { publicRoutes } from "./routes";
import { DefaultLayout } from "./layouts";
import classNames from "classnames/bind";
import * as authentication from "./services/authenticationService";
import store from "./store";
import { updateStatusLogin } from "./store/actions/commonAction";
import { connect } from "react-redux";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";


const mapStateToProps = (state) => {
  return {
    loading: state.commonReducer.loading,
    textAlert: state.commonReducer.textAlert
  };
};

const cx = classNames.bind(styles);

const App = (props) => {
  // const navigate = useNavigate();
  const [showAlert, isShowAlert] = useState(false);
  const vertical = "top";
  const horizontal = "right";

  useEffect(async () => {
    if (!localStorage.getItem("loginToken")) {
      if (window.location.href.includes("login")) return;
      window.location.href = "/login";
    } else {
      let isExisting = await authentication.checkToken(
        localStorage.getItem("loginToken")
      );
      if (!isExisting) {
        if (window.location.href.includes("login")) return;
        window.location.href = "/login";
      } else {
        store.dispatch(updateStatusLogin(true));
        if (window.location.href.includes("login")) {
          window.location.href = "/";
        }
      }
    }
  }, []);

  return (
    <>
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
                      <div className={cx("p-2")}>
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
    </>
  );
};

export default connect(mapStateToProps)(App);
