import React, {useEffect,useState,useMemo}from 'react';
import type { TableProps } from './Types';
import Button from '../../../components/ui/button';
import {Pencil,TrashIcon} from 'lucide-react'
import Pagination from "../../../components/ui/pagination";

const Table: React.FC<TableProps> = ({
  data,
  onEdit,
  onDelete,
}) => {
   // pagination state
       const [page, setPage] = useState(1);
       const [pageSize, setPageSize] = useState(10);
     
   const safeData = useMemo(() => (Array.isArray(data) ? data : []).filter(Boolean), [data]);

useEffect(() => {
  setPage(1);
}, [safeData]);

const total = safeData.length;

const totalPages = Math.max(1, Math.ceil(total / pageSize));

useEffect(() => {
  if (page > totalPages) setPage(totalPages);
}, [page, totalPages]);

const pageData = useMemo(() => {
  const start = (page - 1) * pageSize;
  return safeData.slice(start, start + pageSize);
}, [safeData, page, pageSize]);
 
  const EmptyState = () => (
    <tr>
      <td colSpan={4} className="px-6 py-10 text-center">
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
          <p className="text-gray-500 font-medium">Tidak ada Customer Rental</p>
          <p className="text-gray-400 text-sm mt-1">
            Data Customer Rental belum tersedia
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
              Daftar Data Customer Rental
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
      <div className="">
        <div className="h-full overflow-auto">
          <table className="w-full divide-y divide-gray-200 min-w-[600px] table-fixed">
            
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="w-[40%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="w-[40%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nomor HP
                </th>
                <th className="w-[40%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                  <th className="w-[40%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Daftar pada
                </th>
                <th className="w-[20%] px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {pageData.length > 0 ? (
                pageData.map((loc) => (
                  <tr
                    key={loc.id_rental_customer}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {loc.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500 truncate">
                      {loc.phone }
                    </td>

                       <td className="px-6 py-4 text-sm text-gray-500 truncate">
                     <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      loc.pictureKtp
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {loc.pictureKtp ? "Aktif" : "Selesai Rental"}
  </span>

                    </td>
 <td className="px-6 py-4 text-sm text-gray-500 truncate">
  {new Date(loc.created_at).toLocaleString()}
                   
                    </td>
                    <td className="px-6 py-4 text-right flex justify-space  text-sm font-medium">
                      <Button
                      
                        variant="primary"
                        onClick={() => onEdit(loc)}
                        className="mr-2"
                      >
                          <Pencil className="w-4 h-4 mr-2" />
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() => onDelete(loc.id_rental_customer)}
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
        {/* <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" /> */}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
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
    </div>
  );
};

export default Table;
