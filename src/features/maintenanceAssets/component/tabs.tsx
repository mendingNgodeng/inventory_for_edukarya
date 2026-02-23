import React from "react";

type TabKey = "STOCK" | "ACTIVE" | "RETURNED";

export default function Tabs({
  active,
  onChange,
  counts,
}: {
  active: TabKey;
  onChange: (t: TabKey) => void;
  counts: { stock: number; active: number; returned: number };
}) {
  const btn = (key: TabKey, label: string, count: number) => {
    const isActive = active === key;
    return (
      <button
        type="button"
        onClick={() => onChange(key)}
        className={[
          "px-4 py-2 rounded-lg text-sm font-semibold border transition",
          isActive
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
        ].join(" ")}
      >
        {label} <span className={isActive ? "opacity-90" : "text-gray-500"}>({count})</span>
      </button>
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {btn("STOCK", "Stock", counts.stock)}
      {btn("ACTIVE", "Maintenance", counts.active)}
      {btn("RETURNED", "Dikembalikan", counts.returned)}
    </div>
  );
}