

const Course = {};
const { query } = require('../db');
//const time = require('../util/time');

// const db_course = 'activity';
const db_course = 'course';
const db_course_clean = 'course_clean';
const db_list = 'user_list';
//const db_user = 'user'; // how to use?

Course.selectAll = async function () {
  const stmt = `SELECT * FROM ${db_course_clean}`;
  const result = await query(stmt);

  return result;
}

Course.selectAllPage = async function (PageNumber,RowsOfPage,Query) {
  let queryresult = `WHERE title LIKE '%${Query}%'`;
  if (/\s/.test(Query)) {
    let querylist = Query.split(' ');
    queryresult = querylist.reduce((result, el, index) => 
      index == 0 ? result += ` OR title LIKE '%${el}%'` : result += ` AND title LIKE '%${el}%'`, queryresult
    )
  }
  
  const stmt = `SELECT * FROM ${db_course_clean} ${queryresult} ORDER BY num_subscribers DESC OFFSET ${(PageNumber-1)*RowsOfPage} ROWS FETCH NEXT ${RowsOfPage} ROWS ONLY`;
  console.log(stmt)
  const result = await query(stmt);
  
  return result;
}

Course.InfoByID = async function (id) {
  const stmt = `SELECT * FROM ${db_course_clean} WHERE id = ?`;
  const result = await query(stmt, [id]);

  return result;
}

Course.CourseContentByID = async function (id) {
  const stmt = `SELECT description, image_750x422, image_304x171, headline, rating FROM ${db_course} WHERE id = ?`;
  const result = await query(stmt, [id]);

  return result;
}

Course.TableContentByID = async function (id) {
  const stmt = `SELECT num_subscribers, image_750x422, image_304x171, headline, rating FROM ${db_course} WHERE id = ?`;
  const result = await query(stmt, [id]);

  return result;
}

Course.listSelectAll = async function (id) {
  const stmt = `SELECT * FROM ${db_list} INNER JOIN ${db_course_clean} ON ${db_list}.course_id = ${db_course_clean}.id WHERE user_list.user_id = ? ORDER BY ${db_list}.updated_at ASC`;

  const result = await query(stmt, [id]);
  return result;
}

Course.listUpdate = async function (user_id, course_id) {
  const stmt = `INSERT INTO ${db_list} 
                  (user_id, course_id) 
                  VALUES (?, ?)`;

  const result = await query(stmt, [user_id, course_id]);
  if (result) {
    return true;
  }
  return false;
}




Course.updateWeight = async function (id, category) {
  const stmt = `UPDATE ${db_course}
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

Course.Alltitle = async function (id) {
  const sql = `SELECT id,title from ${db_course}`;
  const result = await query(sql, [id]);
  return result
}

module.exports = Course;
