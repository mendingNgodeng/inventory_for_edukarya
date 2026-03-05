import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../../../components/ui/button';
import Table from './Table';
import Modal from './Modal';
import { useData } from '../../../api/assetTypes/hooks';
import type { Data, TypesFormData } from './Types';
import { toast } from "sonner";
import Alert from "../../../components/ui/alert";

const Page: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Data | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
const [deleteId, setDeleteId] = useState<number | null>(null);
const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    Data,
    createData,
    updateData,
    deleteData,
    // loading,
  } = useData();

  const handleAdd = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (Data: Data) => {
    setEditingData(Data);
    setIsModalOpen(true);
  };


  const handleConfirmDelete = async () => {
  if (!deleteId) return;

  try {
    setDeleteLoading(true);
    await deleteData(deleteId);

    toast.success("Tipe Aset berhasil dihapus");
  } catch (error) {
    toast.error("Gagal menghapus Tipe Aset. data ini masih digunakan oleh tabel lain!");
  } finally {
    setDeleteLoading(false);
    setDeleteId(null);
  }
};

const handleDelete = (id: number) => {
  setDeleteId(id);
};
const handleSubmit = async (data: TypesFormData) => {
  if (editingData) {
    await updateData(editingData.id_asset_types, data);
    toast.success("Tipe Aset berhasil diperbarui");
  } else {
    await createData(data);
    toast.success("Tipe Aset berhasil ditambahkan");
  }

  setIsModalOpen(false);
};

  const filtered = Data.filter((loc) =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <h1 className="text-xl sm:text-2xl font-bold text-black">
    Data Tipe Aset
  </h1>

  <Button 
    onClick={handleAdd} 
    variant="outline_blue"
    className="w-full sm:w-auto"
  >
    <Plus className="w-4 h-4 mr-2" />
    Tambah Tipe Aset
  </Button>
</div>


        <input
          type="text"
          placeholder="Cari Tipe Aset..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
         focus:shadow-lg focus:shadow-blue-500/50 font-medium text-gray-700" 
        />

        <Table
          data={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          editingData={editingData}
        />
      </div>
      <Alert
  open={deleteId !== null}
  title="Hapus Tipe Aset"
  description="Data yang sudah dihapus tidak dapat dikembalikan."
  confirmText="Ya, hapus"
  cancelText="Batal"
  onConfirm={handleConfirmDelete}
  onCancel={() => setDeleteId(null)}
  loading={deleteLoading}
/>
    </>
  );
};

export default Page;
