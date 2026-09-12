import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import Navbar from "../Navbar";

const emptyProfile = {
  fullName: "",
  email: "",
  phone: "",
  role: "Student",
  bio: "",
  skills: "",
};

const getProfileValues = (user) => ({
  ...emptyProfile,
  ...user,
  bio: user?.profile?.bio || user?.bio || "",
  skills: Array.isArray(user?.profile?.skills)
    ? user.profile.skills.join(", ")
    : user?.skills || "",
});

export default function Profile() {
  const navigate = useNavigate();
  const user = useSelector((store) => store.auth.user);
  const [profile, setProfile] = useState(() => getProfileValues(user));

  useEffect(() => {
    setProfile(getProfileValues(user));
  }, [user]);

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
          <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <AccountCircleIcon sx={{ fontSize: 64, color: "#94a3b8" }} />
            <h1 className="mt-4 text-2xl font-bold text-slate-900">
              Sign in to view your profile
            </h1>
            <p className="mt-2 text-slate-500">
              Your profile details will appear here after you log in.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex rounded-full bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Go to login
            </Link>
          </section>
        </main>
      </>
    );
  }

  const initials = profile.fullName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} /> Back to home
        </Link>

        <div className="grid min-w-0 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="relative h-fit overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-slate-900 to-cyan-900 p-7 text-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border-24 border-cyan-300/10" />
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-500 text-3xl font-bold ring-4 ring-blue-400/20">
              {initials || "U"}
            </div>
            <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-blue-300">
              {profile.role}
            </p>
            <h1 className="mt-2 wrap-break-word text-3xl font-bold">
              {profile.fullName || "Your profile"}
            </h1>
            <p className="mt-3 break-all text-sm text-slate-300">
              {profile.email}
            </p>
            <div className="mt-8 border-t border-white/10 pt-5 text-sm text-slate-300">
              <p>Keep your profile current so employers can get to know you.</p>
            </div>
          </aside>

          <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Account details
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Your profile
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Present your best professional self.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/update-profile")}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                <EditIcon sx={{ fontSize: 17 }} /> Edit profile
              </button>
            </div>

            <div className="mt-7 space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700">
                  Full name
                  <input
                    name="fullName"
                    value={profile.fullName || ""}
                    readOnly
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Email address
                  <input
                    type="email"
                    name="email"
                    value={profile.email || ""}
                    readOnly
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Phone number
                  <input
                    name="phone"
                    value={profile.phone || ""}
                    readOnly
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Account type
                  <input
                    name="role"
                    value={profile.role || ""}
                    readOnly
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-normal text-slate-500"
                  />
                </label>
              </div>
              <label className="block text-sm font-semibold text-slate-700">
                About you
                <textarea
                  name="bio"
                  value={profile.bio || ""}
                  readOnly
                  rows="4"
                  placeholder="Tell employers what you do best"
                  className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Skills
                <input
                  name="skills"
                  value={profile.skills || ""}
                  readOnly
                  placeholder="React, Node.js, SQL"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-500"
                />
                <span className="mt-2 block text-xs font-normal text-slate-400">
                  Separate skills with commas.
                </span>
              </label>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
