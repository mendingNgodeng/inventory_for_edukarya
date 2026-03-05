// import React from "react";
import Button from "./button";

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}: {
  page: number; // 1-based
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(total, safePage * pageSize);

  const canPrev = safePage > 1;
  const canNext = safePage < totalPages;

  const go = (p: number) => onPageChange(Math.min(Math.max(1, p), totalPages));

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t bg-gray-50">
      <div className="text-xs text-gray-600">
        Menampilkan <b>{start}</b>–<b>{end}</b> dari <b>{total}</b>
      </div>

      <div className="flex items-center gap-2">
        {onPageSizeChange && (
          <select
            className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-700"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>
                {s}/hal
              </option>
            ))}
          </select>
        )}

        <Button type="button" variant="outline_blue" disabled={!canPrev} onClick={() => go(1)}>
          {"<<"}
        </Button>
        <Button type="button" variant="outline_blue" disabled={!canPrev} onClick={() => go(safePage - 1)}>
          {"<"}
        </Button>

        <span className="text-sm text-gray-700 px-2">
          {safePage} / {totalPages}
        </span>

        <Button type="button" variant="secondary" disabled={!canNext} onClick={() => go(safePage + 1)}>
          {">"}
        </Button>
        <Button type="button" variant="secondary" disabled={!canNext} onClick={() => go(totalPages)}>
          {">>"}
        </Button>
      </div>
    </div>
  );
}