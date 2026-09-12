import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import { getAllCompanies, getJobs } from "../../api/api";
import { previewCompanies } from "../../data/previewData";

export default function Company() {
  const [companies, setCompanies] = useState([]);
  const [jobCounts, setJobCounts] = useState({});

  useEffect(() => {
    Promise.all([getAllCompanies(), getJobs()])
      .then(([companyResponse, jobResponse]) => {
        setCompanies(
          companyResponse.data.companies?.length
            ? companyResponse.data.companies
            : previewCompanies,
        );
        const counts = {};
        (jobResponse.data.jobs || []).forEach((job) => {
          const companyId = job.company?._id;
          if (companyId) counts[companyId] = (counts[companyId] || 0) + 1;
        });
        setJobCounts(counts);
      })
      .catch(() => setCompanies(previewCompanies));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[30px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.18em] text-blue-600">
            Top employers
          </p>
          <h1 className="mt-3 text-3xl font-black md:text-4xl">
            Explore companies hiring right now
          </h1>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {companies.map((company) => (
            <article
              key={company._id}
              className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 text-sm font-black text-white">
                  {company.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{company.name}</h2>
                  <p className="text-sm text-slate-500">
                    {company.location || "Location not listed"}
                  </p>
                </div>
              </div>
              <p className="mb-5 text-sm leading-6 text-slate-600">
                {company.description ||
                  "This company has not added a description yet."}
              </p>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>
                  {company.isPreview
                    ? "Preview profile"
                    : `${jobCounts[company._id] || 0} open job(s)`}
                </span>
                {company.isPreview ? (
                  <span className="font-semibold text-slate-400">
                    Coming soon
                  </span>
                ) : (
                  <Link
                    to={`/browse?keyword=${encodeURIComponent(company.name)}`}
                    className="font-semibold text-blue-600 hover:text-blue-800"
                  >
                    View jobs
                  </Link>
                )}
              </div>
            </article>
          ))}
          {companies.length === 0 && (
            <p className="text-slate-500">No companies are registered yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
