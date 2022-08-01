/* eslint-disable global-require */
/* eslint-disable no-unused-vars */
const Weather = {};
const { query } = require('../db');
const district = new (require('../util/district.js'))();

const db_weather_warning_log = 'warning_log';
const db_weather_daily_forecast_log = 'Weather_daily_forecast_log';
const db_weather_hourly_log = 'Weather_hourly_log';

Weather.selectDaily = async function (language) {
  const stmt = `SELECT ${db_weather_daily_forecast_log}.*
                  FROM ${db_weather_daily_forecast_log}
                  WHERE ${db_weather_daily_forecast_log}.language = '${language}'
                  ORDER BY ${db_weather_daily_forecast_log}.created_at DESC, date
                  LIMIT 9`;
  const result = await query(stmt);
  return result;
}

Weather.selectWarning = async function (language) {
  const createdAtObj = await this.selectCreatedAt();
  var createdAtStr = JSON.stringify(createdAtObj[0].created_at);
  createdAtStr = createdAtStr.substring(1, 20);
  createdAtStr = createdAtStr.split("T");
  createdAtStr = createdAtStr[0] + " " + createdAtStr[1]
  const stmt = `SELECT *
                  FROM ${db_weather_warning_log}
                  WHERE ${db_weather_warning_log}.language = ?
                  AND ${db_weather_warning_log}.created_at = ?`;
  const result = await query(stmt, [language, createdAtStr]);
  return result;
}

Weather.selectHourly = async function (lat, lon) {
  const endTimeObj = await this.selectEndTime();
  const endTimeStr = JSON.stringify(endTimeObj[0].created_at);
  const dist = district.coordToDistrict(lon, lat);
  const distID = dist.id;
  const stmt = `SELECT * 
                  FROM ${db_weather_hourly_log}
                  WHERE ${db_weather_hourly_log}.created_at = ${endTimeStr}
                  ORDER BY CASE WHEN ${db_weather_hourly_log}.DistrictID = ${distID}
                  THEN 0 ELSE 1 END ASC`;
  const result = await query(stmt);
  return result;
}

Weather.selectEndTime = async function () {
  const stmt = `SELECT ${db_weather_hourly_log}.created_at
                  FROM ${db_weather_hourly_log}
                  ORDER BY ${db_weather_hourly_log}.id DESC
                  LIMIT 1`;
  const results = await query(stmt);
  return results;
}

Weather.selectCreatedAt = async function () {
  const stmt = `SELECT ${db_weather_warning_log}.created_at
                  FROM ${db_weather_warning_log}
                  ORDER BY ${db_weather_warning_log}.created_at DESC
                  LIMIT 1`;
  const results = await query(stmt);
  return results;
}

module.exports = Weather;