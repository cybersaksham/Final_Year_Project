const { addDocument } = require("./es");

module.exports.addNewUser = async (totalUsers, timestamp = new Date()) => {
  addDocument({
    type: "total_users_registered",
    count: totalUsers,
    timestamp,
  });
  addDocument({
    type: "signup",
    timestamp,
  });
};

module.exports.addUserLogin = async (
  isLoginSuccessful,
  timestamp = new Date()
) => {
  await addDocument({
    type: "user_login",
    isLoginSuccessful,
    timestamp,
  });
};

module.exports.changeTotalContests = async (
  totalContests,
  timestamp = new Date()
) => {
  await addDocument(
    {
      type: "total_contests",
      count: totalContests,
      timestamp,
    },
    "total_contest_id"
  );
};
module.exports.changeOngoingContests = async (
  ongoingContests,
  timestamp = new Date()
) => {
  await addDocument(
    {
      type: "ongoing_contests",
      count: ongoingContests,
      timestamp,
    },
    "ongoing_contest_id"
  );
};
module.exports.changeCompletedContests = async (
  completedContests,
  timestamp = new Date()
) => {
  await addDocument(
    {
      type: "completed_contests",
      count: completedContests,
      timestamp,
    },
    "completed_contest_id"
  );
};

module.exports.changeContestDetails = async (
  name,
  flags,
  participants,
  contestId,
  timestamp = new Date()
) => {
  await addDocument(
    {
      type: "contest_details",
      contest: {
        name,
        flags,
        participants,
      },
      timestamp,
    },
    `contest_details_${contestId}`
  );
};

module.exports.addSytstemError = async (
  level,
  message,
  timestamp = new Date()
) => {
  await addDocument({
    type: "system_errors",
    log: `lvl=${level} ${message}`,
    timestamp,
  });
};
module.exports.addSecurityIncidents = async (
  level,
  message,
  timestamp = new Date()
) => {
  await addDocument({
    type: "security_incidents",
    log: `lvl=${level} ${message}`,
    timestamp,
  });
};

module.exports.changeParticipantsCount = async (
  contestName,
  participantCount,
  timestamp = new Date()
) => {
  await addDocument({
    type: "total_participants_registered",
    count: participantCount,
    contest: { name: contestName },
    timestamp,
  });
};

module.exports.addChallenge = async (
  contestName,
  challengeName,
  difficulty,
  category,
  timestamp = new Date()
) => {
  await addDocument({
    type: "challenge_details",
    contest: { name: contestName },
    challenge: { name: challengeName, difficulty, category },
    timestamp,
  });
};

module.exports.setLeaderBoard = async (
  contestName,
  contestId,
  userInfo, // {id, name, flags, points}
  timestamp = new Date()
) => {
  await addDocument(
    {
      type: "contest_leaderboard",
      contest: { name: contestName },
      user: userInfo,
      timestamp,
    },
    `leaderboard_${contestId}_${userInfo.id}`
  );
};
