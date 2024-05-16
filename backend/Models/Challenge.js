const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema({
  title: {
    type: String, // Unique name for the challenge
    required: true,
    unique: true,
  },
  description: {
    type: String, // Dsescription associated with the challenge
    required: true,
  },
  points: {
    type: Number, // Points that can be earned after solving the challenge
    required: true,
  },
  difficulty: {
    type: String, // Difficulty level of the challenge
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  category: {
    type: String, // Might be web, crypto, app, etc.
    required: true,
  },
  flag: {
    type: String, // Correct flag for the challenge
    required: true,
  },
  contest: {
    type: mongoose.Types.ObjectId, // Refers to contest in which challenge is created
    ref: "contests",
    required: true,
  },
  files: {
    type: String, // URL of zip file that can help in solving challenge
  },
  createdBy: {
    type: mongoose.Types.ObjectId, // Refers to the creator of the challenge
    ref: "users",
    required: true,
  },
  createdAt: {
    type: Date, // Timestamp when the challenge was created
    default: Date.now,
  },
  updatedAt: {
    type: Date, // Timestamp when the challenge was last updated
    default: Date.now,
  },
});

// Pre save hook to change data for last updated time of the challenge
ChallengeSchema.pre("save", async function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("challenges", ChallengeSchema);
