export interface Data {
  id_rental_customer: number;
  name: string;
  phone: string;
  created_at:string;
  updated_at:string;
  pictureKtp:string;
}

export interface FormData {
  name: string;
  phone: string;
  pictureKtp:string;
}

export interface TableProps {
  data: Data[];
  onEdit: (data: Data) => void;
  onDelete: (id: number) => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  editingData: Data | null;
}
// rental asset
export type RentalTabKey =
  | "CUSTOMER"
  | "RENTAL_BY_CUSTOMER"
  | "RENTABLE_STOCK"
  | "HISTORY";

export type RentalStatus =  "AKTIF" | "SELESAI" | "DIBATALKAN";

export type RentalForm = {
  id_rental_customer:string;
  id_asset_stock: string;   // dari <select>
  quantity: number;
  rental_start: string;     // datetime-local
  rental_end: string;       // datetime-local
  price: number;
  dp_amount: number;
  // price: number;

};
