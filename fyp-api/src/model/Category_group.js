 
 
const Category_group = {};
const { query } = require('../db');
//const time = require('../util/time');

const db_category_group = 'category_group';
//const db_user = 'user'; // how to use?

Category_group.selectAll = async function () {
  const stmt = `SELECT * FROM ${db_category_group}`;

  const result = await query(stmt);
  return result;
}

Category_group.findById = async function (id) {
  const stmt = `SELECT * FROM ${db_category_group}
                  WHERE id = ?`;

  const result = await query(stmt, [id]);
  if (result.length === 0)
    return null;
  // single select sql, return first item only
  return result[0];
}

Category_group.addGroup = async function (Name) {
  const stmt = `INSERT INTO ${db_category_group}
                  (Name)
                  VALUES (?)`;
  // is group_id auto-incrementing?

  const result = await query(stmt, [Name]);

  if (result) {
    return true;
  }
  return false;
}

Category_group.updateGroup = async function (id, Name) {
  const stmt = `UPDATE ${db_category_group}
  SET Name = ?
  WHERE id IN (?)`;
  const result = await query(stmt, [Name, id]);
  if (result) {
    return true;
  }
  return false;
}

Category_group.deleteById = async function (id) {
  const stmt = `DELETE FROM ${db_category_group}
                  WHERE id = ?`;

  const result = await query(stmt, [id]);
  if (result) {
    return true;
  }
  return false;
}


module.exports = Category_group;
