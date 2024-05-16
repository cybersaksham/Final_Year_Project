// Required Modules
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../lib/jwt");

// Database Models
const User = require("../Models/User");

// Middlewares
const fetchUser = require("../Middleware/fetch-user");

// Functions for elastic search
const {
  addNewUser,
  addUserLogin,
  addSytstemError,
} = require("../lib/es-functions");
const { dummyData } = require("../lib/dummy-functions");

// Get All Users
router.get("/", async (req, res) => {
  try {
    // Fetching all the users from database
    let users = await User.find();
    // Returning the list of users
    return res.json(users);
  } catch (error) {
    // Adding error logs to elastic search if there is any
    addSytstemError("warning", "API error in GET /user route");
    return res.status(500).json({ error });
  }
});

// Get By Username
router.get("/:username", async (req, res) => {
  try {
    // Destructuring req.params to get the required parameters (username)
    const { username } = req.params;
    if (!username) {
      // If username is not present then returning the API and loggin in elastic search.
      addSytstemError(
        "warning",
        "User did not passed requird arguments in API at GET /user/username route"
      );
      return res.status(400).json({ error: "Missing parameters" });
    }

    // Fetching user based on the given username from database
    let user = await User.findOne({ username });

    // If user is found then return the API
    if (user) return res.json(user);
    else {
      // If username is not present then returning the error and logging in elastic search
      addSytstemError(
        "warning",
        "User passed incorrect arguments in API at GET /user/username route"
      );
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    // Adding error logs to elastic search if there is any
    addSytstemError("warning", "API error in GET /user/username route");
    return res.status(500).json({ error });
  }
});

// Create User
router.post("/", async (req, res) => {
  try {
    // Destructuring req.body to get the data for username, email and password
    const { username, email, password } = req.body;

    // Logging the error if any required parameter is missing
    if (!username || !email || !password) {
      addSytstemError(
        "warning",
        "User did not passed requird arguments in API at POST /user route"
      );
      return res.status(400).json({ error: "Missing parameters" });
    }

    // Finding if there exists a user already with given email id or username
    let user = await User.findOne({ $or: [{ username }, { email }] });
    // If duplicate user found then logging the error
    if (user) {
      addSytstemError(
        "warning",
        "User tried to create a user multiple times in API at POST /user route"
      );
      return res.status(400).json({ error: "User already exists" });
    }

    // Generating Salt and Hashing Password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Creating new user in the database
    user = await User.create({ username, email, password: hash });

    // Adding a new user to elastic search metric
    let totalUsers = await User.countDocuments();
    await addNewUser(totalUsers);

    // Generating JWT token for authentication
    const token = generateJWT(user.id);

    // Returning the token to be used in frontend
    return res.json({ token, user });
  } catch (error) {
    // Logging the errors if there is any
    addSytstemError("warning", "Error occurred in API at POST /user route");
    return res.status(500).json({ error });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    // Destructuring req.body to get the field for email and password
    const { email, password } = req.body;

    // Finding if the user exists with given email id
    let user = await User.findOne({ email });
    if (!user) {
      // Logging the error if user not found
      addSytstemError(
        "warning",
        "User tried to login with incorrect credentials in API at POST /user/login route"
      );
      return res
        .status(400)
        .json({ error: "Try to login with correct credentials." });
    }

    // Comparing given password with the one stored in database
    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      // Adding error logs and failed login in elastic search if password did not match
      addSytstemError(
        "warning",
        "User tried to login with incorrect credentials in API at POST /user/login route"
      );
      await addUserLogin(false);
      return res
        .status(400)
        .json({ error: "Try to login with correct credentials." });
    }

    // Adding successful user login in elastic search metrics if password is matched
    await addUserLogin(true);

    // Generating JWT token for authentication
    const token = generateJWT(user.id);

    // Returning token to be used in frontend
    res.json({ token });
  } catch (error) {
    // Logging the errors if there is any
    addSytstemError("warning", "Error in API at POST /user/login route");
    res.status(500).send({ error });
  }
});

// Fetch user
router.post("/fetch", fetchUser, async (req, res) => {
  try {
    // Getting user id passed by the authentication middleware
    const userId = req.user.id;

    // Fetching user details by given user id
    const user = await User.findById(userId).select("-password");

    // If user exists return the details
    if (user) return res.json(user);
    else {
      // If user not found then loggin the authentication error
      addSytstemError(
        "warning",
        "Authentication failed in API at POST /user/fetch route"
      );
      return res.status(401).json({ error: "Authentication failed" });
    }
  } catch (error) {
    // Logging the errors if there are any
    addSytstemError("warning", "Error in API at POST /user/fetch route");
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

// router.post("/dummy", async (req, res) => {
//   await dummyData();
//   return res.send("success");
// });

module.exports = router;
