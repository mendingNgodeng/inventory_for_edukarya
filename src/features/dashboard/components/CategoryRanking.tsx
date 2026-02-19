import type { CtgRankByStock } from "../../../api/statistic/types";

interface Props {
  data: CtgRankByStock[];
}

const CategoryRanking: React.FC<Props> = ({ data }) => {
  const maxStock =
    data.length > 0 ? Math.max(...data.map(c => c.total_stock)) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-black">Kategori Aset</h2>
      </div>

      <div className="p-6 space-y-4">
        {data.map((cat, i) => {
          const percentage = maxStock
            ? Math.round((cat.total_stock / maxStock) * 100)
            : 0;

          return (
            <div key={i}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">{cat.name}</span>
                <span className="text-sm text-gray-500">
                  {cat.total_stock}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryRanking;
