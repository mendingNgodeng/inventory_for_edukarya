import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '../../../layouts/Dashboardlayout';
import Button from '../../../components/ui/button';
import LocationTable from './Table';
import LocationModal from './Modal';
import { useLocations } from '../../../api/location/hooks';
import type { Location, LocationFormData } from './Types';
import { toast } from "sonner";
import Alert from "../../../components/ui/alert";

const LocationPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
const [deleteId, setDeleteId] = useState<number | null>(null);
const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    locations,
    createLocation,
    updateLocation,
    deleteLocation,
    // loading,
  } = useLocations();

  const handleAdd = () => {
    setEditingLocation(null);
    setIsModalOpen(true);
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setIsModalOpen(true);
  };


  const handleConfirmDelete = async () => {
  if (!deleteId) return;

  try {
    setDeleteLoading(true);
    await deleteLocation(deleteId);

    toast.success("Lokasi berhasil dihapus");
  } catch (error) {
    toast.error("Gagal menghapus lokasi. data ini masih digunakan oleh tabel lain!");
  } finally {
    setDeleteLoading(false);
    setDeleteId(null);
  }
};

  // const handleDelete = async (id: number) => {
  //   if (window.confirm('Apakah Anda yakin ingin menghapus lokasi ini?')) {
  //     await deleteLocation(id);
  //   }
  // };
const handleDelete = (id: number) => {
  setDeleteId(id);
};
const handleSubmit = async (data: LocationFormData) => {
  if (editingLocation) {
    await updateLocation(editingLocation.id_location, data);
    toast.success("Lokasi berhasil diperbarui");
  } else {
    await createLocation(data);
    toast.success("Lokasi berhasil ditambahkan");
  }

  setIsModalOpen(false);
};

  const filtered = locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold text-black">Data Lokasi</h1>
          <Button onClick={handleAdd} variant='outline_blue'>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Lokasi
          </Button>
        </div>

        <input
          type="text"
          placeholder="Cari lokasi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
         focus:shadow-lg focus:shadow-blue-500/50 text-gray-700"
        />

        <LocationTable
          locations={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <LocationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          editingLocation={editingLocation}
        />
      </div>
      <Alert
  open={deleteId !== null}
  title="Hapus Lokasi"
  description="Data yang sudah dihapus tidak dapat dikembalikan."
  confirmText="Ya, hapus"
  cancelText="Batal"
  onConfirm={handleConfirmDelete}
  onCancel={() => setDeleteId(null)}
  loading={deleteLoading}
/>
    </DashboardLayout>
  );
};

export default LocationPage;
