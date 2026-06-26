import { useEffect, useMemo, useState } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/input";
import Button from "../../../components/ui/button";

type UpdateRentalEndPayload = {
  rental_end: string;
};

interface UpdateRentalEndModalProps {
  isOpen: boolean;
  onClose: () => void;
  rental: any | null;
  onSubmit: (payload: UpdateRentalEndPayload) => Promise<void>;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value || 0);
};

const toDateTimeLocalValue = (value?: string | Date | null) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
};

const countRentalDays = (start: Date, end: Date) => {
  const ms = end.getTime() - start.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

export default function UpdateRentalEndModal({
  isOpen,
  onClose,
  rental,
  onSubmit,
}: UpdateRentalEndModalProps) {
  const [rentalEnd, setRentalEnd] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !rental) return;

    setRentalEnd(toDateTimeLocalValue(rental.rental_end));
    setError("");
  }, [isOpen, rental]);

  const preview = useMemo(() => {
    if (!rental || !rentalEnd) {
      return null;
    }

    const startDate = new Date(rental.rental_start);
    const endDate = new Date(rentalEnd);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      return null;
    }

    const days = countRentalDays(startDate, endDate);

    const rentalPrice = Number(rental.assetStock?.asset?.rental_price ?? 0);
    const quantity = Number(rental.quantity ?? 0);
    const dpAmount = Number(rental.dp_amount ?? 0);

    const totalPrice = rentalPrice * quantity * days;
    const remainingAmount = Math.max(totalPrice - dpAmount, 0);

    let paymentStatus: "BELUM_BAYAR" | "DP" | "LUNAS" = "BELUM_BAYAR";

    if (dpAmount > 0 && dpAmount < totalPrice) {
      paymentStatus = "DP";
    }

    if (dpAmount >= totalPrice) {
      paymentStatus = "LUNAS";
    }

    return {
      days,
      rentalPrice,
      quantity,
      dpAmount,
      totalPrice,
      remainingAmount,
      paymentStatus,
      isInvalidDate: days <= 0,
    };
  }, [rental, rentalEnd]);

  const handleSubmit = async () => {
    if (!rental) return;

    setError("");

    if (!rentalEnd) {
      setError("Tanggal selesai wajib diisi");
      return;
    }

    const startDate = new Date(rental.rental_start);
    const endDate = new Date(rentalEnd);

    if (Number.isNaN(endDate.getTime())) {
      setError("Tanggal selesai tidak valid");
      return;
    }

    if (endDate <= startDate) {
      setError("Tanggal selesai harus setelah tanggal mulai rental");
      return;
    }

    try {
      setLoading(true);

      await onSubmit({
        rental_end: endDate.toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? () => {} : onClose}
      title="Ubah Tanggal Selesai Rental"
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline_blue"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading || preview?.isInvalidDate}
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      }
    >
      {!rental ? (
        <div className="text-sm text-gray-500">Data rental tidak ditemukan.</div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="text-sm text-gray-600">Asset</div>
            <div className="font-semibold text-gray-900">
              {rental.assetStock?.asset?.asset_name ?? "-"}{" "}
              <span className="text-gray-500">
                ({rental.assetStock?.asset?.asset_code ?? "-"})
              </span>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-gray-500">Customer</div>
                <div className="font-medium text-gray-900">
                  {rental.customer?.name ?? "-"}
                </div>
              </div>

              <div>
                <div className="text-gray-500">Qty</div>
                <div className="font-medium text-gray-900">
                  {rental.quantity ?? 0}
                </div>
              </div>

              <div>
                <div className="text-gray-500">Tanggal Mulai</div>
                <div className="font-medium text-gray-900">
                  {new Date(rental.rental_start).toLocaleString("id-ID")}
                </div>
              </div>

              <div>
                <div className="text-gray-500">Tanggal Selesai Saat Ini</div>
                <div className="font-medium text-gray-900">
                  {new Date(rental.rental_end).toLocaleString("id-ID")}
                </div>
              </div>
            </div>
          </div>

          <Input
            label="Tanggal Selesai Baru"
            type="datetime-local"
            value={rentalEnd}
            error={error}
            required
            onChange={(e) => {
              setRentalEnd(e.target.value);
              setError("");
            }}
          />

          {preview && (
            <div
              className={`rounded-lg border p-4 ${
                preview.isInvalidDate
                  ? "border-red-200 bg-red-50"
                  : "border-blue-200 bg-blue-50"
              }`}
            >
              {preview.isInvalidDate ? (
                <div className="text-sm font-medium text-red-700">
                  Tanggal selesai harus setelah tanggal mulai rental.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="font-semibold text-gray-900">
                    Estimasi Perhitungan Baru
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-gray-500">Jumlah Hari</div>
                      <div className="font-medium text-gray-900">
                        {preview.days} hari
                      </div>
                    </div>

                    <div>
                      <div className="text-gray-500">Harga / Hari</div>
                      <div className="font-medium text-gray-900">
                        {formatCurrency(preview.rentalPrice)}
                      </div>
                    </div>

                    <div>
                      <div className="text-gray-500">Total Harga Baru</div>
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(preview.totalPrice)}
                      </div>
                    </div>

                    <div>
                      <div className="text-gray-500">DP</div>
                      <div className="font-medium text-gray-900">
                        {formatCurrency(preview.dpAmount)}
                      </div>
                    </div>

                    <div>
                      <div className="text-gray-500">Sisa Bayar Baru</div>
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(preview.remainingAmount)}
                      </div>
                    </div>

                    <div>
                      <div className="text-gray-500">Payment Status Baru</div>
                      <div className="font-semibold text-gray-900">
                        {preview.paymentStatus}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">
                    Perhitungan ini hanya preview. Nilai final tetap dihitung dan
                    disimpan oleh backend.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}