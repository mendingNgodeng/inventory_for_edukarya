import Button from "../../../components/ui/button";

export default function UserBorrowCard({
  name,
  phone,
  position,
  totalItems,
  totalQty,
  onSelect,
}: {
  name: string;
  phone: string;
  position: string;
  totalItems: number;
  totalQty: number;
  onSelect: () => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
      <div>
        <div className="font-semibold text-gray-900">{name}</div>
        <div className="text-sm text-gray-600">{phone}</div>
        <div className="text-xs text-gray-500">{position}</div>
      </div>

      <div className="text-sm text-gray-700">
        <div>
          Jumlah item: <span className="font-semibold">{totalItems}</span>
        </div>
        <div>
          Total qty: <span className="font-semibold">{totalQty}</span>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline_blue" type="button" onClick={onSelect}>
          Pinjaman
        </Button>
      </div>
    </div>
  );
}