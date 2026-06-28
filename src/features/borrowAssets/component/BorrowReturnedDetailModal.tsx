import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/button";

type AnyRow = any;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  row: AnyRow | null;
}

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("id-ID");
};

const getStatusBadgeClass = (status?: string) => {
  if (status === "DIKEMBALIKAN") {
    return "bg-green-100 text-green-700";
  }

  if (status === "DITOLAK") {
    return "bg-red-100 text-red-700";
  }

  if (status === "TERLAMBAT") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-gray-100 text-gray-700";
};

export default function BorrowReturnedDetailModal({
  isOpen,
  onClose,
  row,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Riwayat Peminjaman"
      size="lg"
      footer={
        <div className="flex justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Tutup
          </Button>
        </div>
      }
    >
      {!row ? (
        <div className="text-sm text-gray-600">Data tidak ditemukan.</div>
      ) : (
        <div className="space-y-4 text-sm text-gray-700">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="text-xs font-medium uppercase text-gray-500">
              Asset
            </div>

            <div className="mt-1 text-base font-semibold text-gray-900">
              {row.assetStock?.asset?.asset_name ?? "-"}{" "}
              <span className="text-gray-500">
                ({row.assetStock?.asset?.asset_code ?? "-"})
              </span>
            </div>

            <div className="mt-2 text-sm text-gray-600">
              Lokasi:{" "}
              <span className="font-medium text-gray-800">
                {row.assetStock?.location?.name ?? "-"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-3">
              <div className="text-xs text-gray-500">User / Peminjam</div>
              <div className="font-semibold text-gray-900">
                {row.status === "DIPAKAI"
                  ? "Dipakai Kantor"
                  : row.user?.name ?? row.id_user ?? "-"}
              </div>

              <div className="text-sm text-gray-600">
                Jabatan: {row.user?.jabatan ?? "-"}
              </div>

              <div className="text-sm text-gray-600">
                No HP: {row.user?.no_hp ?? "-"}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-3">
              <div className="text-xs text-gray-500">Status</div>

              <div className="mt-1">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(
                    row.status
                  )}`}
                >
                  {row.status}
                </span>
              </div>

              <div className="mt-2 text-sm text-gray-600">
                Qty:{" "}
                <span className="font-semibold text-gray-900">
                  {row.quantity}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-3">
              <div className="text-xs text-gray-500">Tanggal Pinjam</div>
              <div className="font-medium text-gray-900">
                {formatDateTime(row.borrowed_date)}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-3">
              <div className="text-xs text-gray-500">Tanggal Kembali</div>
              <div className="font-medium text-gray-900">
                {formatDateTime(row.returned_date)}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-3">
              <div className="text-xs text-gray-500">Batas Pengembalian</div>
              <div className="font-medium text-gray-900">
                {formatDateTime(row.due_date)}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-3">
              <div className="text-xs text-gray-500">Telat</div>
              <div className="font-medium text-gray-900">
                {row.late_days ?? 0} hari
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-2 text-sm font-semibold text-gray-900">
              Foto Pengembalian
            </div>

            {row.image_after_return ? (
              <img
                src={row.image_after_return}
                alt="Foto pengembalian asset"
                className="max-h-96 w-full rounded-lg border bg-white object-contain"
              />
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                Belum ada foto pengembalian.
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}