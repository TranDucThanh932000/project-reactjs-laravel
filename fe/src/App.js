import styles from './App.scss';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
import { Fragment } from 'react';
import { publicRoutes } from './routes';
import { DefaultLayout } from './layouts';
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function App() {
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
                                <div className={cx('p-2')}>
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
}

export default App;
