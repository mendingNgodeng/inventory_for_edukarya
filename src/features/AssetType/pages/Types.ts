export interface Data {
  id_asset_types: number;
  name: string;
  description: string;
}

export interface TypesFormData {
  name: string;
  description: string;
}

export interface TypesTableProps {
  data: Data[];
  onEdit: (data: Data) => void;
  onDelete: (id: number) => void;
}

export interface TypesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TypesFormData) => Promise<void>;
  editingData: Data | null;
}
