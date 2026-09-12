import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../Navbar";
import { getJobs } from "../../api/api";
import { previewJobs } from "../../data/previewData";

const categories = [
  "Software Engineering",
  "Product Management",
  "Design",
  "Marketing",
  "Data Science",
  "Finance",
  "Operations",
];

export default function Browse() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs({ keyword: searchParams.get("keyword") || "" })
      .then((response) => {
        const query = searchParams.get("keyword") || "";
        setJobs(
          response.data.jobs?.length
            ? response.data.jobs
            : query
              ? []
              : previewJobs,
        );
      })
      .catch(() => setJobs(searchParams.get("keyword") ? [] : previewJobs))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const search = (event) => {
    event.preventDefault();
    setLoading(true);
    setSearchParams(keyword.trim() ? { keyword: keyword.trim() } : {});
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[30px] bg-linear-to-r from-slate-900 via-slate-800 to-blue-700 p-5 text-white shadow-[0_20px_60px_rgba(15,23,42,0.25)] sm:p-8">
          <p className="text-sm uppercase tracking-[0.18em] text-slate-300">
            Browse openings
          </p>
          <h1 className="mt-3 text-3xl font-black md:text-5xl">
            Discover jobs that match your goals
          </h1>
          <form
            onSubmit={search}
            className="mt-6 flex flex-col gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur-sm sm:flex-row"
          >
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              type="text"
              placeholder="Search roles, companies or skills"
              className="w-full rounded-full border border-white/15 bg-slate-950/20 px-5 py-3 text-sm text-white placeholder:text-slate-300 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-400"
            >
              Search Jobs
            </button>
          </form>
        </div>
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">Popular categories</h2>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setKeyword(category);
                    setLoading(true);
                    setSearchParams({ keyword: category });
                  }}
                  className="flex w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  {category}
                </button>
              ))}
            </div>
          </aside>
          <section className="space-y-5">
            {loading ? (
              <p className="rounded-2xl bg-white p-8 text-center text-slate-500">
                Loading jobs...
              </p>
            ) : jobs.length === 0 ? (
              <p className="rounded-2xl bg-white p-8 text-center text-slate-500">
                No jobs match your search.
              </p>
            ) : (
              jobs.map((job) => {
                const companyName = job.company?.name || "Company";
                return (
                  <article
                    key={job._id}
                    className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600 text-base font-black text-white">
                          {companyName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{job.title}</h3>
                          <p className="text-sm text-slate-500">
                            {companyName} • {job.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {job.isPreview ? "Preview" : job.jobType}
                        </span>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          ₹{job.salary}
                        </span>
                      </div>
                    </div>
                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-slate-500">
                        {job.position} position(s) • {job.experience} years
                        experience
                      </p>
                      {job.isPreview ? (
                        <span className="text-sm font-semibold text-slate-400">
                          Live details will appear when published
                        </span>
                      ) : (
                        <button
                          onClick={() => navigate(`/description/${job._id}`)}
                          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </article>
                );
              })
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
