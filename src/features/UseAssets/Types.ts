export interface Data {
  id_asset_borrowed:number;
  id_asset_stock: number;
  id_user: any;
  quantity: number;
  borrowed_date:string,
  returned_date: string;
  status: string;
  assetStock: {
    asset: {
      asset_name:string;
      asset_code:string;
    };
    location:{
      name:string;
    }
  };
  user:{
    name:string,
    jabatan:string,
    no_hp:string
  }
}

export interface AssetsFormData {
  id_asset_stock: number;
  id_user: any;
  quantity: number;
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
