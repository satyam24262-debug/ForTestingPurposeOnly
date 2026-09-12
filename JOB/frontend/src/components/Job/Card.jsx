import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { applyJob, getAppliedJobs } from "../../api/api";

export default function Card({ job }) {
  const user = useSelector((store) => store.auth.user);
  const navigate = useNavigate();
  const [applying, setApplying] = useState(false);

  if (!job?._id) return null;

  const selectedJob = job;
  const companyName =
    selectedJob.company?.name || selectedJob.company || "Company";
  const jobId = selectedJob.isPreview ? null : selectedJob._id;

  const handleApply = async () => {
    if (applying) return;

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "Student") {
      toast.error("Only students can apply for jobs");
      return;
    }

    setApplying(true);
    try {
      try {
        const { data: applicationsData } = await getAppliedJobs();
        const alreadyApplied = (applicationsData.application || []).some(
          (application) =>
            String(application.job?._id || application.job) === String(jobId),
        );
        if (alreadyApplied) {
          toast.warning("You are already registered for this job");
          return;
        }
      } catch {
        // The backend duplicate guard remains the final check.
      }

      const { data } = await applyJob(jobId);
      if (data.alreadyApplied) {
        toast.warning(
          data.message || "You are already registered for this job",
        );
      } else {
        toast.success("Application submitted successfully");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not apply for this job",
      );
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="group w-full rounded-4xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(37,99,235,0.12)] sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600 text-sm font-extrabold text-white shadow-md">
            {companyName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800">{companyName}</p>
            <p className="text-sm text-slate-500">{selectedJob.location}</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          {selectedJob.isPreview
            ? "Preview"
            : selectedJob.jobType || selectedJob.tag || "Open"}
        </span>
      </div>

      <div className="mb-3">
        <h3 className="text-xl font-bold text-slate-900">
          {selectedJob.title}
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          {selectedJob.experience !== undefined
            ? `${selectedJob.experience} years experience`
            : "Experience varies"}
        </p>
      </div>

      <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-600">
        {selectedJob.description}
      </p>

      <div className="mb-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
          {selectedJob.jobType || selectedJob.type}
        </span>
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
          {selectedJob.salary
            ? `₹${selectedJob.salary}`
            : "Salary not specified"}
        </span>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-500">
          <span className="font-semibold text-slate-700">
            {selectedJob.application?.length || 0}
          </span>{" "}
          applicants
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Link
            to={jobId ? `/description/${jobId}` : "/job"}
            className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-center text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700 sm:flex-none"
          >
            Details
          </Link>
          {jobId && (
            <button
              type="button"
              onClick={handleApply}
              disabled={applying}
              className="flex-1 rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-wait disabled:opacity-60 sm:flex-none"
            >
              {applying ? "Registering..." : "Apply"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
