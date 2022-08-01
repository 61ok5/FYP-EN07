 
 
const Article = {};
const { query } = require('../db');
//const time = require('../util/time');

const db_article = 'article';
//const db_user = 'user'; // how to use?

Article.selectAll = async function () {
  const stmt = `SELECT id, title, category, created_at, updated_at FROM ${db_article}`;

  const result = await query(stmt);
  return result;
}

Article.updateWeight = async function (id, category) {
  const stmt = `UPDATE ${db_article}
                  SET category = ?
                  WHERE id IN (?)`;

  const result = await query(stmt, [
    category,
    id
  ]);
  if (result) {
    return true;
  }
  return false;
}

Article.Alltitle = async function (){
  const sql = `SELECT id,title from ${db_article}`;
  const result = await query(sql);
  return result
}

module.exports = Article;
