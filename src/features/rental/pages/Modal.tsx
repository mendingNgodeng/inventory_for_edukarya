import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/button";
import ImagePicker from "../../../components/ui/image-picker";
import Input from "../../../components/ui/input";
import type { FormData, ModalProps } from "./Types";

import { dataService } from "../../../api/rental_customer/service"; // sesuaikan path kamu
import type { data as RentalCustomerData } from "../../../api/rental_customer/types";

const LocationModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingData,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const [ktpPreview, setKtpPreview] = useState<string>("");
  const [detailData, setDetailData] = useState<RentalCustomerData | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // const fileToBase64 = (file: File) =>
  //   new Promise<string>((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = () => resolve(reader.result as string);
  //     reader.onerror = reject;
  //     reader.readAsDataURL(file); // "data:image/jpeg;base64,..."
  //   });

  // Fetch detail (GET by ID) saat modal edit dibuka
  useEffect(() => {
    const fetchDetail = async () => {
      if (!isOpen) return;

      const id = editingData?.id_rental_customer;
      if (!id) {
        setDetailData(null);
        return;
      }

      try {
        setLoadingDetail(true);
        const full = await dataService.getById(id); // backend harus sudah decrypt pictureKtp
        setDetailData(full);
      } catch (e) {
        console.error("Failed to fetch rental customer detail", e);
        setDetailData(null);
      } finally {
        setLoadingDetail(false);
      }
    };

    fetchDetail();
  }, [isOpen, editingData?.id_rental_customer]);

  // Reset form + set preview berdasarkan mode
  useEffect(() => {
    if (!isOpen) return;

    const isEdit = !!editingData?.id_rental_customer;

    if (isEdit) {
      // tunggu detail data yang sudah decrypt
      if (!detailData) return;

      reset({
        name: detailData.name,
        phone: detailData.phone,
        pictureKtp: "", // jangan ikut submit saat edit
      });

      setKtpPreview(detailData.pictureKtp || "");
      return;
    }

    // create mode
    reset({
      name: "",
      phone: "",
      pictureKtp: "",
    });
    setKtpPreview("");
  }, [isOpen, editingData?.id_rental_customer, detailData, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingData ? "Edit Data Customer Rental" : "Tambah Data Customer Rental"}
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" form="Form" isLoading={isSubmitting}>
            Simpan
          </Button>
        </div>
      }
    >
      <form
        id="Form"
        className="space-y-4"
        onSubmit={handleSubmit(async (data) => {
          try {
            const payload = editingData
              ? { name: data.name, phone: data.phone } // edit: tidak kirim KTP
              : data; // create: kirim semua termasuk base64 KTP

            await onSubmit(payload as any);
          } catch (error: any) {
            if (error.response?.status === 400) {
              const backendErrors = error.response.data.errors || {};
              Object.keys(backendErrors).forEach((field) => {
                setError(field as keyof FormData, {
                  type: "server",
                  message: backendErrors[field]?.[0],
                });
              });
            } else {
              throw error;
            }
          }
        })}
      >
        <Input
          label="Nama nama Customer"
          {...register("name", { required: "Nama Customer wajib diisi" })}
          error={errors.name?.message}
        />

        <Input
          label="Nomor HP"
          {...register("phone")}
          error={errors.phone?.message}
        />

        {/* hidden field untuk RHF submit + validasi */}
        <Input
          type="hidden"
          {...register("pictureKtp", {
            required: editingData ? false : "KTP wajib diisi",
          })}
        />

        {/* EDIT MODE: preview saja */}
        {editingData ? (
          <div>
            <label className="block text-sm font-medium mb-1">Preview KTP</label>

            {loadingDetail ? (
              <p className="text-gray-500 text-sm">Memuat KTP...</p>
            ) : ktpPreview ? (
              <img
                src={ktpPreview}
                alt="Preview KTP"
                className="max-h-48 rounded border object-contain"
              />
            ) : (
              <p className="text-gray-500 text-sm">Tidak ada KTP</p>
            )}

            <p className="text-xs text-gray-500 mt-2">
              KTP tidak dapat diubah demi keamanan.
            </p>
          </div>
        ) : (
          // CREATE MODE: upload + preview
          <>
            <label className="block text-sm font-medium mb-1 text-gray-700">Upload KTP</label>

            {/* <input
              type="file"
              accept="image/*"
              className="w-full px-3 py-2 border rounded-lg shadow-sm text-gray-700"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) {
                  setValue("pictureKtp", "", { shouldValidate: true });
                  setKtpPreview("");
                  return;
                }
                const base64 = await fileToBase64(file);
                setValue("pictureKtp", base64, { shouldValidate: true });
                setKtpPreview(base64);
              }}
            /> */}  <>
    <ImagePicker
      value={ktpPreview}
      required={!editingData}
      error={errors.pictureKtp?.message}
      onChange={(b64:any) => {
        setValue("pictureKtp", b64, { shouldValidate: true });
        setKtpPreview(b64);
      }}
    />
  </>

            {errors.pictureKtp?.message && (
              <p className="text-red-500 text-sm mt-1">{errors.pictureKtp.message}</p>
            )}

            {ktpPreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Preview</p>
                <img
                  src={ktpPreview}
                  alt="Preview KTP"
                  className="max-h-48 rounded border object-contain"
                />
              </div>
            )}
          </>
        )}
      </form>
    </Modal>
  );
};

export default LocationModal;