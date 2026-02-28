import Button from "../../../components/ui/button";

export default function CustomerRentalCard({
  name,
  phone,
  totalActiveItems,
  totalActiveQty,
  onSelect,
}: {
  name: string;
  phone: string;
  totalActiveItems: number; // jumlah baris rental aktif
  totalActiveQty: number;   // total qty rental aktif
  onSelect: () => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
      <div>
        <div className="font-semibold text-gray-900">{name}</div>
        <div className="text-sm text-gray-600">{phone}</div>
      </div>

      <div className="text-sm text-gray-700">
        <div>
          Jumlah item: <span className="font-semibold">{totalActiveItems}</span>
        </div>
        <div>
          Total qty: <span className="font-semibold">{totalActiveQty}</span>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline_blue" type="button" onClick={onSelect}>
          Rental
        </Button>
      </div>
    </div>
  );
}