import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/button';
import Input from '../../../components/ui/input';
import type { UserFormData, UserModalProps } from './Types';

const LocationModal: React.FC<UserModalProps> = ({
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
} = useForm<UserFormData>();

  useEffect(() => {
    if (editingData) {
      reset({
        name: editingData.name,
        jabatan: editingData.jabatan,
        no_hp: editingData.no_hp,
      });
    } else {
      reset({
        name: '',
        jabatan: '',
        no_hp: '',
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
        setError(field as keyof UserFormData, {
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
          label="Nama Karyawan"
          {...register('name', {
          required:"Nama Wajib diisi!"
          })}
          error={errors.name?.message}
        />

          <Input
          label="Jabatan"
          {...register('jabatan', {
          })}
          error={errors.jabatan?.message}
        />

          <Input
          label="nomor hp"
          {...register('no_hp', {
          })}
          error={errors.no_hp?.message}
        />

        <div>
        </div>
      </form>
    </Modal>
  );
};

export default LocationModal;
