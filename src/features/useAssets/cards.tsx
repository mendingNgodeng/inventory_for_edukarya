import React, { useMemo } from "react";
import Button from "../../components/ui/button";
import { Hand } from "lucide-react";
import type { CardsProps } from "./Types";

const statusStyle: Record<string, string> = {
  TERSEDIA: "bg-green-100 text-green-700",
  TIDAK_TERSEDIA: "bg-red-100 text-red-700",
};

const conditionStyle: Record<string, string> = {
  BAIK: "bg-green-100 text-green-700",
  RUSAK: "bg-red-100 text-red-700",
};

const ALLOWED_STATUSES = new Set(["TERSEDIA", "TIDAK_TERSEDIA"]);

const Cards: React.FC<CardsProps> = ({ data, onBorrow }) => {
  const filtered = useMemo(
    () => data.filter((x) => ALLOWED_STATUSES.has(x.status)),
    [data]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {filtered.map((loc) => {
        const canBorrow =
          loc.status === "TERSEDIA" && loc.condition === "BAIK" && loc.quantity > 0;

        return (
          <div
            key={loc.id_asset_stock}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-base font-semibold text-gray-900 truncate">
                  {loc.asset?.asset_name ?? "-"}
                </div>
                <div className="text-sm text-gray-500">
                  {loc.asset?.asset_code ?? "-"} • {loc.location?.name ?? "-"}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-500">Qty</div>
                <div className="text-lg font-bold text-gray-900">{loc.quantity}</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  conditionStyle[loc.condition] || "bg-gray-100 text-gray-700"
                }`}
              >
                {loc.condition}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  statusStyle[loc.status] || "bg-gray-100 text-gray-700"
                }`}
              >
                {loc.status}
              </span>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                variant="outline_blue"
                className="w-full"
                onClick={() => onBorrow(loc)}
                disabled={!canBorrow}
                title={
                  !canBorrow
                    ? "Hanya bisa dipakai jika BAIK, TERSEDIA, dan quantity > 0"
                    : ""
                }
              >
                <Hand className="w-4 h-4 mr-2" />
                Pakai
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Cards;