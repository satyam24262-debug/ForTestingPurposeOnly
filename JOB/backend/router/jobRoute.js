const express = require("express");
const isAuthenticated = require("../middleware/isAuth");
const { requireRole } = require("../middleware/isAuth");
const { askAssistant } = require("../controller/assistantController");

const {
  postJob,
  getAllJobs,
  getJobById,
  getAdminJobs,
  getRecommendedJobs,
} = require("../controller/jobController");

const jobRouter = express.Router();

jobRouter.post("/postJob", isAuthenticated, requireRole("Recruiter"), postJob);
jobRouter.get("/getJobs", getAllJobs);
jobRouter.post("/assistant", askAssistant);
jobRouter.get(
  "/getRecommendedJobs",
  isAuthenticated,
  requireRole("Student"),
  getRecommendedJobs,
);
jobRouter.get("/getJobById/:id", getJobById);
jobRouter.get(
  "/getAdminJobs",
  isAuthenticated,
  requireRole("Recruiter"),
  getAdminJobs,
);

module.exports = jobRouter;
