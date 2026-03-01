import { useEffect, useMemo, useState } from "react";
import Button from "../../../components/ui/button";
import Pagination from "../../../components/ui/pagination";
import type { BorrowActiveTableProps } from "../Types";
import UserBorrowCard from "./BorrowCard";

type AnyRow = any;

export default function BorrowActiveByUserTab({
  data,
  loading,
  onReturn,
}: BorrowActiveTableProps) {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // ✅ pagination untuk TABLE (detail user)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ✅ pagination untuk CARD (list karyawan)
  const [cardPage, setCardPage] = useState(1);
  const [cardPageSize, setCardPageSize] = useState(9); // 3 kolom x 3 baris

  // hanya status aktif (kalau mau include TERLAMBAT/DIPAKAI, ubah disini)
  const activeOnly = useMemo(
    () => (data ?? []).filter((x: AnyRow) => x.status === "DIPINJAM"),
    [data]
  );

  // group by user untuk card
  const groupedUsers = useMemo(() => {
    const map = new Map<
      number,
      {
        id: number;
        name: string;
        phone: string;
        position: string;
        items: number;
        qty: number;
      }
    >();

    for (const r of activeOnly) {
      const uid = Number(r.id_user ?? r.user?.id_user);
      if (!uid) continue;

      const name = r.user?.name ?? `User ${uid}`;
      const phone = r.user?.no_hp ?? "-";
      const position = r.user?.jabatan ?? "-";

      const prev = map.get(uid) ?? {
        id: uid,
        name,
        phone,
        position,
        items: 0,
        qty: 0,
      };

      prev.items += 1;
      prev.qty += Number(r.quantity ?? 0);

      map.set(uid, prev);
    }

    return Array.from(map.values());
  }, [activeOnly]);

  // meta user terpilih
  const selectedUserMeta = useMemo(() => {
    if (!selectedUserId) return null;
    return groupedUsers.find((u) => u.id === selectedUserId) ?? null;
  }, [groupedUsers, selectedUserId]);

  // rows untuk table (user terpilih)
  const selectedUserRows = useMemo(() => {
    if (!selectedUserId) return [];
    return activeOnly.filter(
      (r: AnyRow) => Number(r.id_user ?? r.user?.id_user) === selectedUserId
    );
  }, [activeOnly, selectedUserId]);

  // ✅ reset page TABLE saat ganti user / search / pageSize
  useEffect(() => {
    setPage(1);
  }, [selectedUserId, pageSize]);

  // ✅ reset page CARD saat data user berubah / pageSize card berubah
  useEffect(() => {
    setCardPage(1);
  }, [groupedUsers.length, cardPageSize]);

  // ===== TABLE pagination =====
  const total = selectedUserRows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return selectedUserRows.slice(start, start + pageSize);
  }, [selectedUserRows, page, pageSize]);

  // ===== CARD pagination =====
  const cardTotal = groupedUsers.length;
  const cardTotalPages = Math.max(1, Math.ceil(cardTotal / cardPageSize));

  useEffect(() => {
    if (cardPage > cardTotalPages) setCardPage(cardTotalPages);
  }, [cardPage, cardTotalPages]);

  const cardPageData = useMemo(() => {
    const start = (cardPage - 1) * cardPageSize;
    return groupedUsers.slice(start, start + cardPageSize);
  }, [groupedUsers, cardPage, cardPageSize]);

  if (loading)
    return <div className="text-sm text-gray-600">Memuat data peminjaman...</div>;

  if (!activeOnly.length)
    return (
      <div className="text-sm text-gray-600">
        Tidak ada peminjaman yang sedang berlangsung.
      </div>
    );

  return (
    <div className="space-y-4">
      {/* header actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {selectedUserId && selectedUserMeta ? (
            <>
              Menampilkan peminjaman untuk{" "}
              <span className="font-semibold text-gray-900">
                {selectedUserMeta.name} ({selectedUserMeta.phone})
              </span>
            </>
          ) : (
            "Pilih karyawan untuk melihat detail peminjaman."
          )}
        </div>

        {selectedUserId ? (
          <Button
            type="button"
            variant="outline_blue"
            onClick={() => {
              setSelectedUserId(null);
              setPage(1);
            }}
          >
            Lihat semua
          </Button>
        ) : null}
      </div>

      {/* cards list + pagination */}
      {!selectedUserId && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cardPageData.map((u) => (
              <UserBorrowCard
                key={u.id}
                name={u.name}
                phone={u.phone}
                position={u.position}
                totalItems={u.items}
                totalQty={u.qty}
                onSelect={() => setSelectedUserId(u.id)}
              />
            ))}
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <Pagination
              page={cardPage}
              pageSize={cardPageSize}
              total={cardTotal}
              onPageChange={setCardPage}
              onPageSizeChange={(s: number) => {
                setCardPageSize(s);
                setCardPage(1);
              }}
              pageSizeOptions={[6, 9, 12, 24]}
            />
          </div>
        </>
      )}

      {/* table detail */}
      {selectedUserId && (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-gray-700">
                <th className="px-4 py-2 text-left">Asset</th>
                <th className="px-4 py-2 text-left">Lokasi</th>
                <th className="px-4 py-2 text-left">Qty</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Tanggal</th>
                <th className="px-4 py-2 text-right">Aksi</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {pageData.map((r: AnyRow) => (
                <tr key={r.id_asset_borrowed} className="border-t">
                  <td className="px-4 py-2">
                    {r.assetStock?.asset?.asset_name ?? "-"} (
                    {r.assetStock?.asset?.asset_code ?? "-"})
                  </td>
                  <td className="px-4 py-2">
                    {r.assetStock?.location?.name ?? "-"}
                  </td>
                  <td className="px-4 py-2">{r.quantity}</td>
                  <td className="px-4 py-2 font-medium">{r.status}</td>
                  <td className="px-4 py-2">
                    {new Date(r.borrowed_date).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Button type="button" onClick={() => onReturn(r)}>
                      Kembalikan
                    </Button>
                  </td>
                </tr>
              ))}

              {!pageData.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    Tidak ada data untuk user ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

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
      )}
    </div>
  );
}