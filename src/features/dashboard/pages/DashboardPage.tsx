import React from 'react';
import { Package, MapPin, Tag, TrendingUp, ArrowUp, ArrowDown, Clock, Map } from 'lucide-react';
import DashboardLayout from '../../../layouts/Dashboardlayout';

const DashboardPage: React.FC = () => {
  const stats = [
    {
      title: 'Total Aset',
      value: '2,543',
      change: '+12.5%',
      trend: 'up',
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Lokasi',
      value: '24',
      change: '+4.3%',
      trend: 'up',
      icon: MapPin,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Tipe Aset',
      value: '18',
      change: '+2.1%',
      trend: 'up',
      icon: Tag,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Aset Terpakai',
      value: '1,892',
      change: '-3.2%',
      trend: 'down',
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  const recentActivities = [
    { 
      id: 1, 
      action: 'Aset baru ditambahkan', 
      item: 'Laptop Dell XPS 13', 
      user: 'John Doe', 
      time: '5 menit yang lalu',
      avatar: 'JD',
      color: 'bg-blue-100 text-blue-600',
    },
    { 
      id: 2, 
      action: 'Lokasi diperbarui', 
      item: 'Gedung A - Lantai 3', 
      user: 'Jane Smith', 
      time: '1 jam yang lalu',
      avatar: 'JS',
      color: 'bg-green-100 text-green-600',
    },
    { 
      id: 3, 
      action: 'Kategori aset dihapus', 
      item: 'Elektronik', 
      user: 'Bob Johnson', 
      time: '3 jam yang lalu',
      avatar: 'BJ',
      color: 'bg-red-100 text-red-600',
    },
    { 
      id: 4, 
      action: 'Tipe aset ditambahkan', 
      item: 'Server Rack', 
      user: 'Alice Brown', 
      time: '5 jam yang lalu',
      avatar: 'AB',
      color: 'bg-purple-100 text-purple-600',
    },
    { 
      id: 5, 
      action: 'Aset dipindahkan', 
      item: 'Printer HP ke Ruang Meeting', 
      user: 'Charlie Wilson', 
      time: '1 hari yang lalu',
      avatar: 'CW',
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  const topLocations = [
    { name: 'Gedung A - Lantai 1', count: 345, percentage: 100 },
    { name: 'Gedung B - Lantai 2', count: 278, percentage: 80 },
    { name: 'Gudang Pusat', count: 198, percentage: 57 },
    { name: 'Ruang Server', count: 156, percentage: 45 },
    { name: 'Gedung C - Lantai 1', count: 134, percentage: 39 },
  ];

  const assetCategories = [
    { category: 'Elektronik', count: 1234, percentage: 48 },
    { category: 'Furniture', count: 567, percentage: 22 },
    { category: 'Kendaraan', count: 345, percentage: 14 },
    { category: 'Peralatan Kantor', count: 234, percentage: 9 },
    { category: 'Lainnya', count: 163, percentage: 7 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header dengan Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Inventaris</h1>
            <p className="text-gray-500 mt-2 text-base">
              Selamat datang kembali! Berikut ringkasan inventaris Anda hari ini.
            </p>
          </div>
          
          {/* Date Filter - Desktop Only */}
          <div className="hidden md:flex items-center space-x-3 mt-4 md:mt-0">
            <span className="text-sm text-gray-500">Periode:</span>
            <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Hari Ini</option>
              <option>Minggu Ini</option>
              <option>Bulan Ini</option>
              <option>Tahun Ini</option>
            </select>
          </div>
        </div>

        {/* Stats Cards - Grid lebih proporsional untuk desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 
                       hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    stat.trend === 'up' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {stat.change}
                  {stat.trend === 'up' ? (
                    <ArrowUp className="w-3 h-3 ml-1" />
                  ) : (
                    <ArrowDown className="w-3 h-3 ml-1" />
                  )}
                </span>
              </div>
              
              <div className="mt-4">
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
              </div>
              
              {/* Sparkline/mini graph (dekoratif) */}
              <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${stat.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.random() * 60 + 20}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Main Content - Grid 2 kolom untuk desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities - Lebar 2 kolom di desktop */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                    Aktivitas Terbaru
                  </h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Lihat Semua
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center flex-shrink-0 font-semibold text-sm`}>
                        {activity.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{activity.item}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-400">
                          <span className="font-medium text-gray-600">{activity.user}</span>
                          <span className="mx-2">•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Statistik tambahan */}
          <div className="space-y-6">
            {/* Top Locations Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-green-500" />
                    Lokasi Teratas
                  </h2>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {topLocations.map((location, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{location.name}</span>
                      <span className="text-sm text-gray-500">{location.count} aset</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${location.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Asset Categories Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Tag className="w-5 h-5 mr-2 text-purple-500" />
                    Kategori Aset
                  </h2>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {assetCategories.map((category, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{category.category}</span>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Stats - Desktop Only */}
        <div className="hidden lg:grid grid-cols-4 gap-6 pt-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4">
            <p className="text-sm text-blue-600 font-medium">Total Nilai Aset</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">Rp 2.5M</p>
            <p className="text-xs text-blue-500 mt-1">+15% dari bulan lalu</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4">
            <p className="text-sm text-green-600 font-medium">Aset Tersedia</p>
            <p className="text-2xl font-bold text-green-700 mt-1">651</p>
            <p className="text-xs text-green-500 mt-1">25% dari total</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4">
            <p className="text-sm text-purple-600 font-medium">Dalam Perbaikan</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">23</p>
            <p className="text-xs text-purple-500 mt-1">-2 dari kemarin</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4">
            <p className="text-sm text-orange-600 font-medium">Aset Dipinjam</p>
            <p className="text-2xl font-bold text-orange-700 mt-1">89</p>
            <p className="text-xs text-orange-500 mt-1">+12 dari kemarin</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;