/* eslint-disable global-require */
/* eslint-disable no-unused-vars */
const Traffic = {};
const {query} = require('../db');

const db_traffic_roadworks = 'roadworks';
const db_special_traffic_log = 'special_traffic_log';
const db_journey_time_log = 'journey_time';
const db_journey_time_street = 'journey_time_street';

Traffic.selectRoadWorks = async function (language) {
  const updatedAt = await this.selectUpdatedAt(db_traffic_roadworks);
  const updatedAtStr = JSON.stringify(updatedAt[0].updated_at);
  const stmt = `SELECT ${db_traffic_roadworks}.*
                  FROM ${db_traffic_roadworks}
                  WHERE ${db_traffic_roadworks}.language = '${language}'
                  AND ${db_traffic_roadworks}.updated_at = ${updatedAtStr}
                  ORDER BY ${db_traffic_roadworks}.id DESC`;
  const result = await query(stmt);
  return result;
}

Traffic.selectSpecialTraffic = async function (language) {
  const updatedAt = await this.selectUpdatedAt(db_special_traffic_log);
  const updatedAtStr = JSON.stringify(updatedAt[0].updated_at);
  const stmt = `SELECT *
                  FROM ${db_special_traffic_log}
                  WHERE ${db_special_traffic_log}.language = '${language}'
                  AND ${db_special_traffic_log}.updated_at = ${updatedAtStr}
                  ORDER BY ${db_special_traffic_log}.id DESC`;
  const result = await query(stmt);
  return result;
}

Traffic.selectJourney = async function (language) {
  const stmt = `SELECT ${db_journey_time_log}.*, ${db_journey_time_street}.Road_${language} AS road_name
                  FROM ${db_journey_time_log}
                  JOIN ${db_journey_time_street} ON ${db_journey_time_street}.id = ${db_journey_time_log}.road_id`;
  const result = await query(stmt);
  return result;
}

Traffic.selectUpdatedAt = async function (dbname) {
  const stmt = `SELECT ${dbname}.updated_at
                  FROM ${dbname}
                  ORDER BY ${dbname}.id DESC
                  LIMIT 1`;
  const results = await query(stmt);
  return results;
}
module.exports = Traffic;