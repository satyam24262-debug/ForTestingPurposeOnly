import React, { useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const categories = [
  { name: "Software Engineer", icon: "💻", color: "from-sky-500 to-cyan-500" },
  {
    name: "UI/UX Designer",
    icon: "🎨",
    color: "from-violet-500 to-purple-500",
  },
  { name: "Marketing", icon: "📈", color: "from-emerald-500 to-teal-500" },
  { name: "Data Analyst", icon: "📊", color: "from-amber-500 to-yellow-500" },
  { name: "Product Manager", icon: "📦", color: "from-rose-500 to-pink-500" },
  { name: "HR Manager", icon: "👥", color: "from-indigo-500 to-blue-500" },
  { name: "Sales Executive", icon: "💼", color: "from-orange-500 to-red-500" },
  { name: "Customer Support", icon: "🎧", color: "from-cyan-500 to-sky-600" },
  { name: "Finance", icon: "💰", color: "from-lime-500 to-green-500" },
  { name: "Content Writer", icon: "✍️", color: "from-fuchsia-500 to-pink-500" },
  { name: "Operations", icon: "🔧", color: "from-teal-500 to-emerald-500" },
];

export default function CategoryCarousel({ rtl = false }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount =
        direction === "left" ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full bg-gradient-to-b mt-10 from-slate-100 via-white to-slate-100 py-8 px-3 sm:px-4 md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-start px-1 sm:px-2">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 sm:text-sm">
              Explore
            </p>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Popular Job Categories
            </h2>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label="Scroll categories left"
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white/90 p-2 text-slate-700 shadow-lg shadow-slate-200 transition hover:bg-blue-600 hover:text-white sm:flex"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>

          <div
            ref={scrollRef}
            className={`flex gap-4 overflow-x-auto pb-3 scroll-smooth px-1 sm:px-10 ${
              rtl ? "flex-row-reverse" : ""
            }`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map(({ name, icon, color }, index) => (
              <button
                key={name}
                type="button"
                className="group flex min-w-[180px] flex-shrink-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-xl shadow-md shadow-slate-200 transition-transform duration-300 group-hover:scale-110`}
                >
                  <span aria-hidden="true">{icon}</span>
                </div>

                <div>
                  <p className="text-base font-semibold text-slate-800">
                    {name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {index + 3} open roles
                  </p>
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Scroll categories right"
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-slate-200 bg-white/90 p-2 text-slate-700 shadow-lg shadow-slate-200 transition hover:bg-blue-600 hover:text-white sm:flex"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
