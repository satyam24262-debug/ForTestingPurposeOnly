import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link, useParams } from "react-router-dom";
import Navbar from "../Navbar";
import { useEffect, useState } from "react";
import { applyJob, getAppliedJobs, getJobById } from "../../api/api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function JobDescription() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [applying, setApplying] = useState(false);
  const user = useSelector((store) => store.auth.user);

  useEffect(() => {
    getJobById(id)
      .then((response) => setJob(response.data.job))
      .catch(() => setNotFound(true));
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      toast.info("Please log in as a student to apply");
      return;
    }

    if (user.role !== "Student") {
      toast.error("Only students can apply for jobs");
      return;
    }

    if (applying) return;

    setApplying(true);
    try {
      try {
        const { data: applicationsData } = await getAppliedJobs();
        const alreadyApplied = (applicationsData.application || []).some(
          (application) =>
            String(application.job?._id || application.job) === String(id),
        );
        if (alreadyApplied) {
          toast.warning("You are already registered for this job");
          return;
        }
      } catch {
        // The backend duplicate guard remains the final check.
      }

      const { data } = await applyJob(id);
      if (data.alreadyApplied) {
        toast.warning(
          data.message || "You are already registered for this job",
        );
      } else {
        toast.success("Application submitted");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not apply");
    } finally {
      setApplying(false);
    }
  };

  if (notFound)
    return (
      <>
        <Navbar />
        <p className="p-8 text-center">Job not found.</p>
      </>
    );
  if (!job)
    return (
      <>
        <Navbar />
        <p className="p-8 text-center">Loading job...</p>
      </>
    );
  const companyName = job.company?.name || "Company";
  const requirements = Array.isArray(job.requirements) ? job.requirements : [];
  const postedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString()
    : "Recently";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/browse"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} /> Back to jobs
        </Link>

        <section className="rounded-[30px] bg-linear-to-br from-slate-950 via-slate-900 to-blue-800 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)] sm:p-10">
          <div className="flex flex-col gap-7 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-400 to-blue-500 text-xl font-black shadow-lg">
                {companyName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-200">
                  {companyName}
                </p>
                <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                  {job.title}
                </h1>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
                  <span>{job.location}</span>
                  <span>{job.experience}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleApply}
              disabled={user?.role === "Recruiter" || applying}
              className="rounded-full bg-white px-6 py-3 font-bold text-slate-900 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {applying ? "Registering..." : "Apply now"}
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-6">
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-blue-100">
              {job.jobType}
            </span>
            <span className="rounded-full bg-emerald-400/15 px-3 py-1.5 text-sm font-semibold text-emerald-200">
              {job.salary}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-slate-200">
              Posted {postedDate}
            </span>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <section>
              <h2 className="text-2xl font-bold text-slate-900">
                About the role
              </h2>
              <p className="mt-4 leading-7 text-slate-600">{job.description}</p>
            </section>

            <section className="mt-9">
              <h2 className="text-2xl font-bold text-slate-900">
                What you&apos;ll do
              </h2>
              <ul className="mt-4 space-y-4">
                {requirements.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 leading-7 text-slate-600"
                  >
                    <CheckCircleIcon
                      className="mt-1 shrink-0 text-blue-600"
                      sx={{ fontSize: 20 }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-9">
              <h2 className="text-2xl font-bold text-slate-900">
                What we&apos;re looking for
              </h2>
              <ul className="mt-4 space-y-4">
                {requirements.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 leading-7 text-slate-600"
                  >
                    <CheckCircleIcon
                      className="mt-1 shrink-0 text-emerald-600"
                      sx={{ fontSize: 20 }}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </article>

          <aside className="h-fit rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Job summary</h2>
            <dl className="mt-5 space-y-5 text-sm">
              <div>
                <dt className="text-slate-400">Company</dt>
                <dd className="mt-1 font-semibold text-slate-800">
                  {companyName}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Work location</dt>
                <dd className="mt-1 font-semibold text-slate-800">
                  {job.location}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Employment type</dt>
                <dd className="mt-1 font-semibold text-slate-800">
                  {job.jobType}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Salary</dt>
                <dd className="mt-1 font-semibold text-slate-800">
                  {job.salary}
                </dd>
              </div>
            </dl>
            <button
              onClick={handleApply}
              disabled={user?.role === "Recruiter" || applying}
              className="mt-7 w-full rounded-full bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {applying ? "Registering..." : "Apply for this role"}
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}
