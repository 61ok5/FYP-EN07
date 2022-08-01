const User = {};
const { query } = require('../db');
const time = require('../util/time');

const db_user = 'user';
const db_role = 'role';

User.create = async function (data) {
  const stmt = `INSERT INTO ${db_user} 
                  (email, password, nickname, tel, role_id) 
                  VALUES (?, ?, ?, ?, ?)`;

  const result = await query(stmt, [
    data.email,
    data.hashedPassword,
    data.nickname,
    data.tel,
    data.role_id
  ]);
  if (result) {
    return true;
  }
  return false;
}

User.selectAll = async function () {
  const stmt = `SELECT ${db_user}.*, ${db_role}.name as role, ${db_role}.level as role_level
                  FROM ${db_user}
                  LEFT JOIN ${db_role} ON ${db_user}.role_id = ${db_role}.role_id
                  WHERE ${db_user}.is_enabled = 1`

  const result = await query(stmt);
  return result;
}

User.findById = async function (user_id) {
  const stmt = `SELECT ${db_user}.*, ${db_role}.is_superadmin, ${db_role}.name as role, ${db_role}.level as role_level
                  FROM ${db_user}
                  LEFT JOIN ${db_role} ON ${db_user}.role_id = ${db_role}.role_id
                  WHERE ${db_user}.user_id = ?`

  const result = await query(stmt, [user_id]);
  if (result.length === 0)
    return null;
  // single select sql, return first item only
  return result[0];
}

User.findByEmail = async function (email) {
  const stmt = `SELECT ${db_user}.*, ${db_role}.name as role
                  FROM ${db_user}
                  LEFT JOIN ${db_role} ON ${db_user}.role_id = ${db_role}.role_id
                  WHERE ${db_user}.email = ?`

  const result = await query(stmt, [email]);
  if (result.length === 0)
    return null;
  // single select sql, return first item only
  return result[0];
}

User.updateInfo = async function (data) {
  const stmt = `UPDATE ${db_user} SET nickname = ?, tel = ?, role_id = ?
                  WHERE user_id = ?`

  const result = await query(stmt, [
    data.nickname,
    data.tel,
    data.role_id,
    data.user_id
  ]);
  return result;
}

User.updatePassword = async function (data) {
  const stmtGetOldPw = `SELECT password, password_history from ${db_user}
                          WHERE user_id = ?`
  const currentPassword = await query(stmtGetOldPw, [data.user_id]);

  let password_history = (currentPassword[0].password_history == null || currentPassword[0].password_history == '') ? {} : JSON.parse(currentPassword[0].password_history);
  password_history[time.getDateTime()] = currentPassword[0].password; 
//database throws error when elements of pw hist > 2 because of the char overflow of the data structure in database
  const stmtSetNewPw = `UPDATE ${db_user} SET password = ?, password_history = ?
                          WHERE user_id = ?`

  const result = await query(stmtSetNewPw, [
    data.hashedPassword,
    JSON.stringify(password_history),
    data.user_id
  ]);
  return result;
}

User.deleteById = async function (user_id) {
  const stmt = `UPDATE ${db_user}
                  SET is_enabled = 0
                  WHERE user_id = ?`;

  const result = await query(stmt, [user_id]);
  if (result) {
    return true;
  }
  return false;
}

User.permDeleteById = async function (user_id) {
  const stmt = `DELETE FROM ${db_user}
                  WHERE user_id = ?`;

  const result = await query(stmt, [user_id]);
  if (result) {
    return true;
  }
  return false;
}

module.exports = User;
