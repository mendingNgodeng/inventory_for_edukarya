export interface Data {
  id_asset_stock: number;
  id_assets: number;
  id_location: number;
  condition:string;
  quantity: number;
  status: string;
  asset: {
    asset_name: string;
    asset_code: string;
    is_rentable: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface AssetsFormData {
  id_assets: number;
  id_location: number;
  condition:string;
  quantity: number;
  status: string;
  asset: {
    asset_name: string;
    asset_code: string;
    is_rentable: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface AssetsTableProps {
  data: Data[];
  onEdit: (data: Data) => void;
  onDelete: (id: number) => void;
}

export interface AssetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AssetsFormData) => Promise<void>;
  editingData: Data | null;
}
