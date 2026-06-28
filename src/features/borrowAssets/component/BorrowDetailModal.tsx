import Button from "../../../components/ui/button";
import Modal from "../../../components/ui/Modal";

type AnyRow = any;

interface BorrowDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selected: AnyRow | null;
  onReturn: (row: AnyRow) => void;
}

const formatDateTime = (value?: string | null) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("id-ID");
};

const getStatusBadgeClass = (status?: string) => {
  if (status === "DIPINJAM" || status === "TERLAMBAT") {
    return "bg-blue-100 text-blue-700";
  }

  if (status === "MENUNGGU_ADMIN" || status === "MENUNGGU_BOS") {
    return "bg-yellow-100 text-yellow-700";
  }

  if (status === "DITOLAK") {
    return "bg-red-100 text-red-700";
  }

  if (status === "DIKEMBALIKAN") {
    return "bg-green-100 text-green-700";
  }

  return "bg-gray-100 text-gray-700";
};

const PersonInfo = ({
  title,
  person,
  fallbackId,
  date,
}: {
  title: string;
  person?: any | null;
  fallbackId?: number | string | null;
  date?: string | null;
}) => {
  return (
    <div className="rounded-lg border border-gray-200 p-3">
      <div className="text-xs text-gray-500">{title}</div>

      {person ? (
        <div className="mt-1 space-y-1">
          <div className="font-semibold text-gray-900">
            {person.name ?? "-"}
          </div>

          <div className="text-sm text-gray-600">
            Role:{" "}
            <span className="font-medium text-gray-800">
              {person.role ?? "-"}
            </span>
          </div>

          <div className="text-sm text-gray-600">
            Jabatan:{" "}
            <span className="font-medium text-gray-800">
              {person.jabatan ?? "-"}
            </span>
          </div>

          <div className="text-sm text-gray-600">
            Waktu:{" "}
            <span className="font-medium text-gray-800">
              {formatDateTime(date)}
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-1 space-y-1">
          <div className="font-medium text-gray-900">
            {fallbackId ? `ID: ${fallbackId}` : "-"}
          </div>

          <div className="text-sm text-gray-600">
            Waktu:{" "}
            <span className="font-medium text-gray-800">
              {formatDateTime(date)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function BorrowDetailModal({
  isOpen,
  onClose,
  selected,
  onReturn,
}: BorrowDetailModalProps) {
  const canReturn =
    selected && ["DIPINJAM", "TERLAMBAT"].includes(selected.status);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Peminjaman"
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Tutup
          </Button>

          {canReturn && (
            <Button
              type="button"
              onClick={() => {
                onReturn(selected);
                onClose();
              }}
            >
              Kembalikan
            </Button>
          )}
        </div>
      }
    >
      {!selected ? (
        <div className="text-sm text-gray-600">Data tidak ditemukan.</div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="text-xs font-medium uppercase text-gray-500">
              Asset
            </div>

            <div className="mt-1 text-base font-semibold text-gray-900">
              {selected.assetStock?.asset?.asset_name ?? "-"}{" "}
              <span className="text-gray-500">
                ({selected.assetStock?.asset?.asset_code ?? "-"})
              </span>
            </div>

            <div className="mt-2 text-sm text-gray-600">
              Lokasi:{" "}
              <span className="font-medium text-gray-800">
                {selected.assetStock?.location?.name ?? "-"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-3">
              <div className="text-xs text-gray-500">Peminjam</div>
              <div className="font-semibold text-gray-900">
                {selected.user?.name ?? "-"}
              </div>
              <div className="text-sm text-gray-600">
                Role: {selected.user?.role ?? "-"}
              </div>
              <div className="text-sm text-gray-600">
                Jabatan: {selected.user?.jabatan ?? "-"}
              </div>
              <div className="text-sm text-gray-600">
                No HP: {selected.user?.no_hp ?? "-"}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-3">
              <div className="text-xs text-gray-500">Status</div>
              <div className="mt-1">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeClass(
                    selected.status
                  )}`}
                >
                  {selected.status}
                </span>
              </div>

              <div className="mt-2 text-sm text-gray-600">
                Qty:{" "}
                <span className="font-semibold text-gray-900">
                  {selected.quantity}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-3">
              <div className="text-xs text-gray-500">Tanggal Request</div>
              <div className="font-medium text-gray-900">
                {formatDateTime(selected.borrowed_date)}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-3">
              <div className="text-xs text-gray-500">Tanggal Kembali</div>
              <div className="font-medium text-gray-900">
                {formatDateTime(selected.returned_date)}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <div className="mb-3 text-sm font-semibold text-gray-900">
              Informasi Approval
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <PersonInfo
                title="Diajukan Oleh"
                person={selected.requestedBy}
                fallbackId={selected.requested_by_id}
                date={selected.borrowed_date}
              />

              <PersonInfo
                title="Disetujui Admin"
                person={selected.adminApprovedBy}
                fallbackId={selected.admin_approved_by_id}
                date={selected.admin_approved_at}
              />

              <PersonInfo
                title="Disetujui Bos"
                person={selected.bossApprovedBy}
                fallbackId={selected.boss_approved_by_id}
                date={selected.boss_approved_at}
              />

              <PersonInfo
                title="Ditolak Oleh"
                person={selected.rejectedBy}
                fallbackId={selected.rejected_by_id}
                date={selected.rejected_at}
              />

              <div className="rounded-lg border border-gray-200 p-3 sm:col-span-2">
                <div className="text-xs text-gray-500">Catatan Approval</div>
                <div className="mt-1 font-medium text-gray-900">
                  {selected.approval_note ?? "-"}
                </div>
              </div>
            </div>
          </div>

          {selected.status === "MENUNGGU_ADMIN" && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
              Request ini sedang menunggu persetujuan admin.
            </div>
          )}

          {selected.status === "MENUNGGU_BOS" && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
              Request ini sedang menunggu persetujuan bos.
            </div>
          )}

          {selected.status === "DITOLAK" && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              Request peminjaman ini ditolak.
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}