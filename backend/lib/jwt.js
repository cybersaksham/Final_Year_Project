const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

module.exports.generateJWT = (userid) => {
  const data = {
    user: { id: userid },
  };
  const authToken = jwt.sign(data, secret);
  return authToken;
};
