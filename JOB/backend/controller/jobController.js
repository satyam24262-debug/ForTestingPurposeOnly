const jobModel = require("../models/jobModel");
const companyModel = require("../models/companyModel");

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getMatch = (job, profileText, profileSkills) => {
  const jobText = normalizeText(
    [job.title, job.description, job.jobType, ...(job.requirements || [])].join(
      " ",
    ),
  );
  const matchedSkills = profileSkills.filter((skill) =>
    jobText.includes(normalizeText(skill)),
  );
  const requirements = (job.requirements || []).map((requirement) =>
    normalizeText(requirement),
  );
  const missingSkills = requirements
    .filter(
      (requirement) =>
        requirement &&
        !profileText.includes(requirement) &&
        !matchedSkills.some((skill) =>
          requirement.includes(normalizeText(skill)),
        ),
    )
    .map((requirement) =>
      requirement.replace(/\b\w/g, (letter) => letter.toUpperCase()),
    )
    .slice(0, 3);
  const skillScore = profileSkills.length
    ? (matchedSkills.length / profileSkills.length) * 55
    : 0;
  const requirementScore = requirements.length
    ? ((requirements.length - missingSkills.length) / requirements.length) * 30
    : 15;
  const titleScore = profileSkills.some((skill) =>
    normalizeText(job.title).includes(normalizeText(skill)),
  )
    ? 15
    : 0;
  const score = Math.min(
    99,
    Math.round(skillScore + requirementScore + titleScore),
  );

  return {
    score,
    matchedSkills: matchedSkills.slice(0, 4),
    missingSkills,
    reason: matchedSkills.length
      ? `Your profile matches ${matchedSkills.slice(0, 2).join(" and ")}.`
      : "This role is close to your profile. Add more skills to improve the match.",
  };
};

exports.postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;

    const userId = req.id;
    const numericSalary = Number(salary);
    const numericExperience = Number(experience);
    const numericPosition = Number(position);
    const normalizedRequirements = Array.isArray(requirements)
      ? requirements
          .map((requirement) => String(requirement).trim())
          .filter(Boolean)
      : typeof requirements === "string"
        ? requirements
            .split(",")
            .map((requirement) => requirement.trim())
            .filter(Boolean)
        : [];

    if (
      !title ||
      !description ||
      !normalizedRequirements.length ||
      !location ||
      !jobType ||
      !companyId ||
      !Number.isFinite(numericSalary) ||
      numericSalary < 0 ||
      !Number.isFinite(numericExperience) ||
      numericExperience < 0 ||
      !Number.isInteger(numericPosition) ||
      numericPosition < 1
    ) {
      return res.status(400).json({
        message: "Fields can't be empty",
        success: false,
      });
    }

    const company = await companyModel.findOne({ _id: companyId, userId });
    if (!company) {
      return res.status(403).json({
        message: "You can only post jobs for your own company",
        success: false,
      });
    }

    const duplicateJob = await jobModel.findOne({
      company: company._id,
      title: {
        $regex: `^${escapeRegex(String(title).trim())}$`,
        $options: "i",
      },
      location: {
        $regex: `^${escapeRegex(String(location).trim())}$`,
        $options: "i",
      },
      jobType: {
        $regex: `^${escapeRegex(String(jobType).trim())}$`,
        $options: "i",
      },
    });

    if (duplicateJob) {
      return res.status(409).json({
        message: "You have already added this job",
        success: false,
      });
    }

    const job = await jobModel.create({
      title,
      description,
      requirements: normalizedRequirements,
      salary: numericSalary,
      location,
      jobType,
      experience: numericExperience,
      position: numericPosition,
      company: company._id,
      created_by: userId,
    });

    return res.status(201).json({
      message: "Job has been created successfully",
      success: true,
      job,
    });
  } catch (err) {
    console.log("error at PostjobController", err);
    res.status(500).json({
      message: "Internal server error",
      message: false,
    });
  }
};

exports.getAllJobs = async (req, res, next) => {
  try {
    const keyword = String(req.query.keyword || "").trim();
    const jobTypes = String(req.query.jobType || "")
      .split(",")
      .filter(Boolean);
    const locations = String(req.query.location || "")
      .split(",")
      .filter(Boolean);
    const experienceMin = Number(req.query.experienceMin);
    const experienceMax = Number(req.query.experienceMax);
    const maxSalary = Number(req.query.maxSalary);
    const safeKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const companies = keyword
      ? await companyModel
          .find({ name: { $regex: safeKeyword, $options: "i" } })
          .select("_id")
      : [];

    const query = {
      $and: [
        {
          $or: [
            { title: { $regex: safeKeyword, $options: "i" } },
            { description: { $regex: safeKeyword, $options: "i" } },
            { location: { $regex: safeKeyword, $options: "i" } },
            { jobType: { $regex: safeKeyword, $options: "i" } },
            { requirements: { $regex: safeKeyword, $options: "i" } },
            ...(companies.length
              ? [{ company: { $in: companies.map((company) => company._id) } }]
              : []),
          ],
        },
        ...(jobTypes.length ? [{ jobType: { $in: jobTypes } }] : []),
        ...(locations.length ? [{ location: { $in: locations } }] : []),
        ...(Number.isFinite(experienceMin)
          ? [{ experience: { $gte: experienceMin } }]
          : []),
        ...(Number.isFinite(experienceMax)
          ? [{ experience: { $lte: experienceMax } }]
          : []),
        ...(Number.isFinite(maxSalary)
          ? [{ salary: { $lte: maxSalary } }]
          : []),
      ],
    };

    const jobs = await jobModel
      .find(query)
      .populate("company", "name location logo")
      .sort(req.query.sort === "salary" ? { salary: -1 } : { createdAt: -1 });

    return res.status(200).json({
      message: "Jobs are found successfully",
      jobs,
      success: true,
    });
  } catch (err) {
    console.log("Error is at getAllJObModel", err);
    return res.status(500).json({
      message: "Internal server Error",
      err,
      success: false,
    });
  }
};

exports.getRecommendedJobs = async (req, res) => {
  try {
    const profileSkills = (req.user.profile?.skills || [])
      .map((skill) => String(skill).trim())
      .filter(Boolean);
    const profileText = normalizeText(
      [req.user.profile?.bio, ...profileSkills].join(" "),
    );
    const jobs = await jobModel
      .find({})
      .populate("company", "name location logo")
      .sort({ createdAt: -1 })
      .limit(50);
    const recommendations = jobs
      .map((job) => ({
        ...job.toObject(),
        match: getMatch(job, profileText, profileSkills),
      }))
      .sort((first, second) => second.match.score - first.match.score)
      .slice(0, 3);

    return res.status(200).json({
      recommendations,
      profileReady: profileSkills.length > 0 || Boolean(req.user.profile?.bio),
      success: true,
    });
  } catch (err) {
    console.log("Error at getRecommendedJobsController", err);
    return res.status(500).json({
      message: "Could not generate recommendations",
      success: false,
    });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await jobModel
      .findById({ _id: jobId })
      .populate("company", "name description website location logo");

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (err) {
    console.log("error at getJobByIdController", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

exports.getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;

    const jobs = await jobModel
      .find({ created_by: adminId })
      .populate("company", "name location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      jobs,
      success: true,
    });
  } catch (err) {
    console.log("Error at getAdminJobsController", err);
    res.status(500).json({
      message: "Internal server Error",
      err,
    });
  }
};
