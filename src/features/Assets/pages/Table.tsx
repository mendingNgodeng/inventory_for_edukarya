import React,{useState,useEffect,useMemo} from 'react';
import Pagination from "../../../components/ui/pagination";
import type { AssetsTableProps } from './Types';
import Button from '../../../components/ui/button';
import {Pencil,TrashIcon} from 'lucide-react'

const Table: React.FC<AssetsTableProps> = ({
  data,
  onEdit,
  onDelete,
}) => {
  // pagination state
      const [page, setPage] = useState(1);
      const [pageSize, setPageSize] = useState(10);
    
      // reset page saat data berubah (misal search)
      useEffect(() => {
        setPage(1);
      }, [data]);
  const total = data.length;

const totalPages = Math.max(1, Math.ceil(total / pageSize));

useEffect(() => {
  if (page > totalPages) setPage(totalPages);
}, [page, totalPages]);

const pageData = useMemo(() => {
  const start = (page - 1) * pageSize;
  return (data ?? []).slice(start, start + pageSize);
}, [data, page, pageSize]);


  const EmptyState = () => (
    <tr>
      <td colSpan={8} className="px-6 py-10 text-center">
        <div className="flex flex-col items-center">
          <svg
            className="w-12 h-12 text-gray-300 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 7h18M3 12h18M3 17h18"
            />
          </svg>
          <p className="text-gray-500 font-medium">Tidak Aset</p>
          <p className="text-gray-400 text-sm mt-1">
            Data Aset belum tersedia
          </p>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h2 className="text-base font-semibold text-gray-800">
              Data Aset
            </h2>
          </div>

          <span className="text-sm text-gray-500">
            Total:{" "}
            <span className="font-medium text-gray-700">
              {total}
            </span>
          </span>
        </div>
      </div>

      {/* Table Container (fixed height) */}
      <div className="relative h-[450px]">
        <div className="h-full overflow-auto">
          <table className="w-full divide-y divide-gray-200 min-w-[600px] table-fixed">
            
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                  <th className="w-[40%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No.
                </th>
                <th className="w-[40%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Asset
                </th>
                <th className="w-[40%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kode Asset
                </th>
                 <th className="w-[40%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipe Aset
                </th>
                 <th className="w-[40%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategory
                </th>
                     <th className="w-[40%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga Aset (Per unit)
                </th>
                                     <th className="w-[40%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga Sewa per-hari
                </th>
                  <th className="w-[40%] px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disewa
                </th>
                <th className="w-[40%] px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {pageData.length > 0 ? (
                pageData.map((loc,i) => (
                  <tr
                    key={loc.id_assets}
                    className="hover:bg-gray-50 transition-colors"
                  >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {i + 1}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {loc.asset_name}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {loc.asset_code}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {loc.type?.name ?? "updated"}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {loc.category?.name ?? "updated" }
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500 truncate">
                      {loc.purchase_price ?? 0}
                    </td>
                    
                    <td className="px-6 py-4 text-sm text-gray-500 truncate">
                      {loc.rental_price ?? 0}
                    </td>


                   <td className="px-6 py-4 text-sm font-medium">
  <span
    className={`px-3 py-1 rounded-full text-center text-xs font-semibold ${
      loc.is_rentable
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {loc.is_rentable ? "Ya" : "Tidak"}
  </span>
</td>

                    <td className="px-6 py-4 text-right flex justify-space text-sm font-medium">
                      <Button
                      
                        variant="primary"
                        onClick={() => onEdit(loc)}
                        className="mr-2"
                      >
                          <Pencil className="w-4 h-4 mr-2" />
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() => onDelete(loc.id_assets)}
                      >
                        <TrashIcon className="w-4 h-4 mr-2" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyState />
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
      </div>

      {/* Footer */}
        <div className="border-t border-gray-200 bg-white">
                      <Pagination
                        page={page}
                        pageSize={pageSize}
                        total={total}
                        onPageChange={setPage}
                        onPageSizeChange={(s: number) => {
                          setPageSize(s);
                          setPage(1);
                        }}
                        pageSizeOptions={[5, 10, 20, 50]}
                      />
                    </div>
    </div>
  );
};

export default Table;
