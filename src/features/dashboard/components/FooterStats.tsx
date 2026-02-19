const FooterStats = () => {
  return (
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
      <div className="bg-blue-50 rounded-xl p-4">
        <p className="text-sm text-blue-600">Total Nilai Aset</p>
        <p className="text-2xl font-bold text-blue-700 mt-1">Rp 2.5M</p>
      </div>
      <div className="bg-green-50 rounded-xl p-4">
        <p className="text-sm text-green-600">Aset Tersedia</p>
        <p className="text-2xl font-bold text-green-700 mt-1">651</p>
      </div>
      <div className="bg-purple-50 rounded-xl p-4">
        <p className="text-sm text-purple-600">Dalam Perbaikan</p>
        <p className="text-2xl font-bold text-purple-700 mt-1">23</p>
      </div>
      <div className="bg-orange-50 rounded-xl p-4">
        <p className="text-sm text-orange-600">Aset Dipinjam</p>
        <p className="text-2xl font-bold text-orange-700 mt-1">89</p>
      </div>
    </div>
  );
};

export default FooterStats;
