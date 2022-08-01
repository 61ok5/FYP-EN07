const Ads = {};
const { query } = require('../db');
const Helper = require('../util/helper');
const time = require('../util/time');

const db_ads = 'advertisement';
const db_user_adv = 'user_advertisement';
const db_user_profile = 'user_profile';

const parseSelectResult = (result) => {
  if (result) {
    result.condition = Helper.jsonTryParse(result.condition);
    result.location = result.lat + ", " + result.lon;
    if (result.start_time || result.end_time) {
      result.time = (result.start_time ? result.start_time.slice(0, -3) : "--:--") + " ⮞ " + (result.end_time ? result.end_time.slice(0, -3) : "--:--");
      if (result.start_time) result.start_time = new Date('1970-01-01T' + result.start_time + '+08:00');
      if (result.end_time) result.end_time = new Date('1970-01-01T' + result.end_time + '+08:00');
    }
  }
  return result;
};

Ads.selectAll = async () => {
  const result = await query(`SELECT * FROM ${db_ads}`);
  return result.map(el => el = parseSelectResult(el));
};

Ads.findById = async (id) => {
  const result = await query(`SELECT * FROM ${db_ads} WHERE id = ?`, [id]);
  return parseSelectResult(result[0]);
};

const parseUpdateData = (data) => {
  if (data.condition) {
    data.condition = data.condition.length ? JSON.stringify(data.condition) : null;
  }

  if (data.start_time) data.start_time = time.convertTime(data.start_time);
  if (data.end_time) data.end_time = time.convertTime(data.end_time);

  return [
    data.type,
    data.name,
    data.title_en,
    data.content_en,
    data.title_tc,
    data.content_tc,
    data.title_sc,
    data.content_sc,
    data.source,
    data.source_id,
    data.url,
    data.condition,
    data.lon,
    data.lat,
    data.range,
    data.start_time,
    data.end_time,
    data.enabled,
    data.repeatable,
    data.frequency,
    data.condition_mode
  ];
};

Ads.create = async (data) => {
  const stmt = Helper.genInsert(db_ads, [
    'type', 'name', 'title_en', 'content_en', 'title_tc', 'content_tc', 'title_sc', 'content_sc', 'source', 'source_id', 'url', 'condition', 'lon', 'lat', 'range', 'start_time', 'end_time', 'enabled', 'repeatable', 'frequency', 'condition_mode'
  ]);

  return await query(stmt, parseUpdateData(data));
};

Ads.update = async (data) => {
  const stmt = Helper.genUpdate(db_ads, [
    'type', 'name', 'title_en', 'content_en', 'title_tc', 'content_tc', 'title_sc', 'content_sc', 'source', 'source_id', 'url', 'condition', 'lon', 'lat', 'range', 'start_time', 'end_time', 'enabled', 'repeatable', 'frequency', 'condition_mode'
  ]) + " WHERE id = ?";

  return await query(stmt, [...parseUpdateData(data), data.id]);
};

Ads.delete = async (id) => {
  const stmt = `DELETE FROM ${db_ads} WHERE id = ?`;

  return await query(stmt, id);
};

Ads.push = async (user_id, timestamp, lon, lat) => {
  const now = time.getDateTime();
  const today = time.convertDate(now);

  let user_adv = await query(`SELECT * FROM ${db_user_adv} WHERE user_id = ?`, user_id);

  let lang;
  let matched_ads_at;
  let pushed_at;
  let noti_log = {};
  let matched = [];

  if (user_adv.length) {
    // return if already pushed 3 adv notification today.
    if (user_adv[0].daily_pushed_total > 2) return;

    // load values from user_adv
    matched_ads_at = user_adv[0].matched_ads_at;
    pushed_at = user_adv[0].pushed_at;
    lang = user_adv[0].lang;
    noti_log = JSON.parse(user_adv[0].pushed) || {};
    if (!time.isSame(today, time.convertDate(user_adv[0].pushed_at))) user_adv[0].daily_pushed_total = 0;
  }

  // calculate matched ads
  if (user_adv.length && time.isSame(today, time.convertDate(user_adv[0].matched_ads_at))) {
    // reuse calculated result
    matched = JSON.parse(user_adv[0].matched_ads);
  } else {
    // calculate
    let profile = await query(`SELECT * FROM ${db_user_profile} WHERE user_id = ?`, user_id);
    const allAds = await query(`SELECT * FROM ${db_ads} `);
    profile = (profile.length) ? flattenUserProfile(JSON.parse(profile[0].profile)) : null;
    allAds.forEach(el => {
      if (
        !el.condition || (
          profile &&
            (el.condition_mode === "and") ?
            JSON.parse(el.condition).every(c => Helper.operators[c.operator](profile[c.category], c.value)) :
            JSON.parse(el.condition).some(c => Helper.operators[c.operator](profile[c.category], c.value))
        )
      ) {
        matched.push(el.id);
      }
    });
    matched_ads_at = now;
  }

  // get ads with matched location and time (from condition matched list)
  const adStack = await query(
    `SELECT * FROM ${db_ads} WHERE enabled = 1 
      AND (start_time IS NULL || start_time <= ?) AND (end_time IS NULL || end_time >= ?)
      AND ST_Distance_Sphere(point(lon,lat),point(?,?)) < range
      AND id IN (?)`,
    [
      timestamp,
      timestamp,
      lon,
      lat,
      matched
    ]);

  let pushedCount = 0;
  if (adStack.length) {
    // filter ads by push history + ads repeatable & frequency
    const readyToPush = adStack.find(el => !noti_log[el.id] || (el.repeatable && time.isSameOrAfter(today, time.convertDate(time.addDays(noti_log[el.id]), el.frequency))));
    if (readyToPush) {
      const payload = {
        message: {
          notification: {
            title: readyToPush['title_' + (lang || 'tc')],
            body: readyToPush['content_' + (lang || 'tc')]
          }
        },
        data: {
          souce: readyToPush['source'],
          source_id: readyToPush['source_id'],
          url: readyToPush['url'],
          advertisement_id: readyToPush['id']
        }
      };
      // push payload to user_id ...to be completed
      noti_log[readyToPush.id] = now;
      pushed_at = now;
      pushedCount += 1;
    }
  }

  const updateStmt = Helper.genInsert(db_user_adv, [
    'user_id', 'lang', 'matched_ads', 'matched_ads_at', 'pushed', 'pushed_at', 'daily_pushed_total'
  ], [
    'lang', 'matched_ads', 'matched_ads_at', 'pushed', 'pushed_at', 'daily_pushed_total'
  ]);

  return await query(updateStmt, [
    user_id,
    lang,
    JSON.stringify(matched),
    matched_ads_at,
    JSON.stringify(noti_log),
    pushed_at,
    (user_adv.length) ? user_adv[0].daily_pushed_total + pushedCount : pushedCount,
  ]);
};

const flattenUserProfile = (profile) => {
  let out = {};
  for (const k in profile) {
    out = { ...out, ...profile[k] };
  }
  return out;
};

module.exports = Ads;
