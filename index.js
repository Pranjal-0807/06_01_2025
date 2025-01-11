require("dotenv").config();
const express = require("express");
const tasksRouter = require("./routes/tasks.js");
const projectsRouter = require("./routes/projects.js");
const { USERS, ROLES } = require("./db.js");
const { authToken, authRole } = require("./middleware/auth.js");

const app = express();
const PORT = 5050;

// Middleware to parse JSON
app.use(express.json());
app.use(authToken);

app.use("/tasks", authRole(ROLES.USER), tasksRouter);
app.use("/projects", authRole(ROLES.ADMIN, ROLES.MANAGER), projectsRouter);

app.get("/users", authRole(ROLES.ADMIN), (req, res) => {
  console.log("User:", req.user);
  return res.json(USERS);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
