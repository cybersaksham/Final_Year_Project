// Required Modules
const router = require("express").Router();
const multer = require("multer");
const path = require("path");

// Database Models
const Challenge = require("../Models/Challenge");
const Contest = require("../Models/Contest");
const Submission = require("../Models/Submission");
const Participation = require("../Models/Participation");

// Middlewares
const fetchUser = require("../Middleware/fetch-user");

// Functions for elastic search
const {
  addChallenge,
  changeContestDetails,
  setLeaderBoard,
  addSytstemError,
} = require("../lib/es-functions");

// Configuring storage details for a file on the server
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "_"));
  },
});

// Creating function to upload the file on server
const upload = multer({ storage });

// Get All Challenges
router.get("/", async (req, res) => {
  try {
    // Fetching detailed list of all the challenges in database
    let challenges = await Challenge.find().select("-flag");
    return res.json(challenges);
  } catch (error) {
    // Logging error if there is present any
    addSytstemError("warning", "Error in API at GET /challenge route");
    return res.status(500).json({ error });
  }
});

// Get By ID
router.get("/:id", async (req, res) => {
  try {
    // Destructuring req.params to get arguments of challenge id
    const { id } = req.params;

    // Logging error if the required parameters are missing
    if (!id) {
      addSytstemError(
        "warning",
        "User did not passed required arguments in API at GET /challenge/id route"
      );
      return res.status(400).json({ error: "Missing parameters" });
    }

    // Fetching challenge details from the database
    let challlenge = await Challenge.findById(id).select("-flag");

    // Logging error if challenge not found else returning to frontend
    if (challlenge) return res.json(challlenge);
    else {
      addSytstemError(
        "warning",
        "User did not passed correct arguments in API at GET /challenge/id route"
      );
      return res.status(404).json({ error: "Challenge not found" });
    }
  } catch (error) {
    // Logging the error if there is present any
    addSytstemError("warning", "Error in API at GET /challenge/id route");
    return res.status(500).json({ error });
  }
});

// Create Challenge
router.post("/", fetchUser, upload.single("files"), async (req, res) => {
  try {
    // Getting user details provided by authentication middleware
    const createdBy = req.user.id;

    // Getting zip files if user provided any
    let files;
    if (req.file) {
      files = path.join(__dirname, "../uploads", req.file.filename);
    }

    // Destructuring req.body to get the required parameters to create a challenge
    let { title, description, points, difficulty, category, flag, contestId } =
      req.body;

    // Logging the error in elastic search if any required parameter is missing
    if (
      !title ||
      !description ||
      !points ||
      !difficulty ||
      !category ||
      !flag ||
      !contestId
    ) {
      addSytstemError(
        "warning",
        "User did not passed required arguments in API at POST /challenge route"
      );
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Formatting the data
    difficulty = difficulty.toLowerCase();

    // Validate difficulty else logging the error
    if (!["easy", "medium", "hard"].includes(difficulty)) {
      addSytstemError(
        "warning",
        "User did not passed correct difficulty in API at POST /challenge route"
      );
      return res.status(400).json({ error: "Invalid difficulty" });
    }

    // Fetching contest details by provided id and login user details
    let contest = await Contest.findOne({
      _id: contestId,
      managers: createdBy,
    });

    // Logging error if contest not found
    if (!contest) {
      addSytstemError(
        "warning",
        "User did not passed correct contest in API at POST /challenge route"
      );
      return res.status(400).json({ error: "Contest not found" });
    }

    // Creating the new challenge
    let challenge = await Challenge.create({
      title,
      description,
      points,
      difficulty,
      category,
      flag,
      contest: contestId,
      files,
      createdBy,
    });

    // Adding following metrics to elastic search
    // 1. Add challenge details
    // 2. Change contest details (number of flags in it)
    let flags = await Challenge.countDocuments({ contest: contestId });
    let partipants = await Participation.countDocuments({ contest: contestId });
    await addChallenge(contest.name, title, difficulty, category);
    await changeContestDetails(contest.name, flags, partipants, contestId);

    // Return challenge json to the frontend
    return res.json(challenge);
  } catch (error) {
    // Logging the error if there is present any
    addSytstemError("warning", "Error in API at POST /challenge route");
    return res.status(500).json({ error });
  }
});

// Submmit Flag
router.post("/submit", fetchUser, async (req, res) => {
  try {
    // Getting user details provided by authentication middleware
    const user = req.user;

    // Destructuring req.body to get parameters of submitted flag and challenge id
    const { flag, challengeId } = req.body;

    // Logging error if required arguments are missing
    if (!flag) {
      addSytstemError(
        "warning",
        "User did not passed required arguments in API at POST /challenge/submit route"
      );
      return res.status(400).json({ error: "Missing parameters" });
    }

    // Fetching the details for challenge from the database
    let challenge = await Challenge.findById(challengeId);

    // Logging the error if challenge not found
    if (!challenge) {
      addSytstemError(
        "warning",
        "User did not passed correct arguments in API at POST /challenge/submit route"
      );
      return res.status(404).json({ error: "Challenge not found" });
    }

    // Fetching the details for contest from the database
    let contest = await Contest.findById(challenge.contest);

    // Returning the API if contest not found or contest is completed
    if (!contest || contest.completed) {
      return res.status(400).json({ error: "Contest not found" });
    }

    // Fetching participation details for the user and contest
    let participation = await Participation.findOne({
      user: user.id,
      contest: contest.id,
    });

    // Returning the API if user has not participated in the contest
    if (!participation) {
      return res
        .status(401)
        .json({ error: "You have not participated in this contest" });
    }

    // Fetching the submission details for user and this challenge
    let submission = await Submission.findOne({
      user: user.id,
      challenge: challengeId,
      isCorrect: true,
    });

    // Logging error if a correct submission is already made
    if (submission) {
      addSytstemError(
        "warning",
        "User tried to submit correct flag multiple times for same challenge in API at POST /challenge/submit route"
      );
      return res.status(400).json({ error: "Already submitted" });
    }

    // Checking if the submitted flag is correct or not
    let org_flag = challenge.flag;
    let isCorrect = flag == org_flag;

    // Adding new submission details in database
    submission = await Submission.create({
      user: user.id,
      challenge: challengeId,
      submittedFlag: flag,
      isCorrect,
    });

    // Setting leaderboard in elastic search is submission is correct
    if (isCorrect) {
      // Fetching submission details for the challenge and given user
      let submissions = await Submission.find({
        user: user.id,
        isCorrect,
      }).populate("challenge");

      // Calculating overall points and total flags submitted by user
      let flags = submissions.length;
      let points = 0;
      submissions.forEach((el) => {
        points += el.challenge.points;
      });

      // Fetching contest from the database
      let contest = await Contest.findById(challenge.contest);

      // Sending leaderboard metrics to elastic search
      await setLeaderBoard(contest.name, contest.id, {
        id: user.id,
        name: user.username,
        flags,
        points,
      });
    }

    // Returning message to the frontend
    if (isCorrect) {
      return res.json({ msg: "Challenge completed" });
    } else {
      return res.status(400).json({ error: "Incorrect flag" });
    }
  } catch (error) {
    // Logging erorr if there is present any
    addSytstemError("warning", "Error in API at POST /challenge/submit route");
    return res.status(500).json({ error });
  }
});

module.exports = router;
