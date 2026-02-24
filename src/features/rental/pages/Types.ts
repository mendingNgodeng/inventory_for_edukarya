export interface Data {
  id_rental_customer: number;
  name: string;
  phone: string;
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
