import { useMemo, useState } from "react";
import { toast } from "sonner";
import Button from "../../../components/ui/button";
import Alert from "../../../components/ui/alert";

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
      return assetName.includes(term) || assetCode.includes(term) || custName.includes(term) || custPhone.includes(term);
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

  if (!activeRentals.length) {
    return <div className="text-sm text-gray-600">Tidak ada rental yang sedang aktif.</div>;
  }

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
            }}
          >
            Lihat semua
          </Button>
        ) : null}
      </div>

      {/* CARD LIST (hanya tampil saat belum pilih customer) */}
      {!selectedCustomerId && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {customerCards.map((c) => (
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
      )}

      {/* TABLE DETAIL (tampil saat pilih customer) */}
      {selectedCustomerId && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50">
            <div className="font-semibold text-gray-900">Daftar barang yang sedang dirental</div>
            <div className="text-sm text-gray-600">
              Total item: <span className="font-medium">{selectedCustomerRentals.length}</span>
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
                {selectedCustomerRentals.map((r: any) => (
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

                        <Button
                          variant="danger"
                          type="button"
                          onClick={() => setCancelTarget(r)}
                        >
                          Batalkan
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {selectedCustomerRentals.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                      Tidak ada rental aktif untuk customer ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FINISH MODAL (tetap pakai komponen kamu) */}
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
    </div>
  );
}