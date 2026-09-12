import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cards from "./Cards";
import { getJobs } from "../../api/api";
import { previewJobs } from "../../data/previewData";

export default function LatestJobs() {
  const [featuredJobs, setFeaturedJobs] = useState([]);

  useEffect(() => {
    getJobs()
      .then((response) =>
        setFeaturedJobs(
          (response.data.jobs || []).slice(0, 6).length
            ? (response.data.jobs || []).slice(0, 6)
            : previewJobs,
        ),
      )
      .catch(() => setFeaturedJobs(previewJobs));
  }, []);

  return (
    <div className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Trending roles
          </p>
          <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
            <span className="text-cyan-500">Latest & Top</span> Job Openings
          </h1>
        </div>

        <Link
          to="/job"
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          View all jobs
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {featuredJobs.map((job) => (
          <Cards
            key={job._id || `${job.company?.name || job.company}-${job.title}`}
            job={job}
          />
        ))}
        {featuredJobs.length === 0 && (
          <p className="text-slate-500">No jobs are available yet.</p>
        )}
      </div>
    </div>
  );
}
