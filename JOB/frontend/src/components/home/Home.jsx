import React from "react";
import Navbar from "../Navbar";
import HeroSection from "./HeroSection";
import CategoryCarousel from "./Category";
import LatestJobs from "./LatestJobs";
import Footer from "./Footer";
import AIRecommendations from "./AIRecommendations";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Home() {
  const user = useSelector((store) => store.auth.user);
  const isRecruiter = user?.role === "Recruiter";

  return (
    <div className="min-h-screen overflow-hidden bg-transparent">
      <Navbar />
      <main>
        <HeroSection />
        <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            {user ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
                    {isRecruiter ? "Recruiter workspace" : "Student workspace"}
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    Welcome back, {user.fullName || "there"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {isRecruiter
                      ? "Manage your companies, jobs, and applicants."
                      : "Find opportunities and track your applications."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/dashboard"
                    className="rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-600"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to={isRecruiter ? "/post-job" : "/applied-jobs"}
                    className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-700"
                  >
                    {isRecruiter ? "Post a job" : "My applications"}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    A better way to find your next move
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Join as a Student to apply, or as a Recruiter to build your
                    hiring pipeline.
                  </p>
                </div>
                <Link
                  to="/signup"
                  className="shrink-0 rounded-full bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-600"
                >
                  Choose your role
                </Link>
              </div>
            )}
          </div>
        </section>
        {user?.role === "Student" && <AIRecommendations />}
        <CategoryCarousel />
        <LatestJobs />
      </main>
      <Footer />
    </div>
  );
}
