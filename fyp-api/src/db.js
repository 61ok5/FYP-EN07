const mysql = require('mysql');

const pool = mysql.createPool({
  host: process.env.SQL_HOST,
  database: process.env.SQL_DB,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASS,
  charset: 'utf8mb4',
  connectionLimit: 50
});

const query = (sql, values) => new Promise((resolve, reject) => {
  //console.log(values)
  pool.getConnection((err, connection) => {
    if (err) {
      reject(err);
    } else {
      connection.query(sql, values, (e, rows) => {
        if (e) {
          reject(e);
        } else {
          resolve(rows);
        }
        connection.release();
      });
    }
  });
});

module.exports = { query };
