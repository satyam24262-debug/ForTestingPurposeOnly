import React from "react";
import { Link } from "react-router-dom";

export default function Cards({ job }) {
  const companyName = job.company?.name || "Company";

  return (
    <div className="group flex h-full min-h-70 w-full max-w-90 flex-col rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_rgba(37,99,235,0.12)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600 text-sm font-black text-white">
          {companyName.slice(0, 2).toUpperCase()}
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
          {job.isPreview ? "Preview" : job.jobType}
        </span>
      </div>

      <div className="mb-3">
        <p className="text-sm text-slate-500">{job.location}</p>
        <h3 className="mt-1 text-xl font-bold text-slate-900">{companyName}</h3>
      </div>

      <div className="mb-3">
        <h4 className="text-lg font-bold text-slate-800">{job.title}</h4>
      </div>

      <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-600">
        {job.description}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-4">
        <div className="text-sm">
          <span className="font-bold text-blue-600">{job.position}</span>
          <span className="text-slate-500"> positions</span>
        </div>
        <span className="text-sm font-bold text-emerald-600">
          {job.salary
            ? `${(job.salary / 100000).toFixed(2)} LPA`
            : "Salary not specified"}
        </span>
      </div>
      {job.isPreview ? (
        <span className="mt-4 text-sm font-semibold text-slate-400">
          Live details will appear when this role is published.
        </span>
      ) : (
        <Link
          to={`/description/${job._id}`}
          className="mt-4 text-sm font-bold text-blue-600 hover:text-blue-800"
        >
          View job details
        </Link>
      )}
    </div>
  );
}
