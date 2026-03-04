import React, { useState } from 'react';
import { Plus } from 'lucide-react';

import Button from '../../../components/ui/button';
import Table from './Table';
import Modal from './Modal';
import { useData } from '../../../api/assetsStock/hooks';
import type { Data, AssetsFormData } from './Types';
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

    toast.success("Stok Aset  berhasil dihapus");
  } catch (error:any) {
    // toast.error("Gagal menghapus Aset. data ini masih digunakan oleh tabel lain!");
     const message =
    error?.response?.data?.message ||
    error?.message ||
    "Gagal menghapus data.";

  toast.error(message);
  } finally {
    setDeleteLoading(false);
    setDeleteId(null);
  }
};

const handleDelete = (id: number) => {
  setDeleteId(id);
};
const handleSubmit = async (data: AssetsFormData) => {
  if (editingData) {
    await updateData(editingData.id_asset_stock, data);
    toast.success("Stock Asset berhasil diperbarui");
  } else {
    await createData(data);
    toast.success("Stock Asset berhasil ditambahkan");
  }

  setIsModalOpen(false);
};

  const filtered = Data.filter((loc) =>
    loc.asset.asset_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.asset.asset_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(loc.quantity).includes(searchTerm.toLowerCase()) ||
    loc.asset.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.asset.type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.status.toLowerCase().includes(searchTerm.toLowerCase())


  );

  return (
    <>
      <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <h1 className="text-xl sm:text-2xl font-bold text-black">
    Data Stock Asset
  </h1>

  <Button 
    onClick={handleAdd} 
    variant="outline_blue"
    className="w-full sm:w-auto"
  >
    <Plus className="w-4 h-4 mr-2" />
    Tambah Data Stock Asset
  </Button>
</div>


        <input
          type="text"
          placeholder="Cari Stock Asset..."
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
  title="Hapus Stock Asset"
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
