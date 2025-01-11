const { ROLES } = require("./db.js");

function canViewProject(user, project) {
  return user.role === ROLES.ADMIN || user.id === project.managerId;
}

function canEditProject(user, project) {
  return user.id === project.managerId;
}

module.exports = {
  canViewProject,
  canEditProject,
};
