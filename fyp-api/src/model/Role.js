
const Role = {};
const { query } = require('../db');

const db_role = 'role';
const db_permission = 'permission';
const db_role_permission = 'role_permission';

Role.selectAll = async function () {
  const stmt = `SELECT * FROM ${db_role}`;

  const result = await query(stmt);
  return result;
};

Role.selectPermittedByLevel = async function (level) {
  const stmt = `SELECT * FROM ${db_role}
                  WHERE level >= ?`;

  const result = await query(stmt, [level]);
  return result;
};

Role.selectPermissionByRoleId = async function (role_id) {
  const stmt = `SELECT ${db_permission}.*
                  FROM ${db_role} 
                  INNER JOIN ${db_role_permission} ON ${db_role}.role_id = ${db_role_permission}.role_id
                  INNER JOIN ${db_permission} ON ${db_role_permission}.permission_id = ${db_permission}.permission_id
                  WHERE ${db_role}.role_id = ?`;

  const result = await query(stmt, [role_id]);
  return result;
};

Role.selectPermissionByPermissionName = async function (permissionName) {
  const stmt = `SELECT * FROM ${db_permission}
                  WHERE name = ?`;

  const result = await query(stmt, [permissionName]);
  if (result.length === 0)
    return null;
  // single select sql, return first item only
  return result[0];
};

Role.findById = async function (role_id) {
  const stmt = `SELECT * from ${db_role} where role_id = ?`;

  const result = await query(stmt, [role_id]);
  if (result.length === 0)
    return null;
  // single select sql, return first item only
  return result[0];
};

Role.create = async function (data) {
  const stmt = `INSERT INTO ${db_role} (name) VALUES (?);`;

  const result = await query(stmt, [data.name]);
  return result;
};

Role.deleteById = async function (role_id) {
  const stmt = `DELETE FROM ${db_role} WHERE role_id = ?;`;

  const result = await query(stmt, [role_id]);
  return result;
};

module.exports = Role;
