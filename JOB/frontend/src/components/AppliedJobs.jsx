import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { getAppliedJobs } from "../api/api";

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAppliedJobs()
      .then((response) => setApplications(response.data.application || []))
      .catch((requestError) =>
        setError(
          requestError.response?.data?.message ||
            "Could not load your applications.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-black">My applied jobs</h1>
        {loading ? (
          <p className="mt-8 text-slate-500">Loading applications...</p>
        ) : applications.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            You have not applied for any jobs yet.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {applications.map((application) => (
              <article
                key={application._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">
                      {application.job?.title}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {application.job?.company?.name || "Company"}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold capitalize text-blue-700">
                    {application.status}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-500">
                  Applied {new Date(application.createdAt).toLocaleDateString()}
                </p>
              </article>
            ))}
          </div>
        )}
        {error && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
      </main>
    </div>
  );
}
