const { clearData } = require("./es");
const {
  addNewUser,
  addUserLogin,
  changeTotalContests,
  changeOngoingContests,
  changeCompletedContests,
  changeContestDetails,
  addSytstemError,
  addSecurityIncidents,
  changeParticipantsCount,
  addChallenge,
  setLeaderBoard,
} = require("./es-functions");

const getStartTime = () => {
  let timestamp = new Date();
  timestamp.setMinutes(timestamp.getMinutes() - 15);
  return timestamp;
};

const chooseRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const chooseRandomElement = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const getMsgConfirmation = () => {
  let arr = [true, false, false];
  let res = chooseRandomElement(arr);
  return res;
};

module.exports.dummyAddNewUser = async () => {
  let startTime = getStartTime();
  let users = 0;
  let arr = [0, 1, 2, 3, 4];
  for (let i = 0; i < 900; i++) {
    startTime.setSeconds(startTime.getSeconds() + 1);
    if (getMsgConfirmation()) continue;
    addNewUser(users, startTime);
    users += chooseRandomElement(arr);
  }
};

module.exports.dummyAddUserLogin = async () => {
  let startTime = getStartTime();
  let arr = [true, false];
  for (let i = 0; i < 900; i++) {
    startTime.setSeconds(startTime.getSeconds() + 1);
    if (getMsgConfirmation()) continue;
    let res = chooseRandomElement(arr);
    addUserLogin(res, startTime);
  }
};

module.exports.dummyChangeContests = async () => {
  let startTime = getStartTime();
  startTime.setMinutes(startTime.getMinutes() + 10);
  changeTotalContests(100, startTime);
  changeOngoingContests(64, startTime);
  changeCompletedContests(36, startTime);
  for (let i = 0; i < 100; i++) {
    changeContestDetails(
      `Contest ${i + 1}`,
      chooseRandomNumber(20, 80),
      chooseRandomNumber(50, 500),
      `Contest ${i + 1}`,
      startTime
    );
  }
};

module.exports.dummySystemMsgs = async () => {
  let startTime = getStartTime();
  let arr = ["error", "warning", "info"];
  for (let i = 0; i < 900; i++) {
    startTime.setSeconds(startTime.getSeconds() + 1);
    if (getMsgConfirmation()) continue;
    let res = chooseRandomElement(arr);
    addSytstemError(res, "This is system generated message", startTime);
    res = chooseRandomElement(arr);
    addSecurityIncidents(res, "This is system generated message", startTime);
  }
};

module.exports.dummyParticipantsCount = async () => {
  let startTime = getStartTime();
  let count = 0;
  for (let j = 0; j < 900; j++) {
    startTime.setSeconds(startTime.getSeconds() + 1);
    if (getMsgConfirmation()) continue;
    count += chooseRandomElement([0, 1, 2, 3, 4]);
    changeParticipantsCount(`Contest 1`, count, startTime);
  }
};

module.exports.dummyAddChallenge = async () => {
  let startTime = getStartTime();
  for (let i = 0; i < 900; i++) {
    startTime.setSeconds(startTime.getSeconds() + 1);
    if (getMsgConfirmation()) continue;
    addChallenge(
      `Contest 1`,
      `Challenge ${i + 1}`,
      chooseRandomElement(["easy", "medium", "hard"]),
      chooseRandomElement(["web", "crypto", "app", "security", "math"]),
      startTime
    );
  }
};

module.exports.dummySetLeaderBoard = async () => {
  let flags = 80;
  let points = [];
  for (let i = 0; i < flags; i++) {
    points.push(50 * chooseRandomElement([1, 2, 3]));
  }

  let users = 100;
  let userdata = [];
  for (let i = 0; i < users; i++) {
    let mark = 0;
    let total = 0;
    for (let j = 0; j < flags; j++) {
      let solved = chooseRandomElement([0, 1]);
      total += solved;
      mark += solved * points[j];
    }
    userdata.push({ name: `User ${i + 1}`, pts: mark, flags: total });
  }
  userdata.sort((a, b) => a.pts - b.pts).reverse();

  let startTime = getStartTime();
  startTime.setMinutes(startTime.getMinutes() + 5);

  for (let i = 0; i < users; i++) {
    setLeaderBoard(
      `Contest 1`,
      `Contest 1`,
      {
        id: userdata[i].name,
        name: userdata[i].name,
        flags: userdata[i].flags,
        points: userdata[i].pts,
        rank: i + 1,
      },
      startTime
    );
    startTime.setSeconds(startTime.getSeconds() + 1);
  }
};

module.exports.dummyData = async () => {
  await clearData();
  this.dummyAddNewUser();
  this.dummyAddUserLogin();
  this.dummyChangeContests();
  this.dummySystemMsgs();
  this.dummyParticipantsCount();
  this.dummyAddChallenge();
  this.dummySetLeaderBoard();
};
