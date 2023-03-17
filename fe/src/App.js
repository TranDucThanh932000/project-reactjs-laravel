import styles from "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Fragment, useEffect } from "react";
import { publicRoutes } from "./routes";
import { DefaultLayout } from "./layouts";
import classNames from "classnames/bind";
import * as authentication from "./services/authenticationService";
import store from "./store";
import { updateStatusLogin } from "./store/actions/commonAction";

const cx = classNames.bind(styles);

const App = () => {
  // const navigate = useNavigate();

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
  );
};

export default App;
