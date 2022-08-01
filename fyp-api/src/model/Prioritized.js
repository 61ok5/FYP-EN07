

const Prioritized = {};
const { query } = require('../db');
const Helper = require('../util/helper');

const db_rule = 'rules_prioritized_list';
const db_combine = 'daily_prioritized_list';
const db_colla = 'collaborative_prioritized_list';

Prioritized.selectAll = async function (type) {
    let content;
    switch (type) {
        case 'article':
            content = `IFNULL(article,"[]") as article`;
            break;
        case 'product':
            content = `IFNULL(product,"[]") as product`;
            break;
        case 'activity':
            content = `IFNULL(course,"[]") as activity`;
            break;
        default:
            return [];
    }

    const stmt = `(SELECT user_id, ${content}, 'Rule' as source FROM ${db_rule}) UNION ALL
                  (SELECT user_id, ${content}, 'Collaborative' as source FROM ${db_colla}) UNION ALL
                  (SELECT user_id, ${content}, 'Combine' as source FROM ${db_combine})
                  ORDER BY user_id ASC`;

    return (await query(stmt)).map(el => {
        el[type] = Helper.jsonTryParse(el[type]);
        return el;
    });
}

Prioritized.selectByUserId = async function (userId) {
    const sql = `SELECT s0.user_id,
    IFNULL(s0.article,"[]") as s0_article,IFNULL(s0.product,"[]") as s0_product ,IFNULL(s0.course,"[]") as s0_course,
    IFNULL(s1.article,"[]") as s1_article,IFNULL(s1.product,"[]") as s1_product ,IFNULL(s1.course,"[]") as s1_course,
    IFNULL(s2.article,"[]") as s2_article,IFNULL(s2.product,"[]") as s2_product ,IFNULL(s2.course,"[]") as s2_course
    FROM ${db_rule} s0 
    left join ${db_combine} s1 on s0.user_id=s1.user_id
    left join ${db_colla} s2 on s0.user_id=s2.user_id
    where s0.user_id = ?;`
    const result = await query(sql, [userId]);
    return result[0];
}

Prioritized.selectRule = async function () {
    const sql = `SELECT * from ${db_rule}`;
    const result = await query(sql);
    return result;
}

Prioritized.selectColla = async function () {
    const sql = `SELECT * from ${db_colla}`;
    const result = await query(sql);
    return result;
}

Prioritized.selectCombine = async function () {
    const sql = `SELECT * from ${db_combine}`;
    const result = await query(sql);
    return result;
}

module.exports = Prioritized;
