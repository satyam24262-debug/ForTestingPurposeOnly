const filterGroups = [
  {
    key: "jobTypes",
    title: "Job Type",
    items: ["Full Time", "Part Time", "Contract", "Internship"],
  },
  {
    key: "locations",
    title: "Location",
    items: ["Remote", "Hybrid", "Bengaluru", "Delhi", "Mumbai", "Hyderabad", "Pune"],
  },
];

export default function Filter({ filters, onChange, onReset }) {
  const toggle = (key, value) => {
    const values = filters[key].includes(value)
      ? filters[key].filter((item) => item !== value)
      : [...filters[key], value];
    onChange({ ...filters, [key]: values });
  };

  return (
    <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.04)]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Filters</h2>
        <button onClick={onReset} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
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
                  checked={filters[group.key].includes(item)}
                  onChange={() => toggle(group.key, item)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">Experience</h3>
        <select value={filters.experience} onChange={(event) => onChange({ ...filters, experience: event.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
          <option value="">Any experience</option>
          <option value="0">Fresher</option>
          <option value="1-3">1-3 years</option>
          <option value="3-5">3-5 years</option>
          <option value="5+">5+ years</option>
        </select>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4">
        <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700"><span>Maximum salary</span><span>₹{filters.maxSalary / 100000} LPA</span></div>
        <input type="range" min="500000" max="3000000" step="100000" value={filters.maxSalary} onChange={(event) => onChange({ ...filters, maxSalary: Number(event.target.value) })} className="w-full accent-blue-600" />
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>₹5 LPA</span>
          <span>₹30 LPA</span>
        </div>
      </div>
    </aside>
  );
}
