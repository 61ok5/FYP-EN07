const Permissions = require('./util/permission');


function notFound(req, res, next) {
  res.status(404);
  const error = new Error('NOT_FOUND');
  next(error);
}

function errorHandler(err, req, res, next) {
  /* eslint-enable no-unused-vars */
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  console.log(req.headers);
  console.log(err.message);
  res.status(statusCode).json({
    error: err.message,
    stack: process.env.NODE_ENV === 'production' ? 'AN_ERROR_OCCURED' : err.stack
  });
}

function getIp(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  res.locals.ip = ip; // usage: res.locals.ip
  next();
}

async function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

function adminOnly(req, res, next) {
  const isAdmin = Permissions.isAdmin(req.user);
  if (!isAdmin) {
    res.status(401).json({ error: 'PERMISSION_DENIED' });
  } else {
    next();
  }
}

async function apiTokenGetUserId(req, res, next) {
  if (Permissions.isApiToken(req.user)) {
    const userId = (req.body.user_id) ? req.body.user_id : ((req.query.user_id) ? req.query.user_id : null);
    const userPhone = (req.body.phone) ? req.body.phone : ((req.query.phone) ? req.query.phone : null);
    if (userId) {
      req.user.id = userId;
    } else if (userPhone) {
      const stmt = `SELECT id FROM bc_1100_users WHERE user_phone = ?`;
      const { locolla_query } = require('./db');
      const result = await locolla_query(stmt, [
        userPhone
      ]);
      if (result.length > 0) {
        req.user.id = result[0].id;
      }
    }
  }
  next();
}

module.exports = {
  notFound,
  errorHandler,
  getIp,
  nocache,
  adminOnly,
  apiTokenGetUserId
};
