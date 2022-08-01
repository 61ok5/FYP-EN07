const Dashboard = {};
const { query } = require('../db');
const Helper = require('../util/helper');

const db_dashboard = 'dashboard';

const parseSelectResult = (result) => {
  if (result) {
    result.activity_ranking = Helper.jsonTryParse(result.activity_ranking);
    result.article_ranking = Helper.jsonTryParse(result.article_ranking);
    result.eshop_ranking = Helper.jsonTryParse(result.eshop_ranking);
  }
  return result;
};

Dashboard.selectAll = async () => {
  const result = await query(`SELECT * FROM ${db_dashboard}`);
  return result.map(el => el = parseSelectResult(el));
};

Dashboard.findByDate = async (date) => {
  const result = await query(`SELECT * FROM ${db_dashboard} WHERE date = ?`, [date]);
  return parseSelectResult(result[0]);
};

module.exports = Dashboard;
