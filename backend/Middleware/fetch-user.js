// Required Modules
const jwt = require("jsonwebtoken");

// Database Models
const User = require("../Models/User");

// JWT Secret Token
const JWT_SECRET = process.env.JWT_SECRET;

const fetchUser = async (req, res, next) => {
  // Getting authentication token from headers
  const token = req.header("auth-token");

  // Verifying Token if it is present
  if (!token) return res.status(401).json({ error: "Authentication failed" });

  try {
    // Cracking the token using jst package
    const data = jwt.verify(token, JWT_SECRET);

    // Fetching user details by cracked data
    let user = await User.findById(data.user.id);

    // Forwarding the request if user is found else throwing error
    if (user) {
      req.user = user;
      next();
    } else {
      return res.status(401).json({ error: "Authentication failed" });
    }
  } catch (error) {
    return res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = fetchUser;
