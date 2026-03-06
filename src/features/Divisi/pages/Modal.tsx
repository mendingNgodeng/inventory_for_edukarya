import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/button';
import Input from '../../../components/ui/input';
import type { TypesFormData, TypesModalProps } from './Types';

const LocationModal: React.FC<TypesModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingData,
}) => {
const {
  register,
  handleSubmit,
  reset,
  setError,
  formState: { errors, isSubmitting },
} = useForm<TypesFormData>();

  useEffect(() => {
    if (editingData) {
      reset({
        name: editingData.name,
        description: editingData.description,
      });
    } else {
      reset({
        name: '',
        description: '',
      });
    }
  }, [editingData, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingData ? 'Edit Tipe Aset' : 'Tambah Tipe Aset'}
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            form="Form"
            isLoading={isSubmitting}
          >
            Simpan
          </Button>
        </div>
      }
    >
      <form
        id="Form"
        onSubmit={handleSubmit(async (data) => {
  try {
    await onSubmit(data);
  } catch (error: any) {
    if (error.response?.status === 400) {
      const backendErrors = error.response.data.errors;

      Object.keys(backendErrors).forEach((field) => {
        setError(field as keyof TypesFormData, {
          type: "server",
          message: backendErrors[field][0],
        });
      });
    } else {
      throw error; // lempar lagi
    }
  }
})}

        className="space-y-4"
      >
        <Input
          label="Nama Divisi"
          {...register('name', {
            required: 'Divisi Aset wajib diisi',
          })}
          error={errors.name?.message}
        />

        <div>
          <label className="block mb-1 font-medium text-gray-700">Deskripsi</label>
          <textarea
            className="w-full px-3 py-2 border rounded-lg shadow-sm transition
            focus:outline-none focus:ring-2 text-gray-700"
            rows={3}
            {...register('description')}
          />
        </div>
      </form>
    </Modal>
  );
};

export default LocationModal;
