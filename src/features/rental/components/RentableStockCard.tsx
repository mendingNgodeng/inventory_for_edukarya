// src/pages/rental/component/RentableStockCard.tsx
import Button from "../../../components/ui/button";

export default function RentableStockCard({ stock, onRent }: any) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="font-semibold text-gray-900">
        {stock.asset?.asset_name ?? "-"}
      </div>
      <div className="text-sm text-gray-600">
        {stock.asset?.asset_code ?? "-"} • {stock.location?.name ?? "-"}
      </div>

      <div className="mt-2 text-sm text-gray-700">
        Qty: <span className="font-semibold">{stock.quantity ?? 0}</span>
      </div>

      <div className=" text-sm text-gray-700">
        Harga Rental Per-hari: 
        <span className="font-semibold">  
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(stock.asset?.rental_price ?? 0)}
        </span>
      </div> 

      <div className="mt-3 flex justify-end">
        <Button variant="outline_blue" onClick={onRent}>
          Rental
        </Button>
      </div>
    </div>
  );
}