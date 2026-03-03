import React,{useState,useEffect,useMemo} from 'react';
import Pagination from "../../../components/ui/pagination";
import type { AssetsTableProps } from './Types';
import Button from '../../../components/ui/button';
import TableFilterBar from '../../../components/ui/tablefilter-bar';
import {Pencil,TrashIcon} from 'lucide-react'

type StatusFilter =
  | "ALL"
  | "TERSEDIA"
  | "TIDAK_TERSEDIA"
  | "MAINTENANCE"
  | "DIPINJAM"
  | "DIPAKAI"
  | "DISEWA";

type ConditionFilter = "ALL" | "BAIK" | "RUSAK";


const Table: React.FC<AssetsTableProps> = ({
  data,
  onEdit,
  onDelete,
}) => {
  const statusStyle: Record<string, string> = {
   TERSEDIA: "bg-emerald-100 text-emerald-700",
  "TIDAK_TERSEDIA": "bg-rose-100 text-rose-700",
  "MAINTENANCE": "bg-amber-100 text-amber-700",
  "DIPINJAM": "bg-blue-100 text-blue-700",
  "DIPAKAI": "bg-purple-100 text-purple-700",
  "DISEWA": "bg-indigo-100 text-indigo-700",
};

  const conditionStyle: Record<string, string> = {
  BAIK: "bg-green-100 text-green-700",
  "RUSAK": "bg-red-100 text-red-700",
  // "DI MAINTENANCE": "bg-yellow-100 text-yellow-700",
};
  // pagination state
      const [page, setPage] = useState(1);
      const [pageSize, setPageSize] = useState(10);
    
      // reset page saat data berubah (misal search)
      useEffect(() => {
        setPage(1);
      }, [data]);
      


const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
const [conditionFilter, setConditionFilter] = useState<ConditionFilter>("ALL");
const [locationFilter, setLocationFilter] = useState<string>("ALL");

const locationOptions = useMemo(() => {
  const map = new Map<string, string>();
  (data ?? []).forEach((x: any) => {
    const id = String(x.location?.id_location ?? x.location?.id ?? x.location?.name ?? "");
    const name = x.location?.name ?? "-";
    if (id) map.set(id, name);
  });
  return [{ value: "ALL", label: "Semua" }].concat(
    Array.from(map.entries()).map(([id, name]) => ({ value: id, label: name }))
  );
}, [data]);

const filteredData = useMemo(() => {
  return (data ?? []).filter((x: any) => {
    const derivedStatus = x.quantity === 0 ? "TIDAK_TERSEDIA" : (x.status as StatusFilter)
    // const okStatus = statusFilter === "ALL" ? true : x.status === statusFilter;
    const okStatus = statusFilter === "ALL" ? true : derivedStatus === statusFilter;
    const okCond = conditionFilter === "ALL" ? true : x.condition === conditionFilter;
    const locId = String(x.location?.id_location ?? x.location?.id ?? "");
    const locName = String(x.location?.name ?? "");
    const okLoc =
      locationFilter === "ALL" ? true : locId === locationFilter || locName === locationFilter;

    return okStatus && okCond && okLoc;
  });
}, [data, statusFilter, conditionFilter, locationFilter]);

  const total = filteredData.length;

const totalPages = Math.max(1, Math.ceil(total / pageSize));
useEffect(() => {
  if (page > totalPages) setPage(totalPages);
}, [page, totalPages]);

const pageData = useMemo(() => {
  const start = (page - 1) * pageSize;
  return (filteredData ?? []).slice(start, start + pageSize);
}, [filteredData, page, pageSize]);

// const startIndex = (page - 1) * pageSize; // untuk nomor urut...belh

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
           <TableFilterBar
  fields={[
    {
      key: "status",
      label: "Status",
      value: statusFilter,
      onChange: (v) => setStatusFilter(v as StatusFilter),
      options: [
        { value: "ALL", label: "Semua" },
        { value: "TERSEDIA", label: "TERSEDIA" },
        { value: "TIDAK_TERSEDIA", label: "TIDAK_TERSEDIA" },
        { value: "MAINTENANCE", label: "MAINTENANCE" },
        { value: "DIPINJAM", label: "DIPINJAM" },
        { value: "DIPAKAI", label: "DIPAKAI" },
        { value: "DISEWA", label: "DISEWA" },
      ],
    },
    {
      key: "condition",
      label: "Condition",
      value: conditionFilter,
      onChange: (v) => setConditionFilter(v as ConditionFilter),
      options: [
        { value: "ALL", label: "Semua" },
        { value: "BAIK", label: "BAIK" },
        { value: "RUSAK", label: "RUSAK" },
      ],
    },
    {
      key: "location",
      label: "Lokasi",
      value: locationFilter,
      onChange: setLocationFilter,
      options: locationOptions,
    },
  ]}
  onReset={() => {
    setStatusFilter("ALL");
    setConditionFilter("ALL");
    setLocationFilter("ALL");
  }}
  rightSlot={
    // optional: tambah tombol add/export dll
    null
  }
/>
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
                  <th className="w-[15%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No.
                </th>
                <th className="w-[40%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Asset
                </th>
                <th className="w-[40%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kode Asset
                </th>
                   <th className="w-[40%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lokasi asset
                </th>
                 <th className="w-[40%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  quantitas
                </th>
                 <th className="w-[40%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  condition
                </th>
                <th className="w-[40%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  status
                </th>
             
                  <th className="w-[40%] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                    key={loc.id_asset_stock}
                    className="hover:bg-gray-50 transition-colors"
                  >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {i + 1}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {loc.asset.asset_name}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {loc.asset.asset_code}
                    </td>
                     <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {loc.location.name}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {loc.quantity}
                    </td>

                     <td className="px-6 py-4 text-sm font-medium">
  <span
  className={`px-3 py-1 rounded-full text-xs font-semibold ${
    conditionStyle[loc.condition] || "bg-gray-100 text-gray-700"
  }`}
>
  {loc.condition}
</span>
</td>
   <td className="px-6 py-4 text-sm font-medium">
 
  <span
  className={`px-3 py-1 rounded-full text-xs font-semibold ${
    statusStyle[loc.status] || "bg-gray-100 text-gray-700"
  }`}
>
  {loc.quantity === 0 ?  "TIDAK TERSEDIA" : loc.status}
</span>
</td> 
                   <td className="px-6 py-4 text-sm font-medium">
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      loc.asset.is_rentable
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {loc.asset.is_rentable ? "Ya" : "Tidak"}
  </span>
</td>

                    <td className="px-6 py-4 text-right flex justify-space  text-sm font-medium">
                     
                   {(loc.status === "TERSEDIA" 
    || loc.quantity === 0
  ) && (
    <>
      <Button
        variant="primary"
        onClick={() => onEdit(loc)}
        className="mr-2"
      >
        <Pencil className="w-4 h-4 mr-2" />
      </Button>

      <Button
        variant="danger"
        onClick={() => onDelete(loc.id_asset_stock)}
      >
        <TrashIcon className="w-4 h-4 mr-2" />
      </Button>
    </>
  )}
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
