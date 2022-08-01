const moment = require('moment-timezone');

class Time {
  static getUnixTime() {
    return Math.round(new Date().getTime() / 1000);
  }

  static getDateTime() {
    return moment().utc().tz('Asia/Hong_Kong').format('YYYY-MM-DD HH:mm:ss');
  }

  static getDate() {
    return moment().utc().tz('Asia/Hong_Kong').format('YYYY-MM-DD');
  }

  static getDateTimeAddMinutes(minutes) {
    return moment().utc().tz('Asia/Hong_Kong').add(minutes, 'minutes').format('YYYY-MM-DD HH:mm:ss');
  }

  static addMinutes(str, minutes) {
    return moment(str).add(minutes, 'minutes').format('YYYY-MM-DD HH:mm:ss');
  }

  static subtractMinutes(str, minutes) {
    return moment(str).subtract(minutes, 'minutes').format('YYYY-MM-DD HH:mm:ss');
  }

  static addDays(str, days) {
    return moment(str).add(days, 'days').format('YYYY-MM-DD HH:mm:ss');
  }

  static subtractDays(str, days) {
    return moment(str).subtract(days, 'days').format('YYYY-MM-DD HH:mm:ss');
  }

  static getDateTimeUTC() {
    return moment().utc().format('YYYY-MM-DD HH:mm:ss');
  }

  static convertHK2UTC(str) {
    return moment(str).subtract(8, 'hours');
  }

  static convertDateTime2(str) {
    return moment(str).format('YYYY-MM-DD HH:mm:ss');
  }


  static convertDateTime(str) {
    return moment(str).tz('Asia/Hong_Kong').format('YYYY-MM-DD HH:mm:ss');
  }

  static convertDate(str) {
    return moment(str).tz('Asia/Hong_Kong').format('YYYY-MM-DD');
  }

  static convertTime(str) {
    return moment(str).tz('Asia/Hong_Kong').format('HH:mm:ss');
  }

  static convert(str, format) {
    return moment(str).tz('Asia/Hong_Kong').format(format);
  }

  static isBetween(date, start, end) {
    return moment(date).isBetween(start, end, undefined, '[]');
  }

  static isSame(date, target) {
    return moment(date).isSame(target);
  }

  static isSameOrBefore(date, target) {
    return moment(date).isSameOrBefore(target);
  }

  static isSameOrAfter(date, target) {
    return moment(date).isSameOrAfter(target);
  }

  static toISOString(str) {
    return moment(str).tz('Asia/Hong_Kong').toISOString();
  }
}

module.exports = Time;