import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import {
  getAdminJobs,
  getApplicationsForJob,
  getCompanies,
  registerCompany,
  updateApplicationStatus,
} from "../api/api";

export default function RecruiterDashboard() {
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [message, setMessage] = useState("");

  const load = () =>
    Promise.all([getCompanies(), getAdminJobs()])
      .then(([companyResponse, jobResponse]) => {
        setCompanies(companyResponse.data.companies || []);
        setJobs(jobResponse.data.jobs || []);
      })
      .catch((error) =>
        setMessage(
          error.response?.data?.message || "Could not load recruiter data.",
        ),
      );

  useEffect(() => {
    load();
  }, []);

  const addCompany = async (event) => {
    event.preventDefault();
    try {
      await registerCompany({ name: companyName });
      setCompanyName("");
      setMessage("Company added.");
      load();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not add company.");
    }
  };

  const showApplicants = async (job) => {
    try {
      const response = await getApplicationsForJob(job._id);
      setSelectedJob(response.data.job);
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not load applicants.");
    }
  };

  const changeStatus = async (applicationId, status) => {
    try {
      await updateApplicationStatus(applicationId, status);
      if (selectedJob) showApplicants(selectedJob);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Could not update application.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
              Recruiter workspace
            </p>
            <h1 className="mt-2 text-3xl font-black">Manage your hiring</h1>
          </div>
          <Link
            to="/post-job"
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-600"
          >
            Add job
          </Link>
        </div>
        {message && (
          <p className="rounded-xl bg-blue-50 p-3 text-sm text-blue-700">
            {message}
          </p>
        )}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Your companies</h2>
          <form
            onSubmit={addCompany}
            className="mt-4 flex flex-col gap-3 sm:flex-row"
          >
            <input
              required
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              placeholder="Company name"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
            />
            <button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
              Register company
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {companies.map((company) => (
              <span
                key={company._id}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm"
              >
                {company.name}
              </span>
            ))}
            {companies.length === 0 && (
              <p className="text-sm text-slate-500">
                Register a company before adding a job.
              </p>
            )}
          </div>
        </section>
        <section>
          <h2 className="text-xl font-bold">Your jobs</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <article
                key={job._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <h3 className="text-lg font-bold">{job.title}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {job.company?.name} • {job.location}
                </p>
                <p className="mt-3 text-sm text-slate-600">
                  {job.application?.length || 0} application(s)
                </p>
                <button
                  onClick={() => showApplicants(job)}
                  className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                >
                  View applicants
                </button>
              </article>
            ))}
            {jobs.length === 0 && (
              <p className="text-slate-500">You have not posted a job yet.</p>
            )}
          </div>
        </section>
        {selectedJob && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold">
                Applicants for {selectedJob.title}
              </h2>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-sm text-slate-500"
              >
                Close
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {selectedJob.application?.map((application) => (
                <div
                  key={application._id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold">
                      {application.applicant?.fullName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {application.applicant?.email} • {application.status}
                    </p>
                  </div>
                  <select
                    value={application.status}
                    onChange={(event) =>
                      changeStatus(application._id, event.target.value)
                    }
                    className="rounded-lg border border-slate-300 px-3 py-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              ))}
              {(!selectedJob.application ||
                selectedJob.application.length === 0) && (
                <p className="text-slate-500">No applications yet.</p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
