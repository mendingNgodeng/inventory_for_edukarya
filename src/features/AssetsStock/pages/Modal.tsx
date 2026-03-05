import React, { useEffect } from 'react';
import { useForm,Controller } from 'react-hook-form';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/button';
import Input from '../../../components/ui/input';
// import Select from "../../../components/ui/select";
import type { AssetsFormData, AssetsModalProps } from './Types';
import { useLocations as Datalocation } from "../../../api/location/hooks";
import { useData as DataAsset } from "../../../api/assets/hooks";
import SearchSelect from "../../../components/ui/search-select";

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
  control,
  formState: { errors, isSubmitting },
} = useForm<AssetsFormData>();
const [serverError, setServerError] = React.useState<string | null>(null);
  useEffect(() => {
    if (editingData) {
      reset({
       id_asset: Number(editingData.id_asset),
  id_location: Number(editingData.id_location),
        condition: editingData.condition,
        quantity: editingData.quantity,
      });
    } else {
      reset({
  id_asset: "" as any,
  id_location: "" as any,
      condition: "",
      quantity: 0,
      });
    }
  }, [editingData, reset]);
const assetOptions = (asset ?? []).map((a: any) => ({
  value: a.id_assets,
  label: `${a.asset_name} - ${a.asset_code}`,
}));

const locationOptions = (location ?? []).map((l: any) => ({
  value: l.id_location,
  label: l.name,
}));
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

    // Kalau error validasi dari Zod (ada errors object)
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
        {/* <Select
  label="Aset"
  options={asset.map((asset) => ({
    value: asset.id_assets,
    label: asset.asset_name +" - " + asset.asset_code
  }))}
  registration={register("id_asset", {
    required: "Aset wajib dipilih",
    valueAsNumber: true,
  })}
  error={errors.id_asset?.message}
/> */}
<Controller
  name="id_asset"
  control={control}
  rules={{ required: "Aset wajib dipilih" }}
  render={({ field }) => (
    <SearchSelect
      label="Aset"
      value={field.value ?? null}
      onChange={(val) => field.onChange(val ?? "")}
      options={assetOptions}
      error={errors.id_asset?.message as any}
    />
  )}
/>
<Controller
  name="id_location"
  control={control}
  rules={{ required: "Lokasi wajib dipilih" }}
  render={({ field }) => (
    <SearchSelect
      label="Lokasi Aset"
      value={field.value ?? null}
      onChange={(val) => field.onChange(val ?? "")}
      options={locationOptions}
      error={errors.id_location?.message as any}
    />
  )}
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
