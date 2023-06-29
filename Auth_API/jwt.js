const jwt = require("jsonwebtoken");

const jwtTokens = (id) => {
  const user = { id };
  const token = jwt.sign(user, "secrete123", {
    expiresIn: "30d",
  });
  const refreshToken = jwt.sign(user, "secrete123");

  return { token, refreshToken };
};

module.exports = jwtTokens;
