const {
  PROJECTS,
  TASKS,
  findTasksByProject,
  findManager,
  fillProjectDetails,
} = require("../db.js");
const { canViewProject, canEditProject } = require("../permissions.js");
const { populateProject } = require("../middleware/data.js");
const { paginate } = require("../middleware/pagination.js");
const router = require("express").Router();

router.get("/", filterProjects, paginate, (req, res) => {
  const detailedProjects = res.paginatedResults.results.map((project) => {
    const taskCount = findTasksByProject(project.id).length;
    const manager = findManager(project.managerId);
    return {
      ...project,
      taskCount,
      managerName: manager ? manager.username : null,
    };
  });
  res.paginatedResults.results = detailedProjects;
  res.json(res.paginatedResults);
});

function filterProjects(req, res, next) {
  req.paginationResource = PROJECTS.filter((project) =>
    canViewProject(req.user, project)
  );
  next();
}

router.get("/:id", populateProject, authViewProject, (req, res) => {
  res.json(fillProjectDetails(req.project));
});

function authViewProject(req, res, next) {
  if (!canViewProject(req.user, req.project)) {
    return res.status(400).json({ message: "You are not allowed!!!" });
  }
  next();
}

function authEditProject(req, res, next) {
  if (!canEditProject(req.user, req.project)) {
    return res.status(400).json({ message: "You are not allowed!!!" });
  }
  next();
}

router.post("/", (req, res) => {
  const { name, managerId } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Name and managerId are required" });
  }

  const manager = findManager(managerId);
  if (!manager) {
    return res
      .status(400)
      .json({ error: "Manager not found with id: " + managerId });
  }

  const newProject = {
    id: PROJECTS.length + 1,
    name,
    managerId,
  };
  PROJECTS.push(newProject);
  res.status(201).json(newProject);
});

router.post("/:id/task", populateProject, (req, res) => {
  const { name, userId } = req.body;
  if (!name || !userId) {
    return res.status(400).json({ error: "Name, and userId are required" });
  }
  const projectId = req.project.id;
  const newTask = {
    id: TASKS.length + 1,
    name,
    projectId,
    userId,
  };
  TASKS.push(newTask);
  res.status(201).json(newTask);
});

// {
router.delete("/:id", populateProject, authEditProject, (req, res) => {
  // }
  console.log("Marked project completed", req.project.id);
  res.status(204).send();
});

module.exports = router;
