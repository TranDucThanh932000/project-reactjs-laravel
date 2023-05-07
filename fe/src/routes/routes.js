import config from '../config';

//Layouts

import Home from '../views/blogs/Blog';
import Login from '../views/login/Login';
import Register from '../views/register/Register';
import LuckyNumberToday from '../views/luckyNumberToday/LuckyNumberToday';
import QrCode from '../views/qrCode'
import DetailBlog from '../views/blogs/DetailBlog';

const publicRoutes = [
    { path: config.routes.blog, component: Home },
    { path: config.routes.blogDetail, component: DetailBlog },
    { path: config.routes.login, component: Login },
    { path: config.routes.register, component: Register },
    { path: config.routes.luckyNumberToday, component: LuckyNumberToday },
    { path: config.routes.qrcode, component: QrCode },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };