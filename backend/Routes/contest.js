// Required Modules
const router = require("express").Router();
const multer = require("multer");
const path = require("path");

// Database Models
const Contest = require("../Models/Contest");
const Challenge = require("../Models/Challenge");
const User = require("../Models/User");
const Participation = require("../Models/Participation");

// Middlewares
const fetchUser = require("../Middleware/fetch-user");

// Functions for Elastic search
const {
  changeTotalContests,
  changeContestDetails,
  changeOngoingContests,
  changeParticipantsCount,
  changeCompletedContests,
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

// Get All Contests
router.get("/", fetchUser, async (req, res) => {
  try {
    // Fetching user id provided by authentication middleware
    let user = req.user._id;

    // Fetch details of all the contest from the database
    let contests = await Contest.find()
      .populate("owner")
      .populate("managers")
      .lean();

    // Fetching the partipations details from database
    let participations = await Participation.find({ user });

    // Checking for each contest if logged in user is owner, manager or partipated in the contest
    for (let i = 0; i < contests.length; i++) {
      let el = contests[i];

      // Initializing variables
      el["isOwner"] = false;
      el["isManager"] = false;
      el["isRegistered"] = false;

      // Check owners
      if (String(el.owner._id) === String(user)) el["isOwner"] = true;

      // Check managers
      if (!el["isOwner"]) {
        for (let i = 0; i < el.managers.length; i++) {
          if (String(el.managers[i]._id) === String(user)) {
            el["isManager"] = true;
            break;
          }
        }
      }

      // Check if user is registered in the contest
      for (let i = 0; i < participations.length; i++) {
        if (String(participations[i].contest) === String(el._id)) {
          el["isRegistered"] = true;
          break;
        }
      }

      // Updating details in the contests array
      contests[i] = el;
    }

    // Returning modified details for the contest
    return res.json(contests);
  } catch (error) {
    // Logging the errors if present any
    addSytstemError("warning", "Error in API at GET /contest route");
    return res.status(500).json({ error });
  }
});

// Get By ID
router.get("/:id", async (req, res) => {
  try {
    // Destructuring the req.params to get contest id
    const { id } = req.params;

    // Logging errros if contest id is not given
    if (!id) {
      addSytstemError(
        "warning",
        "User did not passed required arguments in API at GET /contest/id route"
      );
      return res.status(400).json({ error: "Missing parameters" });
    }

    // Fetching contest details by provided id
    let contest = await Contest.findById(id)
      .populate("owner")
      .populate("managers")
      .lean();

    if (contest) {
      // Fetching challenge details present in the contest
      let challenges = await Challenge.find({ contest: contest._id }).select(
        "-flag"
      );
      // Adding challenge details to the contest object
      contest["challenges"] = challenges;
      return res.json(contest);
    } else {
      // Logging error in elastic search if contest not found
      addSytstemError(
        "warning",
        "User passed incorrect arguments in API at GET /contest/id route"
      );
      return res.status(404).json({ error: "Contest not found" });
    }
  } catch (error) {
    // Logging error if there are present any
    addSytstemError("warning", "Error in API at GET /contest/id route");
    return res.status(500).json({ error });
  }
});

// Get By Owner
router.get("/getByOwner", fetchUser, async (req, res) => {
  try {
    // Fetching owner id provided by authentication middleware
    let owner = req.user.id;

    // Fetching contest details of the contests owned by given user
    let contests = await Contest.find({ owner })
      .populate("owner")
      .populate("managers");

    // Returning the required contests list
    return res.json(contests);
  } catch (error) {
    // Logging error if there is present any
    addSytstemError("warning", "Error in API at GET /contest/getByOwner route");
    return res.status(500).json({ error });
  }
});

// Get By Manager
router.get("/getByManager", fetchUser, async (req, res) => {
  try {
    // Fetching manager id provided by authentication middleware
    let managers = req.user._id;

    // Fetching contest details if the given user exists as a manager in the contest
    let contests = await Contest.find({ managers })
      .populate("owner")
      .populate("managers");

    // Return required contests list
    return res.json(contests);
  } catch (error) {
    // Logging error if there is present any
    addSytstemError(
      "warning",
      "Error in API at GET /contest/getByManager route"
    );
    return res.status(500).json({ error });
  }
});

// Host Contest
router.post("/", fetchUser, upload.single("img"), async (req, res) => {
  try {
    // Getting owner id provided by authentication middleware
    const owner = req.user.id;

    // Getting background image for the contest if provided by the user
    let img;
    if (req.file) {
      img = path.join(__dirname, "../uploads", req.file.filename);
    }

    // Destructuring req.body to get the fields of name and description
    let { name, description } = req.body;

    // Logging errors if required arguments are not present
    if (!name) {
      addSytstemError(
        "warning",
        "User did not passed required arguments in API at POST /contest route"
      );
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // Create the new contest
    let contest = await Contest.create({
      name,
      description,
      img,
      owner,
      managers: [owner],
    });

    // Adding following metrics to elastic search
    // 1: Count of the completed contests
    // 2: Count of the ongoing contests
    // 3: Count of the running contests
    // 4: Details of the contest (0 challlenges, 0 participants)
    // 5: Participant count for a contest (0 initially)
    let cnt_ongoing = await Contest.countDocuments({ completed: false });
    let cnt_completed = await Contest.countDocuments({ completed: true });
    await changeTotalContests(cnt_ongoing + cnt_completed);
    await changeOngoingContests(cnt_ongoing);
    await changeCompletedContests(cnt_completed);
    await changeContestDetails(name, 0, 0, contest.id);
    await changeParticipantsCount(name, 0);

    // Fetching contest created from the database
    contest = await Contest.findById(contest.id)
      .populate("owner")
      .populate("managers");

    // Returning contest details to the frontend
    return res.json(contest);
  } catch (error) {
    // Logging error if there is present any
    addSytstemError("warning", "Error in API at POST /contest route");
    return res.status(500).json({ error });
  }
});

// Add Manager
router.post("/addManager", fetchUser, async (req, res) => {
  try {
    // Fetching owner details provided by authentication middleware
    const owner = req.user;
    const { contestId, manager } = req.body;

    // Logging error in elastic search if required arguments are missing
    if (!contestId || !manager) {
      addSytstemError(
        "warning",
        "User did not passed required arguments in API at POST /contest/addManager route"
      );
      return res.status(400).json({ error: "Missing parameters" });
    }

    // Check for contest if it exists by contest id
    let contest = await Contest.findById(contestId);

    // Logging the error if contest not found
    if (!contest) {
      addSytstemError(
        "warning",
        "User did not passed correct arguments in API at POST /contest/addManager route"
      );
      return res.status(404).json({ error: "Contest not found" });
    }

    // Check if the logged in user is owner of the contest
    // And if user is not the owner then logging the error in elastic search
    if (!contest.owner.equals(owner._id)) {
      addSytstemError(
        "warning",
        "User is not the owner of contest while accessing the API at POST /contest/addManager route"
      );
      return res.status(401).json({ error: "Authentication failed" });
    }

    // Find the details of the manager provided by contest owner
    let manager_user = await User.findOne({ email: manager });

    // Logging error if manager does not exists in database
    if (!manager_user) {
      addSytstemError(
        "warning",
        "Provided manager does not exists in API at POST /contest/addManager route"
      );
      return res.status(400).json({ error: "Manager not found" });
    }

    // Check for manager already added in the contest
    let managers = Array.from(contest.managers);
    present = false;
    // Running loop on the manager array to match with given manager id
    for (let i = 0; i < managers.length; i++) {
      if (managers[i].equals(manager_user.id)) {
        present = true;
        break;
      }
    }

    // Logging error if manager is already present in the contest
    if (present) {
      addSytstemError(
        "warning",
        "Provided manager is already managing the contrest in API at POST /contest/addManager route"
      );
      return res.status(400).json({ error: "Manager already added" });
    }

    // Adding manager in the contest and updating the database
    contest.managers.push(manager_user.id);
    await contest.save();

    // Return the message to frontend
    return res.json({ msg: "Manager added successfully" });
  } catch (error) {
    // Logging the error if there is present any
    addSytstemError(
      "warning",
      "Error in API at POST /contest/addManager route"
    );
    return res.status(500).json({ error });
  }
});

// Remove Manager
router.post("/removeManager", fetchUser, async (req, res) => {
  try {
    // Getting owner details provided by authentication middleware
    const owner = req.user;

    // Destructuring req.body to get the arguments contest id and manager id
    const { contestId, manager } = req.body;

    // Logging error is elastic search if required arguments are not passed
    if (!contestId || !manager) {
      addSytstemError(
        "warning",
        "User did not passed required arguments in API at POST /contest/removeManager route"
      );
      return res.status(400).json({ error: "Missing parameters" });
    }

    // Fetch the details of contest by contest id
    let contest = await Contest.findById(contestId);

    // Logging error in elastic search if contest is not found
    if (!contest) {
      addSytstemError(
        "warning",
        "User did not passed correct arguments in API at POST /contest/removeManager route"
      );
      return res.status(404).json({ error: "Contest not found" });
    }

    // Check if the logged in user is owner of the contest
    // And if user is not owner the log the error in elastic search
    if (!contest.owner.equals(owner._id)) {
      addSytstemError(
        "warning",
        "User is not the owner of the contest while accessing the API at POST /contest/removeManager route"
      );
      return res.status(401).json({ error: "Authentication failed" });
    }

    // Fetching the manager details from the database
    let manager_user = await User.findOne({ email: manager });

    // Logging the error if manager does not exist in database
    if (!manager_user) {
      addSytstemError(
        "warning",
        "Manager does not exists in API at POST /contest/removeManager route"
      );
      return res.status(400).json({ error: "Manager not found" });
    }

    // Logging error if the manager provided to remove is owner of the contest
    if (contest.owner.equals(manager_user.id)) {
      addSytstemError(
        "warning",
        "Someone tried to remove the owner of the contest itself in API at POST /contest/removeManager route"
      );
      return res.status(400).json({ error: "Cannot remove owner" });
    }

    // Check if the manager exists or not in the contest
    let managers = Array.from(contest.managers);
    present = false;
    // Running loop on the managers array to match with manager id provided
    for (let i = 0; i < managers.length; i++) {
      if (managers[i].equals(manager_user.id)) {
        present = true;
        break;
      }
    }

    // Logging the error if manager is not present in contest
    if (!present) {
      addSytstemError(
        "warning",
        "Provided manager is not managing the contest in API at POST /contest/removeManager route"
      );
      return res.status(400).json({ error: "Manager is not added in contest" });
    }

    // Removing manager from the contest and updating the database
    contest.managers.pull(manager_user.id);
    await contest.save();

    // Returning message to fronted
    return res.json({ msg: "Manager removed successfully" });
  } catch (error) {
    // Logging the error if there is present any
    addSytstemError(
      "warning",
      "Error in API at POST /contest/removeManager route"
    );
    return res.status(500).json({ error });
  }
});

// Participate in Contest
router.post("/participate", fetchUser, async (req, res) => {
  try {
    // Getting user details provided by authentication middleware
    const user = req.user;

    // Destructuring req.body to get the arguments like contest id
    const { contestId } = req.body;

    // Logging the error in elastic search if required arguments are missing
    if (!contestId) {
      addSytstemError(
        "warning",
        "User did not passed required arguments in API at POST /contest/participate route"
      );
      return res.status(400).json({ error: "Missing parameters" });
    }

    // Fetching the contest details from the database
    let contest = await Contest.findById(contestId);

    // Logging the error if contest not found
    if (!contest) {
      addSytstemError(
        "warning",
        "User did not passed correct arguments in API at POST /contest/participate route"
      );
      return res.status(404).json({ error: "Contest not found" });
    }

    // Logging the error if logged in user is owner of the contest
    if (contest.owner.equals(user._id)) {
      addSytstemError(
        "warning",
        "Owner tried to participate in his own contest in API at POST /contest/participate route"
      );
      return res
        .status(401)
        .json({ error: "Owner cannot participate in contest." });
    }

    // Logging the error if logged in user is manager of the contest
    let managers = Array.from(contest.managers);
    present = false;
    for (let i = 0; i < managers.length; i++) {
      if (managers[i].equals(user._id)) {
        present = true;
        break;
      }
    }
    if (present) {
      addSytstemError(
        "warning",
        "Manager tried to participate in the contest managed by him in API at POST /contest/participate route"
      );
      return res
        .status(400)
        .json({ error: "Manager cannot participate in contest" });
    }

    // Participating in the contest and updating the database
    await Participation.create({ contest: contestId, user: user._id });

    // Adding following metrics to elastic search
    // 1. Change contest details (participant count)
    // 2. Change participation count of the contest
    let flags = await Challenge.countDocuments({ contest: contestId });
    let participations = await Participation.countDocuments({
      contest: contestId,
    });
    await changeContestDetails(contest.name, flags, participations, contestId);
    await changeParticipantsCount(contest.name, participations);

    // Returning message to the frontend
    return res.json({ msg: "Successfully participated in contest" });
  } catch (error) {
    // Logging the error if there is present any
    addSytstemError(
      "warning",
      "Error in API at POST /contest/participate route"
    );
    return res.status(500).json({ error });
  }
});

// Get participations
router.get("/participations/:contestId", async (req, res) => {
  try {
    // Destructuring req.params to get arguments of contest id
    const { contestId } = req.params;

    // Logging error in elastic search if required arguments are not passed
    if (!contestId) {
      addSytstemError(
        "warning",
        "User did not passed required arguments in API at POST /contest/participations route"
      );
      return res.status(400).json({ error: "Missing parameters" });
    }

    // Fetching the details for contest from the database
    let contest = await Contest.findById(contestId);

    // Logging the error if contest not found
    if (!contest) {
      addSytstemError(
        "warning",
        "User did not passed correct arguments in API at POST /contest/participations route"
      );
      return res.status(404).json({ error: "Contest not found" });
    }

    // Fetching the data of participations for the contest
    let participations = await Participation.find({ contest: contestId });

    // Returning list to frontend
    return res.json(participations);
  } catch (error) {
    // Logging the error if there is present any
    addSytstemError(
      "warning",
      "Error in API at POST /contest/participations route"
    );
    return res.status(500).json({ error });
  }
});

// Mark as completed
router.post("/complete", fetchUser, async (req, res) => {
  try {
    // Getting user details from authentication middleware
    const user = req.user;

    // Destructuring req.body to get arguments of contest id
    const { contestId } = req.body;

    // Logging error in elastic search if required parameters are missing
    if (!contestId) {
      addSytstemError(
        "warning",
        "User did not passed required arguments in API at POST /contest/complete route"
      );
      return res.status(400).json({ error: "Missing parameters" });
    }

    // Fetching details of the contest from database
    let contest = await Contest.findById(contestId);

    // Logging error in elastic search if contest not found
    if (!contest) {
      addSytstemError(
        "warning",
        "User did not passed correct arguments in API at POST /contest/complete route"
      );
      return res.status(404).json({ error: "Contest not found" });
    }

    // Check if the logged in user is the owner of contest
    let isOwner = contest.owner.equals(user._id);

    // Check if the logged in user is the manager of contest
    let managers = Array.from(contest.managers);
    present = false;
    for (let i = 0; i < managers.length; i++) {
      if (managers[i].equals(user._id)) {
        present = true;
        break;
      }
    }

    // Logging error if logged in user is neither the owner nor the manager of the contest
    if (!isOwner && !present) {
      addSytstemError(
        "warning",
        "User is not managing the contest while accessing the API at POST /contest/complete route"
      );
      return res.status(400).json({ error: "Authentication failed" });
    }

    // Mark contest as completed and updating the database
    contest.completed = true;
    await contest.save();

    // Add following metrics to the elastic serch
    // 1. Count of ongoing contest
    // 1. Count of completed contest
    let cnt_ongoing = await Contest.countDocuments({ completed: false });
    let cnt_completed = await Contest.countDocuments({ completed: true });
    await changeOngoingContests(cnt_ongoing);
    await changeCompletedContests(cnt_completed);

    // Return message to the frontend
    return res.json({ msg: "Contest closed successfully" });
  } catch (error) {
    // Logging errors if there is present any
    addSytstemError("warning", "Error in API at POST /contest/complete route");
    return res.status(500).json({ error });
  }
});

module.exports = router;
