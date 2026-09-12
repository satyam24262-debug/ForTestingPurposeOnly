const jobModel = require("../models/jobModel");

const ApplicationModel = require("../models/applicationModel");

exports.applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(404).json({
        message: "Job id is required",
      });
    }

    const existingApplication = await ApplicationModel.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(200).json({
        message: "You are already registered for this job",
        alreadyApplied: true,
        success: true,
      });
    }

    const job = await jobModel.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    const newApplication = await ApplicationModel.create({
      job: jobId,
      applicant: userId,
    });

    job.application.push(newApplication._id);

    await job.save();

    return res.status(200).json({
      message: "Job applied successfully",
      success: true,
    });
  } catch (err) {
    console.log("error at applicatioinController", err);
    if (err.code === 11000) {
      return res.status(200).json({
        message: "You are already registered for this job",
        alreadyApplied: true,
        success: true,
      });
    }
    res.status(500).json({
      message: "Internal server Error",
      success: false,
    });
  }
};

exports.getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const application = await ApplicationModel.find({ applicant: userId })

      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        select:
          "title description salary location jobType experience position company createdAt",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          select: "name description website location logo",
          options: { sort: { createdAt: -1 } },
        },
      });

    res.status(200).json({
      application,
      success: true,
    });
  } catch (err) {
    console.log("Error at getAppliedJobsController", err);
    res.status(500).json({
      message: "Internal server Error",
      success: false,
    });
  }
};

exports.getApplicationJobsByAdmin = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await jobModel
      .findOne({ _id: jobId, created_by: req.id })
      .populate({
        path: "application",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "applicant",
          select: "fullName email phone profile role",
        },
      });

    if (!job) {
      return res.status(404).json({
        message: "job not found",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log("Error at getApplicationByAdminController", error);

    res.status(500).json({
      message: "Internal server Error",
      error,
      success: false,
    });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const applicationId = req.params.id;

    if (!status) {
      return res.status(404).json({
        message: "status is required",
        message: false,
      });
    }

    const application = await ApplicationModel.findOne({ _id: applicationId });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }

    const job = await jobModel.findOne({
      _id: application.job,
      created_by: req.id,
    });
    if (!job) {
      return res.status(403).json({
        message: "You can only update applications for your own jobs",
        success: false,
      });
    }

    application.status = status.toLowerCase();

    if (!["pending", "accepted", "rejected"].includes(application.status)) {
      return res.status(400).json({
        message: "Invalid application status",
        success: false,
      });
    }

    await application.save();

    return res.status(200).json({
      application,
      success: true,
    });
  } catch (error) {
    console.log("Error at applicationController", error);

    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
