const express = require('express');
const masterRoute = require('./master/account.route');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const adminRoute = require('./admin.route');
const config = require('../../config/config');
const memberRoute = require('./member.route');
const transactionalRoute = require('./transactional/contra.route');
const cashinflowRoute = require('./cashinflow/cash.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/admin',
    route: authRoute,
  },
  {
    path: '/admin/master',
    route: masterRoute,
  },
  {
    path: '/admin/transactional',
    route: transactionalRoute,
  },
  {
    path: '/user/cashinflow',
    route: cashinflowRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/super',
    route: adminRoute,
  },
  {
    path: '/member',
    route: memberRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
