import type { TabKey } from "../Types";

export default function Tabs({
  active,
  onChange,
  role,
  counts,
}: {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  role?: "ADMIN" | "KARYAWAN" | "BOS";
  counts: {
    stock: number;
    approval: number;
    active: number;
    own: number;
    returned: number;
  };
}) {
  const canApprove = role === "ADMIN" || role === "BOS";
  const canSeeActive = role === "ADMIN" || role === "BOS";

  const tabs: { key: TabKey; label: string; count: number; show: boolean }[] = [
    {
      key: "STOCK",
      label: "Stock",
      count: counts.stock,
      show: true,
    },
    {
      key: "APPROVAL",
      label: "Menunggu Approval",
      count: counts.approval,
      show: canApprove,
    },
    {
      key: "ACTIVE",
      label: "Peminjaman Aktif",
      count: counts.active,
      show: canSeeActive,
    },
    {
      key: "OWN",
      label: "Pinjaman Saya",
      count: counts.own,
      show: true,
    },
    {
      key: "RETURNED",
      label: "Riwayat",
      count: counts.returned,
      show: true,
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs
        .filter((tab) => tab.show)
        .map((tab) => {
          const isActive = active === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={[
                "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                isActive
                  ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300",
              ].join(" ")}
            >
              <span>{tab.label}</span>

         <span className={isActive ? "opacity-90" : "text-gray-500"}>({tab.count})</span>
            </button>
          );
        })}
    </div>
  );
}