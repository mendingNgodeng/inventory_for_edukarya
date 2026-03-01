import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Button from "../../../components/ui/button";
import Alert from "../../../components/ui/alert";
import Pagination from "../../../components/ui/pagination";

import CustomerRentalCard from "../components/CustomerRentalCard";
import FinishRentalModal from "../components/FinishRentalModal";

export default function RentalByCustomerTab({
  rentals,
  finishRental,
  cancelRental,
  afterAction,
  searchTerm,
}: {
  rentals: any[];
  finishRental: (id: number, payload: { image_after_rental: string }) => Promise<void>;
  cancelRental: (id: number) => Promise<void>;
  afterAction: () => Promise<void>;
  searchTerm: string;
}) {
  // customer terpilih
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  // modal finish
  const [selectedRental, setSelectedRental] = useState<any | null>(null);
  const [openFinish, setOpenFinish] = useState(false);

  // alert cancel per row
  const [cancelTarget, setCancelTarget] = useState<any | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // pagination state (untuk table detail)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 
  const [cardPage,setCardPage] = useState(1)
  const [cardPageSize,setCardPageSize] = useState(9)

  // 1) ambil rental aktif + search
  const activeRentals = useMemo(() => {
    const base = (rentals ?? []).filter((r: any) => r.status === "AKTIF");

    const term = (searchTerm ?? "").toLowerCase().trim();
    if (!term) return base;

    return base.filter((r: any) => {
      const assetName = r.assetStock?.asset?.asset_name?.toLowerCase?.() ?? "";
      const assetCode = r.assetStock?.asset?.asset_code?.toLowerCase?.() ?? "";
      const custName = r.customer?.name?.toLowerCase?.() ?? "";
      const custPhone = r.customer?.phone?.toLowerCase?.() ?? "";
      return (
        assetName.includes(term) ||
        assetCode.includes(term) ||
        custName.includes(term) ||
        custPhone.includes(term)
      );
    });
  }, [rentals, searchTerm]);

  // 2) group by customer untuk card list
  const customerCards = useMemo(() => {
    const map = new Map<number, { id: number; name: string; phone: string; items: number; qty: number }>();

    for (const r of activeRentals) {
      const id = Number(r.id_rental_customer ?? r.customer?.id_rental_customer);
      if (!id) continue;

      const name = r.customer?.name ?? "-";
      const phone = r.customer?.phone ?? "-";

      const prev = map.get(id) ?? { id, name, phone, items: 0, qty: 0 };
      prev.items += 1;
      prev.qty += Number(r.quantity ?? 0);
      map.set(id, prev);
    }

    return Array.from(map.values());
  }, [activeRentals]);

  // 3) table data berdasarkan customer terpilih
  const selectedCustomerRentals = useMemo(() => {
    if (!selectedCustomerId) return [];
    return activeRentals.filter((r: any) => Number(r.id_rental_customer) === selectedCustomerId);
  }, [activeRentals, selectedCustomerId]);

  const selectedCustomerMeta = useMemo(() => {
    if (!selectedCustomerId) return null;
    return customerCards.find((c) => c.id === selectedCustomerId) ?? null;
  }, [customerCards, selectedCustomerId]);

  // reset page saat ganti customer / hasil data berubah / pageSize berubah
  useEffect(() => {
    setPage(1);
  }, [selectedCustomerId, searchTerm, pageSize]);

  // pagination computed (HARUS pakai selectedCustomerRentals)
  const total = selectedCustomerRentals.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return selectedCustomerRentals.slice(start, start + pageSize);
  }, [selectedCustomerRentals, page, pageSize]);

  if (!activeRentals.length) {
    return <div className="text-sm text-gray-600">Tidak ada rental yang sedang aktif.</div>;
  }

  useEffect(() => {
    setCardPage(1);
  }, [searchTerm, activeRentals.length]);
