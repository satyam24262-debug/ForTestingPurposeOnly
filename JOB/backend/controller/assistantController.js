const getAssistantResponse = (question, role) => {
  const text = String(question || "").toLowerCase();
  const isProjectQuestion =
    /jobportal|job portal|job|application|apply|recruit|candidate|profile|resume|skill|bio|company|companies|browse|search|filter|salary|location|dashboard|account|login|signup|register|match|recommend|career guide/.test(
      text,
    );

  if (!isProjectQuestion) {
    return "I only provide help related to the JobPortal project, such as jobs, applications, profiles, recruiter tools, companies, and AI matching.";
  }

  if (/apply|application|submit/.test(text)) {
    return "To apply, open a job from Jobs or Browse, review its requirements, and select Apply now. You need to be logged in as a Student.";
  }
  if (/recommend|match|suit|best job|skill/.test(text)) {
    return role === "Student"
      ? "Open the AI career guide on the home page. It ranks roles using your profile skills and bio, then shows matched and missing skills."
      : "Students can see personalized role matches on the home page after adding skills and a bio to their profile.";
  }
  if (/recruit|post|hire|candidate/.test(text)) {
    return "Recruiters can register a company, post roles with requirements, and review applications from the My hiring dashboard.";
  }
  if (/profile|resume|skill|bio|update/.test(text)) {
    return "Go to Profile and choose Edit profile. Add a clear bio and comma-separated skills so job matching can understand your experience.";
  }
  if (/search|find|browse|filter|job/.test(text)) {
    return "Use Jobs for the full listing and Browse for filters such as keyword, location, job type, experience, and salary.";
  }
  if (/company|companies/.test(text)) {
    return "The Companies page lets you explore employers and their published opportunities. Recruiters manage their own company from the dashboard.";
  }
  if (/login|signup|register|account/.test(text)) {
    return "Use Sign up to create a Student or Recruiter account. Log in afterward to apply, manage your profile, or publish jobs.";
  }

  return "I can help with this JobPortal project. Ask about finding jobs, applying, improving your profile, AI matches, recruiter tools, or company pages.";
};

exports.askAssistant = (req, res) => {
  const question = String(req.body?.question || "").trim();
  if (!question) {
    return res
      .status(400)
      .json({ message: "Ask a question first", success: false });
  }

  return res.status(200).json({
    answer: getAssistantResponse(question, req.user?.role),
    success: true,
  });
};
