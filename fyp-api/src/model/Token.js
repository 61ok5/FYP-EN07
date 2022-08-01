
const { query } = require('../db');

const db = 'refresh_token';

const Token = {};

Token.get = async function (token) {
  const stmt = `SELECT * from ${db} where token = ? and is_deleted = 0;`;
  const result = await query(stmt, [token]);
  return result;
};

Token.findById = async function (refresh_token_id) {
  const stmt = `SELECT * from ${db} where refresh_token_id = ? and is_deleted = 0;`;
  const result = await query(stmt, [refresh_token_id]);
  return result;
};

Token.findByUserId = async function (user_id) {
  const stmt = `SELECT * from ${db} where user_id = ? and is_deleted = 0;`;
  const result = await query(stmt, [user_id]);
  return result;
};

Token.findByAdminId = async function (admin_id) {
  const stmt = `SELECT * from ${db} where admin_id = ? and is_deleted = 0;`;
  const result = await query(stmt, [admin_id]);
  return result;
};

Token.getLastLoginByAdminId = async function (admin_id) {
  const stmt = `SELECT * from ${db} where admin_Id = ? ORDER BY created_at DESC LIMIT 1`;
  const result = await query(stmt, [admin_id]);
  if (result.length === 0)
    return null;
  // single select sql, return first item only
  return result[0].created_at;
};

Token.getLastLoginByUserId = async function (user_id) {
  const stmt = `SELECT * from ${db} where user_id = ? ORDER BY created_at DESC LIMIT 1`;
  const result = await query(stmt, [user_id]);
  if (result.length === 0)
    return null;
  // single select sql, return first item only
  return result[0].created_at;
};

Token.createUser = async function (id, ip, token) {
  const stmt = `INSERT INTO ${db} (user_id, ip, token) VALUES (?, ?, ?);`;
  const result = await query(stmt, [id, ip, token]);
  return result;
};

Token.createAdmin = async function (id, ip, token) {
  const stmt = `INSERT INTO ${db} (admin_id, ip, token) VALUES (?, ?, ?);`;
  const result = await query(stmt, [id, ip, token]);
  return result;
};

Token.createUser = async function (id, ip, token) {
  const stmt = `INSERT INTO ${db} (user_id, ip, token) VALUES (?, ?, ?);`;
  const result = await query(stmt, [id, ip, token]);
  return result;
};

Token.update = async function (id, ip, token) {
  const updateStmt = `UPDATE ${db} SET ip = ?, token = ? WHERE refresh_token_id = ?;`;
  const updateResult = await query(updateStmt, [ip, token, id]);

  const stmt = `SELECT *, refresh_token_id as insertId FROM ${db} WHERE refresh_token_id = ?;`;
  const result = await query(stmt, [id]);
  if (result.length === 0)
    return null;
  // single select sql, return first item only
  return result[0];
};

Token.destroy = async function (id) {
  const stmt = `UPDATE ${db} SET is_deleted = 1 WHERE refresh_token_id = ?;`;
  const result = await query(stmt, [id]);
  return result;
};

Token.revoke = async function (token) {
  const stmt = `UPDATE ${db} SET is_deleted = 1 WHERE token = ?;`;
  const result = await query(stmt, [token]);
  return result;
};

Token.destroyByUserId = async function (id) {
  const stmt = `UPDATE ${db} SET is_deleted = 1 WHERE user_id = ?;`;
  const result = await query(stmt, [id]);
  return result;
};

module.exports = Token;
