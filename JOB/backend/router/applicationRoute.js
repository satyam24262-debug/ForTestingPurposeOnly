const isAuthenticated = require("../middleware/isAuth");
const { requireRole } = require("../middleware/isAuth");

const express = require("express");

const {
  applyJob,
  getAppliedJobs,
  getApplicationJobsByAdmin,
  updateStatus,
} = require("../controller/applicationController");

const applicationRouter = express.Router();

applicationRouter.post(
  "/applyJob/:id",
  isAuthenticated,
  requireRole("Student"),
  applyJob,
);
applicationRouter.get(
  "/getAppliedJobs",
  isAuthenticated,
  requireRole("Student"),
  getAppliedJobs,
);
applicationRouter.get(
  "/getApplicationByAdmin/:id",
  isAuthenticated,
  requireRole("Recruiter"),
  getApplicationJobsByAdmin,
);
applicationRouter.post(
  "/updateStatus/:id",
  isAuthenticated,
  requireRole("Recruiter"),
  updateStatus,
);

module.exports = applicationRouter;
