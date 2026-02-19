export interface Data {
  id_asset_categories: number;
  name: string;
  description: string;
}

export interface CtgFormData {
  name: string;
  description: string;
}

export interface CtgTableProps {
  data: Data[];
  onEdit: (data: Data) => void;
  onDelete: (id: number) => void;
}

export interface CtgModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CtgFormData) => Promise<void>;
  editingData: Data | null;
}
