import React, { useEffect, useState } from "react";
import Filter from "./Filter";
import Card from "./Card";
import Navbar from "../Navbar";
import { getJobs } from "../../api/api";
import { previewJobs } from "../../data/previewData";

export default function Job() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const initialFilters = {
    keyword: "",
    jobTypes: [],
    locations: [],
    experience: "",
    maxSalary: 3000000,
    sort: "recent",
  };
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const hasActiveFilters = (nextFilters) =>
    Object.values(nextFilters).some((value) =>
      Array.isArray(value)
        ? value.length > 0
        : value !== "" && value !== 3000000 && value !== "recent",
    );

  const toParams = (nextFilters) => {
    const params = { keyword: nextFilters.keyword, sort: nextFilters.sort };
    if (nextFilters.jobTypes.length)
      params.jobType = nextFilters.jobTypes.join(",");
    if (nextFilters.locations.length)
      params.location = nextFilters.locations.join(",");
    if (nextFilters.experience) {
      if (nextFilters.experience === "0") params.experienceMax = 0;
      else if (nextFilters.experience === "5+") params.experienceMin = 5;
      else {
        const [minimum, maximum] = nextFilters.experience.split("-");
        params.experienceMin = minimum;
        params.experienceMax = maximum;
      }
    }
    if (nextFilters.maxSalary < 3000000)
      params.maxSalary = nextFilters.maxSalary;
    return params;
  };

  useEffect(() => {
    setLoading(true);
    getJobs(toParams(appliedFilters))
      .then((response) =>
        setJobs(
          response.data.jobs?.length
            ? response.data.jobs
            : hasActiveFilters(appliedFilters)
              ? []
              : previewJobs,
        ),
      )
      .catch(() => setJobs(hasActiveFilters(appliedFilters) ? [] : previewJobs))
      .finally(() => setLoading(false));
  }, [appliedFilters]);

  const resetFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-[1.75rem] bg-linear-to-r from-sky-600 to-blue-700 p-5 text-white shadow-[0_20px_50px_rgba(37,99,235,0.28)] sm:p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-blue-100">
              Explore roles
            </p>
            <h1 className="mt-2 text-3xl font-black md:text-4xl">
              Find your next opportunity
            </h1>
          </div>
          <div className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
            <span className="text-sm text-blue-100">Jobs available</span>
            <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-blue-700">
              {jobs.length}
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <Filter
            filters={filters}
            onChange={setFilters}
            onReset={resetFilters}
          />

          <section>
            <div className="mb-5 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Recommended jobs
                </h2>
                <p className="text-sm text-slate-500">
                  {jobs.some((job) => job.isPreview)
                    ? "Preview listings"
                    : `Showing ${jobs.length} opportunities`}
                </p>
              </div>

              <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
                <input
                  value={filters.keyword}
                  onChange={(event) =>
                    setFilters({ ...filters, keyword: event.target.value })
                  }
                  placeholder="Search jobs"
                  className="min-w-0 rounded-full border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 sm:w-40"
                />
                <select
                  value={filters.sort}
                  onChange={(event) =>
                    setFilters({ ...filters, sort: event.target.value })
                  }
                  className="rounded-full border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="recent">Most Recent</option>
                  <option value="salary">Highest Salary</option>
                </select>
                <button
                  onClick={() => setAppliedFilters(filters)}
                  className="rounded-full bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
                >
                  Apply filters
                </button>
              </div>
            </div>

            {loading ? (
              <div className="rounded-4xl border border-slate-200 bg-white p-12 text-center text-slate-500">
                Loading jobs...
              </div>
            ) : jobs.length <= 0 ? (
              <div className="rounded-4xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
                No jobs found for the selected filters.
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {jobs.map((job, index) => (
                  <Card
                    key={`${job.company}-${job.title}-${index}`}
                    job={job}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
