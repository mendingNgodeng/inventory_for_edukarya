export interface Data {
  id_assets: number;
  id_asset_types: number;
  id_asset_categories: number;
  purchase_price:number,
  asset_name: string;
  asset_code: string;
  type: {
    name: string;
  };

  category: {
    name: string;
  };
  is_rentable: boolean;
  created_at: string;
  updated_at: string;
}

export interface AssetsFormData {
  id_asset_types: number;
  id_asset_categories: number;
  purchase_price:number,
  asset_code: string;
  asset_name: string;
  is_rentable: boolean;
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
