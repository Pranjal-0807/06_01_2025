require("dotenv").config();
const express = require("express");
const tasksRouter = require("./routes/tasks.js");
const projectsRouter = require("./routes/projects.js");
const { USERS, ROLES } = require("./db.js");
const { authToken, authRole } = require("./middleware/auth.js");
const { paginate } = require("./middleware/pagination.js");

const app = express();
const PORT = 5050;

app.use(express.json());
app.use(authToken);

app.use("/tasks", authRole(ROLES.USER), tasksRouter);
app.use("/projects", authRole(ROLES.ADMIN, ROLES.MANAGER), projectsRouter);

app.get("/users", authRole(ROLES.ADMIN), filterUsers, paginate, (req, res) => {
  console.log(res.paginatedResults);
  return res.json(res.paginatedResults);
});

function filterUsers(req, res, next) {
  req.paginationResource = USERS;
  next();
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
