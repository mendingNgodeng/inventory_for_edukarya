import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/button';
import Input from '../../../components/ui/input';
import Select from "../../../components/ui/select";
import type { AssetsFormData, AssetsModalProps } from './Types';
import { useData as useCategories } from "../../../api/assetCategories/hooks";
import { useData as useAssetTypes } from "../../../api/assetTypes/hooks";


const LocationModal: React.FC<AssetsModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingData,
  
}) => {

const { Data: categories } = useCategories();
const { Data: assetTypes } = useAssetTypes();
const {
  register,
  handleSubmit,
  reset,
  setError,
  formState: { errors, isSubmitting },
} = useForm<AssetsFormData>();

  useEffect(() => {
    if (editingData) {
      reset({
        id_asset_types: editingData.id_asset_types,
        asset_name: editingData.asset_name,
        id_asset_categories: editingData.id_asset_categories,
        asset_code: editingData.asset_code,
        purchase_price: editingData.purchase_price,
        is_rentable: editingData.is_rentable,
      });
    } else {
      reset({
      id_asset_types: undefined,
      id_asset_categories: undefined,
      asset_name: "",
      asset_code: "",
      purchase_price: 0,
      is_rentable: false,
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
        setError(field as keyof AssetsFormData, {
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
          label="Nama Aset"
          {...register('asset_name', {
            required: 'Nama Aset wajib diisi',
          })}
          error={errors.asset_name?.message}
        />


         <Input
          label="Kode Aset"
          {...register('asset_code', {
            required: 'kode Aset wajib diisi',
          })}
          error={errors.asset_code?.message}
        />

         <Input
         type='number'
          label="harga Aset (per unit optional)"
          {...register('purchase_price', {
            valueAsNumber:true
          })}
          error={errors.purchase_price?.message}
        />

        <Select
  label="Tipe Aset"
  options={assetTypes.map((type) => ({
    value: type.id_asset_types,
    label: type.name
  }))}
  registration={register("id_asset_types", {
    required: "Tipe Aset wajib dipilih",
    valueAsNumber: true,
  })}
  error={errors.id_asset_types?.message}
/>

<Select
  label="Kategori Aset"
  options={categories.map((cat) => ({
    value: cat.id_asset_categories,
    label: cat.name,
  }))}
  registration={register("id_asset_categories", {
    required: "Kategori wajib dipilih",
    valueAsNumber: true,
  })}
  error={errors.id_asset_categories?.message}
/>

<div className="flex items-center gap-2">
  <input
    type="checkbox"
    {...register("is_rentable")}
    className="w-4 h-4"
  />
  <label className="text-gray-700">Bisa Disewakan</label>
</div>
        <div>
        </div>
      </form>
    </Modal>
  );
};

export default LocationModal;
