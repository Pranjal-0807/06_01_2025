const dotenv = require("dotenv");
dotenv.config();
const PORT = 3002;
const express = require("express");
const jwt = require("jsonwebtoken");
const { USERS } = require("./db.js");

const app = express();
app.use(express.json());

const refreshTokens = new Set();

app.post("/login", async (req, res) => {
  try {
    const user = USERS.find((ele) => ele.username === req.body.username);
    if (!user) {
      return res.status(400).json({ message: "User does not exist!!!" });
    }
    const tokenData = { user: user };
    const refreshToken = jwt.sign(tokenData, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.add(refreshToken);

    const token = generateAccessToken(tokenData);

    return res.json({ token: token, refreshToken: refreshToken });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshTokens.has(refreshToken)) {
    return res.status(400).json({ message: "You need to login!!!" });
  }
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, tokenData) => {
      if (err)
        return res
          .status(400)
          .json({ message: "Forbidden!!!", error: err.message });
      const token = generateAccessToken({ user: tokenData.user });
      return res.json({ token });
    }
  );
});

app.delete("/logout", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshTokens.has(refreshToken)) {
    return res.status(400).json({ message: "Unauthorized!!!" });
  }
  refreshTokens.delete(refreshToken);
  return res.json({ message: "Logout Successful!!!" });
});

function generateAccessToken(data) {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "4h",
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
