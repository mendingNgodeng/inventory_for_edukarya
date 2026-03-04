import React, { useMemo } from "react";
import type { DashboardSummary, BorrowSummary, RentalSummary } from "../../../api/statistic/types"; // sesuaikan path

function formatNumber(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

type Props = {
  summary: DashboardSummary;
  borrowSummary: BorrowSummary | null;
  rentalSummary: RentalSummary | null;
};

const FooterStats: React.FC<Props> = ({ summary, borrowSummary, rentalSummary }) => {
  // dari summary lama
  const maintenanceQty = summary.total_maintenance_asset ?? 0;

  // dari borrow summary baru
  const dipinjamQty = borrowSummary?.dipinjam_aktif?.total_qty ?? 0;
  const dipakaiQty = borrowSummary?.dipakai_aktif?.total_qty ?? 0;


  // “tersedia” belum ada endpoint khusus, jadi kita tampilkan info yang memang valid sekarang:
  // - total asset overall (summary.total_asset)
  // - dipinjam
  // - maintenance
  // - revenue bulan ini (rental summary)
  const revenueMonth = rentalSummary?.revenue_month ?? 0;

  const monthLabel = useMemo(() => {
    const iso = rentalSummary?.month_start;
    if (!iso) return "bulan ini";
    const d = new Date(iso);
    return d.toLocaleString("id-ID", { month: "long", year: "numeric" });
  }, [rentalSummary?.month_start]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
      {/* Revenue Rental bulan ini */}
      <div className="bg-blue-50 rounded-xl p-4">
        <p className="text-sm text-blue-600">Revenue Rental ({monthLabel})</p>
        <p className="text-2xl font-bold text-blue-700 mt-1">
          {formatRupiah(revenueMonth)}
        </p>
      </div>

      {/* Total Asset Stock (sum quantity semua) */}
      {/* <div className="bg-green-50 rounded-xl p-4">
        <p className="text-sm text-green-600">Total Stock Aset</p>
        <p className="text-2xl font-bold text-green-700 mt-1">
          {formatNumber(summary.total_asset ?? 0)}
        </p>
      </div> */}

      {/* Maintenance */}
      <div className="bg-purple-50 rounded-xl p-4">
        <p className="text-sm text-purple-600">Dalam Perbaikan</p>
        <p className="text-2xl font-bold text-purple-700 mt-1">
          {formatNumber(maintenanceQty)}
        </p>
      </div>

      {/* Dipinjam + Terlambat */}
      <div className="bg-orange-50 rounded-xl p-4">
        <p className="text-sm text-orange-600">Aset Dipinjam</p>
        <p className="text-2xl font-bold text-orange-700 mt-1">
          {formatNumber(dipinjamQty)}
        </p>

        {/* kecilin info terlambat biar kebaca */}
      
      </div>
        <div className="bg-orange-50 rounded-xl p-4">
        <p className="text-sm text-orange-600">Aset Dipakai</p>
        <p className="text-2xl font-bold text-orange-700 mt-1">
          {formatNumber(dipakaiQty)}
        </p>

        {/* kecilin info terlambat biar kebaca */}
      
      </div>
    </div>
  );
};

export default FooterStats;