const Admin = {};
const { query } = require('../db');
const time = require('../util/time');

const db_admin = 'admin';
const db_role = 'role';

Admin.create = async function (data) {
  const stmt = `INSERT INTO ${db_admin} 
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

Admin.selectAll = async function () {
  const stmt = `SELECT ${db_admin}.*, ${db_role}.name as role, ${db_role}.level as role_level
                  FROM ${db_admin}
                  LEFT JOIN ${db_role} ON ${db_admin}.role_id = ${db_role}.role_id
                  WHERE ${db_admin}.is_enabled = 1`

  const result = await query(stmt);
  return result;
}

Admin.findById = async function (admin_id) {
  const stmt = `SELECT ${db_admin}.*, ${db_role}.is_superadmin, ${db_role}.name as role, ${db_role}.level as role_level
                  FROM ${db_admin}
                  LEFT JOIN ${db_role} ON ${db_admin}.role_id = ${db_role}.role_id
                  WHERE ${db_admin}.admin_id = ?`

  const result = await query(stmt, [admin_id]);
  if (result.length === 0)
    return null;
  // single select sql, return first item only
  return result[0];
}

Admin.findByEmail = async function (email) {
  const stmt = `SELECT ${db_admin}.*, ${db_role}.name as role
                  FROM ${db_admin}
                  LEFT JOIN ${db_role} ON ${db_admin}.role_id = ${db_role}.role_id
                  WHERE ${db_admin}.email = ?`

  const result = await query(stmt, [email]);
  if (result.length === 0)
    return null;
  // single select sql, return first item only
  return result[0];
}

Admin.updateInfo = async function (data) {
  const stmt = `UPDATE ${db_admin} SET nickname = ?, tel = ?, role_id = ?
                  WHERE admin_id = ?`

  const result = await query(stmt, [
    data.nickname,
    data.tel,
    data.role_id,
    data.admin_id
  ]);
  return result;
}

Admin.updatePassword = async function (data) {
  const stmtGetOldPw = `SELECT password, password_history from ${db_admin}
                          WHERE admin_id = ?`
  const currentPassword = await query(stmtGetOldPw, [data.admin_id]);

  let password_history = (currentPassword[0].password_history == null || currentPassword[0].password_history == '') ? {} : JSON.parse(currentPassword[0].password_history);
  password_history[time.getDateTime()] = currentPassword[0].password; 
//database throws error when elements of pw hist > 2 because of the char overflow of the data structure in database
  const stmtSetNewPw = `UPDATE ${db_admin} SET password = ?, password_history = ?
                          WHERE admin_id = ?`

  const result = await query(stmtSetNewPw, [
    data.hashedPassword,
    JSON.stringify(password_history),
    data.admin_id
  ]);
  return result;
}

Admin.deleteById = async function (admin_id) {
  const stmt = `UPDATE ${db_admin}
                  SET is_enabled = 0
                  WHERE admin_id = ?`;

  const result = await query(stmt, [admin_id]);
  if (result) {
    return true;
  }
  return false;
}

Admin.permDeleteById = async function (admin_id) {
  const stmt = `DELETE FROM ${db_admin}
                  WHERE admin_id = ?`;

  const result = await query(stmt, [admin_id]);
  if (result) {
    return true;
  }
  return false;
}

module.exports = Admin;
