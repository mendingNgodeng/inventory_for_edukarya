import { Clock } from "lucide-react";

const RecentActivities = () => {
  const activities = [
    { id: 1, action: "Aset baru ditambahkan", item: "Laptop Dell XPS 13" },
    { id: 2, action: "Lokasi diperbarui", item: "Gedung A - Lantai 3" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold flex items-center text-black">
          <Clock className="w-5 h-5 mr-2 text-blue-500" />
          Aktivitas Terbaru
        </h2>
      </div>

      <div className="p-6 space-y-4">
        {activities.map((a) => (
          <div key={a.id}>
            <p className="text-sm font-medium text-gray-700">{a.action}</p>
            <p className="text-sm text-gray-500">{a.item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;
