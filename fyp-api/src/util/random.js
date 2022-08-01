const RandUtil = {};
RandUtil.shuffle = function shuffle(array) {
  let currentIndex = array.length; let temporaryValue; let
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
  // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

RandUtil.generateRandomArray = async function generateRandomArray(size) {
  const randomNumber = new Array(size);
  for (let i = 0; i < size; i += 1) randomNumber[i] = i;
  return this.shuffle(randomNumber);
};

RandUtil.pad = function pad(number, length) {
  let str = `${number}`;
  while (str.length < length) {
    str = `0${str}`;
  }

  return str;
};

RandUtil.calculateAttendanceMark = function calculateAttendanceMark(data) {
  const offered = parseInt(data.offered, 10);
  const attendance = parseInt(data.attendance, 10);
  const demeritPoint = parseFloat(data.demeritPoint);
  if ((demeritPoint) >= 3) return -1;
  let attendanceRate = 0;
  let attendanceMark = 0;
  if (offered === 0) return null;
  attendanceRate = (attendance / offered).toFixed(2);
  if (attendanceRate >= 1) attendanceMark = 2;
  else if (attendanceRate >= 0.6) attendanceMark = 1;

  return attendanceMark;
};

RandUtil.randomPassword = function randomPassword() {
  return Array(10)
    .fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$')
    .map((x) => x[Math.floor(Math.random() * x.length)])
    .join('');
};

module.exports = RandUtil;
