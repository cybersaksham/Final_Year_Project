const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const User = require("../Models/User");

const fetchAdmin = async (req, res, next) => {
  // Getting token
  const token = req.header("auth-token");

  // Verifying Token
  if (!token) return res.status(401).send("Authentication failed");

  try {
    const data = jwt.verify(token, JWT_SECRET);
    let user = await User.findById(data.user.id);
    if (user && user.role && user.role == "admin") {
      req.user = user;
      next();
    } else {
      return res.status(401).send("Authentication failed");
    }
  } catch (error) {
    return res.status(401).send("Authentication failed");
  }
};

module.exports = fetchAdmin;
