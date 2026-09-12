import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";

const studentActions = [
  {
    title: "Find jobs",
    description: "Search by title, company, skill, location, salary, or experience.",
    to: "/browse",
    label: "Search jobs",
  },
  {
    title: "Apply for jobs",
    description: "Open a job and submit an application directly to the company.",
    to: "/job",
    label: "View jobs",
  },
  {
    title: "Track applications",
    description: "Review your applied jobs and see whether each application is pending, accepted, or rejected.",
    to: "/applied-jobs",
    label: "My applications",
  },
  {
    title: "Update profile",
    description: "Keep your contact details, skills, and profile information ready for recruiters.",
    to: "/update-profile",
    label: "Edit profile",
  },
];

const recruiterActions = [
  {
    title: "Register a company",
    description: "Create the company profile that owns your job postings.",
    to: "/recruiter-dashboard",
    label: "Manage companies",
  },
  {
    title: "Add jobs",
    description: "Publish openings with requirements, salary, location, experience, and positions.",
    to: "/post-job",
    label: "Add a job",
  },
  {
    title: "Manage hiring",
    description: "See your posted jobs and open the applicant list for each role.",
    to: "/recruiter-dashboard",
    label: "Open dashboard",
  },
  {
    title: "Review applicants",
    description: "Update applications as pending, accepted, or rejected for your own jobs.",
    to: "/recruiter-dashboard",
    label: "Review applications",
  },
];

export default function Dashboard() {
  const user = useSelector((store) => store.auth.user);
  const actions = user?.role === "Recruiter" ? recruiterActions : studentActions;
  const isRecruiter = user?.role === "Recruiter";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {!user ? (
          <section className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">Welcome to JobPortal</p>
            <h1 className="mt-3 text-3xl font-black">Log in to see your workspace</h1>
            <p className="mt-3 text-slate-500">Choose Student or Recruiter during login to see the actions available for your role.</p>
            <Link to="/login" className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-blue-600">Log in</Link>
          </section>
        ) : (
          <>
            <section className="rounded-[30px] bg-linear-to-br from-slate-950 via-slate-900 to-blue-800 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.2)] sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">{isRecruiter ? "Recruiter workspace" : "Student workspace"}</p>
              <h1 className="mt-3 text-3xl font-black sm:text-5xl">Welcome, {user.fullName || "there"}</h1>
              <p className="mt-4 max-w-2xl text-slate-300">{isRecruiter ? "Build your company presence, publish jobs, and manage applicants from one place." : "Discover opportunities, submit applications, and keep track of your job search."}</p>
            </section>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {actions.map((action) => (
                <article key={action.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-bold">{action.title}</h2>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{action.description}</p>
                  <Link to={action.to} className="mt-5 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600">{action.label}</Link>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
