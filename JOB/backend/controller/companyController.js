const companyModel = require("../models/companyModel");

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await companyModel
      .find()
      .select("name description website location logo createdAt updatedAt")
      .sort({ createdAt: -1 });
    return res.status(200).json({ companies, success: true });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

exports.RegisterInCompany = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "Company name is required",
        success: false,
      });
    }

    let company = await companyModel.findOne({ name });
    if (company) {
      return res.status(400).json({
        message: "Your register for same company again",
        success: false,
      });
    }

    company = await companyModel.create({
      name: name,
      userId: req.id,
    });

    return res.status(201).json({
      message: "Regetered successfully",
      company,
      success: true,
    });
  } catch (err) {
    console.log("Error at company registrationController", err);
    res.status(500).json({
      message: "Internal server error",
      err,
    });
  }
};

exports.getCompany = async (req, res) => {
  try {
    const userId = req.id;

    const companies = await companyModel.find({ userId });

    return res.status(200).json({
      message: "Your registered companies have been found",
      companies,
    });
  } catch (err) {
    console.log("Error at getCompanyController", err);
    res.status(500).json({
      message: "Internal server Error",
      err,
    });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;

    const company = await companyModel
      .findOne({ _id: companyId, userId: req.id })
      .select("-userId");

    if (!company) {
      return res.status(404).json({
        message: "Company is not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company find Successfully",
      company,
      success: true,
    });
  } catch (err) {
    console.log("Error at getCompanyFindByIdController", err);
    res.status(500).json({
      message: "Internal server Error",
      success: false,
    });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    const updateData = { name, description, website, location };

    const company = await companyModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.id },
      updateData,
      { new: true },
    );

    if (!company) {
      return res.status(404).json({
        message: "company not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company information is updated successfully",
      success: true,
    });
  } catch (err) {
    console.log("Error at UpdateCompanyController", err);
    res.status(500).json({
      messag: "Internal server Error",
    });
  }
};
