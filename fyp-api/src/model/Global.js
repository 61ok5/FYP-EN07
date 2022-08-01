const Global = {};
const { query } = require('../db');

Global.selectAll = async function () {
  const stmt = `SELECT *
                  FROM global_setting`
                  
  const result = await query(stmt);
  return result;
}

Global.findById = async (id) => {
    const stmt = 'SELECT * FROM global_setting WHERE id = ?';
  
    const result = await query(stmt, [id]);
    if (result.length === 0)
      return null;
    // single select sql, return first item only
    return result[0];
};

Global.updateSetting = async function (id, name, value, descirption) {
    const stmt = `UPDATE global_setting
    SET name = ?, value = ?, description = ?
    WHERE id IN (?)`;

    const result = await query(stmt, [name, value, descirption, id]);
    console.log(result)
    return true;
}

module.exports = Global;
