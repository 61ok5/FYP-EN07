 
 
const Category = {};
const { query } = require('../db');
//const time = require('../util/time');

const db_category = 'tags';
const db_category_group = 'category_group';

//const db_user = 'user'; // how to use?

Category.selectAll = async function () {
  const stmt = `SELECT ${db_category}.*, ${db_category_group}.Name AS groupName
  FROM ${db_category}
  LEFT JOIN ${db_category_group} ON ${db_category}.CategoryGroupID=${db_category_group}.id`;
  
  const result = await query(stmt);
  return result;
}

Category.findById = async function (id) {
  const stmt = `SELECT ${db_category}.*, ${db_category_group}.Name AS groupName
  FROM ${db_category}
  LEFT JOIN ${db_category_group} ON ${db_category}.CategoryGroupID=${db_category_group}.id
  WHERE ${db_category}.id = ?`;

  const result = await query(stmt, [id]);
  if (result.length === 0)
    return null;
  // single select sql, return first item only
  return result[0];
}

Category.addCategory = async function (Name, group_id, Source) {
  const stmt = `INSERT INTO ${db_category}
                  (Name, CategoryGroupID, Source)
                  VALUES (?, ?, ?)`;
  // is category_id auto-incrementing?

  const result = await query(stmt, [
    Name,
    group_id,
    Source]);

    console.log(result)
    return true;
}

Category.groupIdCheck = async function (groupName) {
  const stmt = `SELECT ${db_category_group}.id FROM ${db_category_group} WHERE ? = ${db_category_group}.Name`
  const result = await query(stmt, groupName)
  return result
}

Category.updateCategory = async function (id, Name, group_id, Source) {
    const stmt = `UPDATE ${db_category}
    SET Name = ?, CategoryGroupID = ?, Source = ?
    WHERE id IN (?)`;

    const result = await query(stmt, [
    Name,
    group_id,
    Source,
    id
    ]);
    console.log(result)
    return true;
}

/*
Category.deleteById = async function (id) {
  const stmt = `DELETE FROM ${db_category}
                  WHERE id = ?`;

  const result = await query(stmt, [id]);
  if (result) {
    return true;
  }
  return false;
}
*/

module.exports = Category;
