const mongoose = require("mongoose");

const ContestSchema = new mongoose.Schema({
  name: {
    type: String, // Unique name for the contest
    required: true,
  },
  description: {
    type: String, // Description associated with the contest
  },
  img: {
    type: String, // Optional background image for the contest
  },
  owner: {
    type: mongoose.Types.ObjectId, // Refers to the owner of the contest
    ref: "users",
    required: true,
  },
  managers: {
    type: [mongoose.Types.ObjectId], // Refers to the list of managers of the contest
    ref: "users",
    defualt: [],
  },
  completed: {
    type: Boolean, // Is contest completed or running?
    default: false,
  },
  createdAt: {
    type: Date, // Timestamp at which contest was created
    default: Date.now,
  },
});

module.exports = mongoose.model("contests", ContestSchema);
