 
 
const Product = {};
const { query } = require('../db');
//const time = require('../util/time');

const db_product = 'eshop';
//const db_user = 'user'; // how to use?

Product.selectAll = async function () {
  const stmt = `SELECT id, name, category, disabled, created_at, updated_at FROM ${db_product}`;

  const result = await query(stmt);
  return result;
}

Product.selectDisplayed = async function (pageNumber) {
  const stmt = `SELECT id, name, image, price FROM ${db_product} 
                WHERE disabled = 0
                LIMIT ${20 * (pageNumber - 1)}, 20`;

  const result = await query(stmt,[pageNumber]);
  return result;
}

Product.InfoByID = async function (id) {
  const stmt = `SELECT name, image, price, url, category, disabled FROM ${db_product} 
                WHERE id = ?`;
  const result = await query(stmt,[id]);
  return result;
}

Product.updateWeight = async function (id, category) {
  const stmt = `UPDATE ${db_product}
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

Product.Alltitle = async function (id){
  const sql = `SELECT id,name as title from ${db_product}`;
  const result = await query(sql,[id]);
  return result
}

module.exports = Product;
