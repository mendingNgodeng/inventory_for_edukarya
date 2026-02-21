import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/button';
import Input from '../../../components/ui/input';
import Select from "../../../components/ui/select";
import type { AssetsFormData, AssetsModalProps } from './Types';
import { useLocations as Datalocation } from "../../../api/location/hooks";
import { useData as DataAsset } from "../../../api/assets/hooks";


const LocationModal: React.FC<AssetsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingData,
  
}) => {

const { locations: location } = Datalocation();
const { Data: asset } = DataAsset();
const {
  register,
  handleSubmit,
  reset,
  setError,
  formState: { errors, isSubmitting },
} = useForm<AssetsFormData>();
const [serverError, setServerError] = React.useState<string | null>(null);
//  id_assets: number;
//   id_location: number;
//   condition:string;
//   quantity: number;
//   status: string;
  useEffect(() => {
    if (editingData) {
      reset({
        id_assets: editingData.id_assets,
        id_location: editingData.id_location,
        condition: editingData.condition,
        quantity: editingData.quantity,
      });
    } else {
      reset({
      id_assets: undefined,
      id_location: undefined,
      condition: "",
      quantity: 0,
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
    setServerError(null);
    await onSubmit(data);
  } catch (error: any) {

    // 🔴 Kalau error validasi dari Zod (ada errors object)
    if (error.response?.data?.errors) {
      const backendErrors = error.response.data.errors;

      Object.keys(backendErrors).forEach((field) => {
        setError(field as keyof AssetsFormData, {
          type: "server",
          message: backendErrors[field][0],
        });
      });

      return;
    }

    // Kalau unique constraint atau error custom lain
    if (error.response?.data?.message) {
      setServerError(error.response.data.message);
      return;
    }

    //  Fallback
    setServerError("Terjadi kesalahan server.");
  }
})}
        className="space-y-4"
      >

      {serverError && (
  <div className="bg-red-100 text-red-600 p-3 rounded text-sm">
    {serverError}
  </div>
)}
        <Select
  label="Aset"
  options={asset.map((type) => ({
    value: type.id_assets,
    label: type.asset_name
  }))}
  registration={register("id_assets", {
    required: "Aset wajib dipilih",
    valueAsNumber: true,
  })}
  error={errors.id_assets?.message}
/>

<Select
  label="Lokasi Aset"
  options={location.map((loc) => ({
    value: loc.id_location,
    label: loc.name,
  }))}
  registration={register("id_location", {
    required: "Lokasi wajib dipilih",
    valueAsNumber: true,
  })}
  error={errors.id_location?.message}
/>

 <Input
          label="Quantitas"
          {...register('quantity', {
            required: 'quantitas wajib diisi',
            valueAsNumber: true
          })}
          error={errors.quantity?.message}
        />
        <div>
        </div>
      </form>
    </Modal>
  );
};

export default LocationModal;
