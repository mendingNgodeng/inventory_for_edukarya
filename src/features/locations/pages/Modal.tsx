import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/button';
import Input from '../../../components/ui/input';
import type { LocationFormData, LocationModalProps } from './Types';

const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingLocation,
}) => {
const {
  register,
  handleSubmit,
  reset,
  setError,
  formState: { errors, isSubmitting },
} = useForm<LocationFormData>();

  useEffect(() => {
    if (editingLocation) {
      reset({
        name: editingLocation.name,
        description: editingLocation.description,
      });
    } else {
      reset({
        name: '',
        description: '',
      });
    }
  }, [editingLocation, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingLocation ? 'Edit Lokasi' : 'Tambah Lokasi'}
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            form="locationForm"
            isLoading={isSubmitting}
          >
            Simpan
          </Button>
        </div>
      }
    >
      <form
        id="locationForm"
        onSubmit={handleSubmit(async (data) => {
  try {
    await onSubmit(data);
  } catch (error: any) {
    if (error.response?.status === 400) {
      const backendErrors = error.response.data.errors;

      Object.keys(backendErrors).forEach((field) => {
        setError(field as keyof LocationFormData, {
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
          label="Nama Lokasi"
          {...register('name', {
            required: 'Nama lokasi wajib diisi',
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
