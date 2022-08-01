const express = require('express');
const expressJwt = require('express-jwt');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const http = require('http');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '/../.env') });

const middlewares = require('./middlewares');
const api = require('./api');

const app = express();
const apiServer = http.createServer(app);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const secret = process.env.SECRET;
app.use(
  expressJwt({ secret, algorithms: ['HS256'] }).unless({
    path: [
      '/api/user/login',
      '/api/user/login/',

      '/api/station/',

      '/api/admin/login',
      '/api/admin/login/',
      '/api/admin/forgotPwd',
      '/api/admin/forgotPwd/',
      '/api/admin/resetPwd',
      '/api/admin/resetPwd/',
      '/api/admin/revoke_token',
      '/api/admin/revoke_token/',

      /\/api\/product*/,
      '/api/product/',
      '/api/product/*',
      
      '/api/public/',
      '/api/weather/',
      '/api/traffic/',
      '/api/health/',
      '/api/nc/register',

      /\/api\/course(?!\/list)/,
      // '/api/course/info/all',
      // '/api/course/info/*',
      // '/api/course/top',
      // '/api/course/result',

      '/api/user/login',
      '/api/user/login/',
      '/api/user/create',
      '/api/user/forgotPwd',
      '/api/user/forgotPwd/',
      '/api/user/resetPwd',
      '/api/user/resetPwd/',
      '/api/user/revoke_token',
      '/api/user/revoke_token/',

    ]
  })
);

app.use(middlewares.nocache);
app.use(middlewares.getIp);
app.use(middlewares.apiTokenGetUserId);
app.use('/api', api);
app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = {
  apiServer
};
