// import React from "react";

export type SortOrder = "ASC" | "DESC";

export type SortOption<T extends string> = {
  value: T;
  label: string;
};

export default function TableFilters<TSortKey extends string>({
  sortBy,
  sortOrder,
  sortOptions,
  onChangeSortBy,
  onChangeSortOrder,
  className = "",
  label = "Urutkan",
}: {
  sortBy: TSortKey;
  sortOrder: SortOrder;
  sortOptions: SortOption<TSortKey>[];
  onChangeSortBy: (v: TSortKey) => void;
  onChangeSortOrder: (v: SortOrder) => void;
  className?: string;
  label?: string;
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-3 ${className}`}>
      <div className="text-sm font-medium text-gray-700">{label}</div>

      <div className="flex flex-col sm:flex-row gap-2">
        <select
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white"
          value={sortBy}
          onChange={(e) => onChangeSortBy(e.target.value as TSortKey)}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white"
          value={sortOrder}
          onChange={(e) => onChangeSortOrder(e.target.value as SortOrder)}
        >
          <option value="DESC">DESC (Terbaru)</option>
          <option value="ASC">ASC (Terlama)</option>
        </select>
      </div>
    </div>
  );
}