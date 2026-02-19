export interface Location {
  id_location: number;
  name: string;
  description: string;
}

export interface LocationFormData {
  name: string;
  description: string;
}

export interface LocationTableProps {
  locations: Location[];
  onEdit: (location: Location) => void;
  onDelete: (id: number) => void;
}

export interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LocationFormData) => Promise<void>;
  editingLocation: Location | null;
}
