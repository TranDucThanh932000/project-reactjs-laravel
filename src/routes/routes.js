import config from '../config';

//Layouts

import Home from '../views/blogs/Blog';
import Following from '../views/blogs/Blog';

const publicRoutes = [
    { path: config.routes.blog, component: Home },
    { path: config.routes.email, component: Following },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };