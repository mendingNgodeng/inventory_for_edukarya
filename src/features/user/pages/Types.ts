export interface Data {
  id_user: number;
  name: string;
  jabatan: string;
  no_hp:string;
}

export interface UserFormData {
  name: string;
  jabatan: string;
  no_hp:string;
}

export interface UserTableProps {
  data: Data[];
  onEdit: (data: Data) => void;
  onDelete: (id: number) => void;
}

export interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
  editingData: Data | null;
}
