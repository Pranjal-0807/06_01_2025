const { TASKS, fillTaskDetails } = require("../db.js");
const { populateTask } = require("../middleware/data.js");
const { paginate } = require("../middleware/pagination.js");
const router = require("express").Router();

router.get("/", filterTasks, paginate, (req, res) => {
  const detailedTasks = res.paginatedResults.results.map((task) =>
    fillTaskDetails(task)
  );
  res.paginatedResults.results = detailedTasks;
  res.json(res.paginatedResults);
});

function filterTasks(req, res, next) {
  req.paginationResource = TASKS;
  next();
}

router.get("/:id", populateTask, (req, res) => {
  res.json(fillTaskDetails(req.task));
});

router.delete("/:id", populateTask, (req, res) => {
  console.log("Marked task completed", req.task.id);
  res.status(204).send();
});

module.exports = router;
