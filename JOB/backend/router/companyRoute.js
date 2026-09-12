const express = require("express");
const {
  RegisterInCompany,
  getCompanyById,
  updateCompany,
  getCompany,
  getAllCompanies,
} = require("../controller/companyController");
const isAuthenticated = require("../middleware/isAuth");
const { requireRole } = require("../middleware/isAuth");

const CompanyRouter = express.Router();

CompanyRouter.post(
  "/registerInCompany",
  isAuthenticated,
  requireRole("Recruiter"),
  RegisterInCompany,
);
CompanyRouter.get("/getAllCompanies", getAllCompanies);
CompanyRouter.get(
  "/getCompany",
  isAuthenticated,
  requireRole("Recruiter"),
  getCompany,
);
CompanyRouter.get("/getCompanyById/:id", isAuthenticated, getCompanyById);
CompanyRouter.put(
  "/updateCompany/:id",
  isAuthenticated,
  requireRole("Recruiter"),
  updateCompany,
);

module.exports = CompanyRouter;
