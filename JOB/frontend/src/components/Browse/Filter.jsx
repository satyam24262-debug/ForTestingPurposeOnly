import React from "react";

const filterGroups = [
  {
    title: "Job Type",
    items: ["Full Time", "Part Time", "Contract", "Internship"],
  },
  {
    title: "Experience",
    items: ["Fresher", "1-3 years", "3-5 years", "5+ years"],
  },
  {
    title: "Location",
    items: ["Remote", "Hybrid", "Bengaluru", "Delhi", "Mumbai"],
  },
];

export default function Filter() {
  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Filters</h2>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          Reset
        </button>
      </div>

      {filterGroups.map((group) => (
        <div key={group.title} className="mb-6 last:mb-0">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">
            {group.title}
          </h3>
          <div className="space-y-2.5">
            {group.items.map((item) => (
              <label
                key={item}
                className="flex cursor-pointer items-center gap-3 text-sm text-slate-700"
              >
                <input
                  type="checkbox"
                  defaultChecked={item === "Full Time" || item === "Remote"}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="rounded-2xl bg-slate-50 p-4">
        <p className="mb-2 text-sm font-semibold text-slate-700">
          Salary Range
        </p>
        <input
          type="range"
          min="0"
          max="50"
          defaultValue="20"
          className="w-full accent-blue-600"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>₹5 LPA</span>
          <span>₹30 LPA</span>
        </div>
      </div>
    </aside>
  );
}
