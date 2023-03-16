import config from '../config';

//Layouts

import Home from '../views/blogs/Blog';
import Login from '../views/login/Login';

const publicRoutes = [
    { path: config.routes.blog, component: Home },
    { path: config.routes.login, component: Login },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };