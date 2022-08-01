const Public = {};
const {query} = require('../db');

const db_api_history = 'api_history';
const db_district = 'district';
const db_api = 'api';

Public.selectAPI = async function (api_code) {
  const stmt = `SELECT ${db_api_history}.*, ${db_api}.api_code, ${db_api}.name AS api_name
                  FROM ${db_api_history}
                  LEFT JOIN ${db_api} 
                  ON ${db_api_history}.api_id = ${db_api}.id
                  WHERE ${db_api}.api_code = '${api_code}'
                  ORDER BY ${db_api_history}.id DESC
                  LIMIT 1`;
  const result = await query(stmt);
  return result;
}

Public.selectDistrict = async function () {
  const stmt = `SELECT * FROM ${db_district}`;
  const result = await query(stmt);
  return result;
}

module.exports = Public;