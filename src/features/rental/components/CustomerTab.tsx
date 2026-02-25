// src/pages/rental_customer/component/CustomerTab.tsx
import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import Button from "../../../components/ui/button";
import Table from "../pages/Table";
import Modal from "../pages/Modal";
import { useData } from "../../../api/rental_customer/hooks";
import type { Data, FormData } from "../pages/Types";
import { toast } from "sonner";
import Alert from "../../../components/ui/alert";

export default function CustomerTab({ searchTerm }: { searchTerm: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Data | null>(null);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { Data: rows, createData, updateData, deleteData } = useData();

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return rows;

    return rows.filter((x) => {
      const name = (x.name ?? "").toLowerCase();
      const phone = (x.phone ?? "").toLowerCase();
      return name.includes(term) || phone.includes(term);
    });
  }, [rows, searchTerm]);

  const handleAdd = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (d: Data) => {
    setEditingData(d);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => setDeleteId(id);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);
      await deleteData(deleteId);
      toast.success("Customer rental berhasil dihapus");
    } catch {
      toast.error("Gagal menghapus customer. data ini masih digunakan oleh tabel lain!");
    } finally {
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  const handleSubmit = async (data: FormData) => {
    if (editingData) {
      await updateData(editingData.id_rental_customer, data);
      toast.success("Data Customer berhasil diperbarui");
    } else {
      await createData(data);
      toast.success("Data Customer berhasil ditambahkan");
    }
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Header mini tab (opsional) */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Kelola data customer rental
        </div>

        <Button onClick={handleAdd} variant="outline_blue">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Customer
        </Button>
      </div>

      <Table data={filtered} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        editingData={editingData}
      />

      <Alert
        open={deleteId !== null}
        title="Hapus Customer Rental"
        description="Data yang sudah dihapus tidak dapat dikembalikan."
        confirmText="Ya, hapus"
        cancelText="Batal"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleteLoading}
      />
    </>
  );
}