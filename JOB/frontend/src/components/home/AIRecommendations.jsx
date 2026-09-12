import { useEffect, useState } from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";
import { getRecommendedJobs } from "../../api/api";

export default function AIRecommendations() {
  const [state, setState] = useState({
    loading: true,
    recommendations: [],
    profileReady: true,
  });

  useEffect(() => {
    getRecommendedJobs()
      .then(({ data }) => setState({ ...data, loading: false }))
      .catch(() =>
        setState({ loading: false, recommendations: [], profileReady: true }),
      );
  }, []);

  if (state.loading || !state.recommendations.length) return null;

  return (
    <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-300">
              <AutoAwesomeIcon sx={{ fontSize: 19 }} />
              <p className="text-xs font-bold uppercase tracking-[0.18em]">
                AI career guide
              </p>
            </div>
            <h2 className="mt-3 text-2xl font-black sm:text-3xl">
              Roles that fit your profile
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Ranked from your skills, bio, and each role&apos;s requirements.
              Every match includes the signal behind the recommendation.
            </p>
          </div>
          <Link
            to="/update-profile"
            className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300 hover:text-white"
          >
            Improve your profile <ArrowForwardIcon sx={{ fontSize: 17 }} />
          </Link>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-3">
          {state.recommendations.map((job) => (
            <Link
              key={job._id}
              to={`/description/${job._id}`}
              className="rounded-2xl border border-white/10 bg-white/8 p-5 transition hover:-translate-y-1 hover:border-cyan-300/60 hover:bg-white/12"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    {job.company?.name || "Company"}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-white">
                    {job.title}
                  </h3>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-400/15 px-2.5 py-1 text-sm font-black text-emerald-300">
                  {job.match.score}%
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                {job.match.reason}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.match.matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs font-semibold text-cyan-200"
                  >
                    {skill}
                  </span>
                ))}
                {job.match.missingSkills.slice(0, 1).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-white/8 px-2.5 py-1 text-xs font-semibold text-slate-400"
                  >
                    Learn: {skill}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
