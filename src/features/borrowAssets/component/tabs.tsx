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
        .map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium ${
              active === tab.key
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab.label}{" "}
            <span
              className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                active === tab.key
                  ? "bg-white text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
    </div>
  );
}