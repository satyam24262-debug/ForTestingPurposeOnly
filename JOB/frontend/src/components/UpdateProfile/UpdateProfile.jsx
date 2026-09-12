import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar";
import { updateProfile } from "../../api/api";
import { setUser } from "../../redux/authSlice";

const getFormValues = (user) => ({
  fullName: user?.fullName || "",
  email: user?.email || "",
  phone: user?.phone || "",
  bio: user?.profile?.bio || "",
  skills: Array.isArray(user?.profile?.skills)
    ? user.profile.skills.join(", ")
    : "",
});

export default function UpdateProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.auth.user);
  const [form, setForm] = useState(() => getFormValues(user));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(getFormValues(user));
  }, [user]);

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await updateProfile({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone,
        profile: {
          bio: form.bio.trim(),
          skills: form.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
        },
      });

      dispatch(setUser(response.data.user));
      toast.success(response.data.message || "Profile updated successfully");
      setTimeout(() => navigate("/profile"), 700);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update profile");
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
          <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">
              Login required
            </h1>
            <p className="mt-2 text-slate-500">
              Sign in before updating your profile.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex rounded-full bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Go to login
            </Link>
          </section>
        </main>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link
          to="/profile"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} /> Back to profile
        </Link>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-slate-100 pb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
              Account details
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Update your profile
            </h1>
            <p className="mt-2 text-slate-500">
              Keep your details current so employers can find the right fit.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                Full name
                <input
                  required
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Email address
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                Phone number
                <input
                  required
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </label>
            </div>
            <label className="block text-sm font-semibold text-slate-700">
              Bio
              <textarea
                required
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows="5"
                placeholder="Tell employers about your experience and goals"
                className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              Skills
              <input
                required
                name="skills"
                value={form.skills}
                onChange={handleChange}
                placeholder="React, Node.js, SQL"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              <span className="mt-2 block text-xs font-normal text-slate-400">
                Separate skills with commas.
              </span>
            </label>
            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <Link
                to="/profile"
                className="rounded-full border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <SaveIcon sx={{ fontSize: 18 }} />{" "}
                {loading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </section>
      </main>
      <ToastContainer position="top-right" />
    </div>
  );
}
