import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { getCompanies, postJob } from "../api/api";
import { toast } from "react-toastify";

const initialForm = {
  title: "",
  description: "",
  requirements: "",
  salary: "",
  location: "",
  jobType: "Full Time",
  experience: "",
  position: "",
  companyId: "",
};

export default function PostJob() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [companies, setCompanies] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCompanies()
      .then((response) => setCompanies(response.data.companies || []))
      .catch(() => setCompanies([]));
  }, []);

  const update = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      await postJob(form);
      setMessage("Job added successfully.");
      toast.success("Job added successfully");
      setForm(initialForm);
      setTimeout(() => navigate("/job"), 500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Could not add job.";
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-black">Add a job</h1>
        <form
          onSubmit={submit}
          className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {[
            ["title", "Job title"],
            ["location", "Location"],
            ["salary", "Salary"],
            ["experience", "Experience in years"],
            ["position", "Open positions"],
          ].map(([name, label]) => (
            <label
              key={name}
              className="grid gap-1 text-sm font-semibold text-slate-700"
            >
              {label}
              <input
                name={name}
                value={form[name]}
                onChange={update}
                required
                type={
                  name === "salary" ||
                  name === "experience" ||
                  name === "position"
                    ? "number"
                    : "text"
                }
                className="rounded-lg border border-slate-300 px-3 py-2 font-normal"
              />
            </label>
          ))}
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Company
            <select
              name="companyId"
              value={form.companyId}
              onChange={update}
              required
              className="rounded-lg border border-slate-300 px-3 py-2 font-normal"
            >
              <option value="">Select your company</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Job type
            <select
              name="jobType"
              value={form.jobType}
              onChange={update}
              className="rounded-lg border border-slate-300 px-3 py-2 font-normal"
            >
              <option>Full Time</option>
              <option>Part Time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={update}
              required
              rows="4"
              className="rounded-lg border border-slate-300 px-3 py-2 font-normal"
            />
          </label>
          <label className="grid gap-1 text-sm font-semibold text-slate-700">
            Requirements{" "}
            <span className="font-normal text-slate-400">
              Separate each requirement with a comma
            </span>
            <textarea
              name="requirements"
              value={form.requirements}
              onChange={update}
              required
              rows="3"
              className="rounded-lg border border-slate-300 px-3 py-2 font-normal"
            />
          </label>
          <button
            disabled={submitting}
            className="rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-blue-600 disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? "Adding..." : "Add job"}
          </button>
          {message && <p className="text-sm text-slate-600">{message}</p>}
        </form>
      </main>
    </div>
  );
}
