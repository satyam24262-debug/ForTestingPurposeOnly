import { useState } from "react";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function HeroSection() {
  const navigate = useNavigate();
  const user = useSelector((store) => store.auth.user);
  const [keyword, setKeyword] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    const query = keyword.trim();
    navigate(
      query ? `/browse?keyword=${encodeURIComponent(query)}` : "/browse",
    );
  };

  return (
    <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pb-24">
      <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-slate-950 via-slate-900 to-cyan-900 px-6 py-12 text-white shadow-[0_30px_80px_rgba(15,23,42,0.2)] sm:px-12 sm:py-16 lg:px-20">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[2.25rem] border-cyan-300/10" />
        <div className="relative max-w-3xl">
          <span className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
            Your next chapter starts here
          </span>
          <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Find work that moves you forward.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Search live opportunities, apply with confidence, or build your
            hiring pipeline in one focused workspace.
          </p>
          <form
            onSubmit={handleSearch}
            className="mt-8 flex w-full max-w-2xl items-center rounded-2xl bg-white p-1.5 shadow-2xl shadow-slate-950/20"
          >
            <input
              type="text"
              placeholder="Find your dream jobs"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              aria-label="Search jobs"
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              aria-label="Search jobs"
              className="flex h-12 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-cyan-500 px-5 text-white transition hover:bg-cyan-400"
            >
              <SearchSharpIcon />
            </button>
          </form>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
            <span>Live job listings</span>
            <span>Role-based workspaces</span>
            <span>Simple applications</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {user ? (
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-cyan-100"
              >
                Open your workspace
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-cyan-100"
                >
                  Log in to continue
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:border-cyan-200 hover:bg-white/10"
                >
                  Create an account
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
