import React from "react";

export type FilterOption = { value: string; label: string };

export type FilterField = {
  key: string;              // contoh: "status" | "condition" | "location"
  label: string;            // label di UI
  value: string;            // nilai terpilih
  options: FilterOption[];  // dropdown options
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

type Props = {
  fields: FilterField[];
  onReset?: () => void;
  resetText?: string;
  className?: string;
  rightSlot?: React.ReactNode; // misal tombol add/export, dll
};

export default function TableFilterBar({
  fields,
  onReset,
  resetText = "Reset Filter",
  className = "",
  rightSlot,
}: Props) {
  return (
    <div className={` rounded-lg  ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        {/* Left: filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:flex-wrap">
          {fields.map((f) => (
            <div key={f.key} className={`flex items-center gap-2 ${f.className ?? ""}`}>
              <div className="text-sm font-medium text-gray-700 whitespace-nowrap">
                {f.label}
              </div>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white"
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                disabled={f.disabled}
              >
                {f.options.map((opt) => (
                  <option key={`${f.key}-${opt.value}`} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 sm:justify-end">
          {rightSlot}
          {onReset && (
            <button
              type="button"
              className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 text-gray-700"
              onClick={onReset}
            >
              {resetText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}