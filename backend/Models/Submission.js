const mongoose = require("mongoose");

const SubmissionSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId, // Refers to the user who made submission
    ref: "users",
    required: true,
  },
  challenge: {
    type: mongoose.Types.ObjectId, // Refers to the challenge for which submission is made
    ref: "challenges",
    required: true,
  },
  submittedFlag: {
    type: String, // Value of submitted flag by the user
    required: true,
  },
  isCorrect: {
    type: Boolean, // Was this submission correct or not?
    default: false,
  },
  submittedOn: {
    type: Date, // Timestamp of the submission
    default: Date.now,
  },
});

module.exports = mongoose.model("submissions", SubmissionSchema);
