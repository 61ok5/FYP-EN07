const Similar = {};
const { query } = require('../db');
const Helper = require('../util/helper');
const time = require('../util/time');

const db_similarPro_enabled = 'similar_product_enabled';
const db_similarAct_enabled = 'similar_activity_enabled';
const db_similarArt_enabled = 'similar_article_enabled';


const parseSelectResult = (result) => {
  return Helper.jsonTryParse(result?.similar_id);
};


Similar.findProById = async (id) => {
  const result = await query(`SELECT * FROM ${db_similarPro_enabled} WHERE id = ?`, [id]);
  return parseSelectResult(result[0]);
};


Similar.findActById = async (id) => {
  const result = await query(`SELECT * FROM ${db_similarAct_enabled} WHERE id = ?`, [id]);
  return parseSelectResult(result[0]);
};

Similar.findArtById = async (id) => {
  const result = await query(`SELECT * FROM ${db_similarArt_enabled} WHERE id = ?`, [id]);
  return parseSelectResult(result[0]);
};



module.exports = Similar;