const cardTotal = customerCards.length;
  const cardTotalPages = Math.max(1, Math.ceil(cardTotal / cardPageSize));

  useEffect(() => {
    if (cardPage > cardTotalPages) setCardPage(cardTotalPages);
  }, [cardPage, cardTotalPages]);

  const cardPageData = useMemo(() => {
    const start = (cardPage - 1) * cardPageSize;
    return customerCards.slice(start, start + cardPageSize);
  }, [customerCards, cardPage, cardPageSize]);
  return (
    <div className="space-y-4">
      {/* HEADER ACTIONS */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {selectedCustomerId && selectedCustomerMeta ? (
            <>
              Menampilkan rental aktif untuk{" "}
              <span className="font-semibold text-gray-900">
                {selectedCustomerMeta.name} ({selectedCustomerMeta.phone})
              </span>
            </>
          ) : (
            "Pilih customer untuk melihat detail rental."
          )}
        </div>

        {selectedCustomerId ? (
          <Button
            type="button"
            variant="outline_blue"
            onClick={() => {
              setSelectedCustomerId(null);
              setSelectedRental(null);
              setOpenFinish(false);
              setPage(1);
            }}
          >
            Lihat semua
          </Button>
        ) : null}
      </div>

  

      {/* TABLE DETAIL (tampil saat pilih customer) */}
      {selectedCustomerId && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50">
            <div className="font-semibold text-gray-900">Daftar barang yang sedang dirental</div>
            <div className="text-sm text-gray-600">
              Total item: <span className="font-medium">{total}</span>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-white">
                <tr className="text-gray-700 border-b">
                  <th className="px-4 py-2 text-left">Asset</th>
                  <th className="px-4 py-2 text-left">Qty</th>
                  <th className="px-4 py-2 text-left">Periode</th>
                  <th className="px-4 py-2 text-right">Aksi</th>
                </tr>
              </thead>

              <tbody className="text-gray-700">
                {pageData.map((r: any) => (
                  <tr key={r.id_asset_rental} className="border-b last:border-b-0">
                    <td className="px-4 py-2">
                      {r.assetStock?.asset?.asset_name ?? "-"} ({r.assetStock?.asset?.asset_code ?? "-"})
                    </td>

                    <td className="px-4 py-2">{r.quantity}</td>

                    <td className="px-4 py-2">
                      {new Date(r.rental_start).toLocaleString()} → {new Date(r.rental_end).toLocaleString()}
                    </td>

                    <td className="px-4 py-2">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline_blue"
                          type="button"
                          onClick={() => {
                            setSelectedRental(r);
                            setOpenFinish(true);
                          }}
                        >
                          Selesaikan
                        </Button>

                        <Button variant="danger" type="button" onClick={() => setCancelTarget(r)}>
                          Batalkan
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}

                {total === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                      Tidak ada rental aktif untuk customer ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
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

      {/* FINISH MODAL */}
      <FinishRentalModal
        isOpen={openFinish}
        onClose={() => setOpenFinish(false)}
        rental={selectedRental}
        onSubmit={async (payload) => {
          if (!selectedRental) return;
          await finishRental(selectedRental.id_asset_rental, payload);
          await afterAction();
          toast.success("Rental selesai");
          setOpenFinish(false);
        }}
      />

      {/* CANCEL ALERT */}
      <Alert
        open={!!cancelTarget}
        title="Batalkan Rental?"
        description={
          cancelTarget
            ? `Rental untuk ${cancelTarget.assetStock?.asset?.asset_name ?? "-"} (${cancelTarget.assetStock?.asset?.asset_code ?? "-"}) akan dibatalkan. Aksi ini tidak dapat dibatalkan.`
            : ""
        }
        confirmText="Ya, Batalkan"
        cancelText="Kembali"
        loading={cancelLoading}
        onCancel={() => setCancelTarget(null)}
        onConfirm={async () => {
          if (!cancelTarget) return;
          try {
            setCancelLoading(true);
            await cancelRental(cancelTarget.id_asset_rental);
            await afterAction();
            toast.success("Rental berhasil dibatalkan");
            setCancelTarget(null);
          } catch (e: any) {
            toast.error(e?.message || "Gagal membatalkan rental");
          } finally {
            setCancelLoading(false);
          }
        }}
      />

      {!selectedCustomerId && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cardPageData.map((c) => (
              <CustomerRentalCard
                key={c.id}
                name={c.name}
                phone={c.phone}
                totalActiveItems={c.items}
                totalActiveQty={c.qty}
                onSelect={() => setSelectedCustomerId(c.id)}
              />
            ))}
          </div>

          {/* PAGINATION CARD */}
      {/* CARD LIST (hanya tampil saat belum pilih customer) */}
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
    </div>
  );
}