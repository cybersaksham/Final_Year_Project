const mongoose = require("mongoose");

const ParticipationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId, // Refers to the user participating in contest
    ref: "users",
    required: true,
  },
  contest: {
    type: mongoose.Types.ObjectId, // Refers to the contest in which user has participated
    ref: "contests",
    required: true,
  },
  participatedOn: {
    type: Date, // Timestamp on which user participated
    default: Date.now,
  },
});

module.exports = mongoose.model("participations", ParticipationSchema);
