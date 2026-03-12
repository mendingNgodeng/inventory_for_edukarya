import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/button";
import Input from "../../../components/ui/input";
import type { UserFormData, UserModalProps } from "./Types";
import { Download, FileSpreadsheet, Upload, UserPlus } from "lucide-react";

type ImportRow = {
  name: string;
  username: string;
  password: string;
  jabatan?: string;
  no_hp?: string;
};

const LocationModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onSubmitMany,
  editingData,
}) => {
  const [activeTab, setActiveTab] = useState<"single" | "import">("single");
  const [importRows, setImportRows] = useState<ImportRow[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importSubmitting, setImportSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>();

  useEffect(() => {
    if (!isOpen) return;

    setActiveTab("single");
    setImportRows([]);
    setImportErrors([]);

    if (editingData) {
      reset({
        name: editingData.name,
        jabatan: editingData.jabatan,
        no_hp: editingData.no_hp,
        username: editingData.username,
        password: "",
        role: editingData.role ?? "KARYAWAN",
      });
    } else {
      reset({
        name: "",
        jabatan: "",
        no_hp: "",
        username: "",
        password: "",
        role: "KARYAWAN",
      });
    }
  }, [editingData, reset, isOpen]);

  const downloadTemplate = () => {
    const csvContent = [
      ["name", "username", "password", "jabatan", "no_hp"],
      ["Helmi", "helmi01", "123456", "Staff Gudang", "08123456789"],
      ["Budi", "budi02", "123456", "Admin", "08129876543"],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "template-import-user.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const validateRows = (rows: ImportRow[]) => {
    const errors: string[] = [];

    rows.forEach((row, index) => {
      if (!row.name?.trim()) errors.push(`Baris ${index + 2}: name wajib diisi`);
      if (!row.username?.trim()) errors.push(`Baris ${index + 2}: username wajib diisi`);
      if (!row.password?.trim()) errors.push(`Baris ${index + 2}: password wajib diisi`);
    });

    const usernames = rows.map((r) => (r.username ?? "").trim()).filter(Boolean);
    const duplicateUsernames = usernames.filter(
      (u, i) => usernames.indexOf(u) !== i
    );
    const uniqueDuplicates = Array.from(new Set(duplicateUsernames));

    if (uniqueDuplicates.length > 0) {
      errors.push(`Username duplikat di file: ${uniqueDuplicates.join(", ")}`);
    }

    return errors;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawRows = XLSX.utils.sheet_to_json<any>(firstSheet, {
        defval: "",
      });

      const normalizedRows: ImportRow[] = rawRows.map((row) => ({
        name: String(row.name ?? "").trim(),
        username: String(row.username ?? "").trim(),
        password: String(row.password ?? "").trim(),
        jabatan: String(row.jabatan ?? "").trim(),
        no_hp: String(row.no_hp ?? "").trim(),
      }));

      setImportRows(normalizedRows);
      setImportErrors(validateRows(normalizedRows));
    } catch (error) {
      setImportRows([]);
      setImportErrors(["Gagal membaca file. Pastikan format Excel/CSV benar."]);
    }
  };

  const importPreviewCount = useMemo(() => importRows.length, [importRows]);

  const handleImportSubmit = async () => {
    const errors = validateRows(importRows);
    setImportErrors(errors);

    if (errors.length > 0) return;
    if (importRows.length === 0) {
      setImportErrors(["Belum ada data import."]);
      return;
    }

    try {
      setImportSubmitting(true);

      const payload: UserFormData[] = importRows.map((row) => ({
        name: row.name,
        username: row.username,
        password: row.password,
        jabatan: row.jabatan || "",
        no_hp: row.no_hp || "",
        role: "KARYAWAN",
      }));

      await onSubmitMany(payload);
      onClose();
    } catch (error: any) {
    const response = error?.response?.data;
  const message = response?.message || "Gagal import user.";
  const backendErrors = response?.errors;

  if (backendErrors && typeof backendErrors === "object") {
    const formattedErrors = Object.entries(backendErrors).flatMap(
      ([key, value]) => {
        const msgs = Array.isArray(value) ? value : [String(value)];
        return msgs.map((msg) => `Baris ${Number(key) + 2}: ${msg}`);
      }
    );

    setImportErrors([message, ...formattedErrors]);
  } else {
    setImportErrors([message]);
  }
    } finally {
      setImportSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingData ? "Edit User(karyawan)" : "Tambah User(karyawan)"}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>

          {activeTab === "single" ? (
            <Button type="submit" form="Form" isLoading={isSubmitting}>
              Simpan
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleImportSubmit}
              isLoading={importSubmitting}
            >
              Import
            </Button>
          )}
        </div>
      }
    >
      {!editingData && (
        <div className="mb-4 flex gap-2 rounded-xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("single")}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === "single"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Single Input
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("import")}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === "import"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Import Excel
            </span>
          </button>
        </div>
      )}

      {activeTab === "single" || editingData ? (
        <form
          id="Form"
          onSubmit={handleSubmit(async (data) => {
            try {
              await onSubmit({
                ...data,
                role: "KARYAWAN",
              });
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
                throw error;
              }
            }
          })}
          className="space-y-4"
        >
          <Input
            label="Nama Karyawan"
            {...register("name", {
              required: "Nama wajib diisi!",
            })}
            error={errors.name?.message}
          />

          <Input
            label="Username"
            {...register("username", {
              required: "Username wajib diisi!",
            })}
            error={errors.username?.message}
          />

          <Input
            label="Jabatan"
            {...register("jabatan")}
            error={errors.jabatan?.message}
          />

          <Input
            label="Nomor HP"
            {...register("no_hp")}
            error={errors.no_hp?.message}
          />

          <Input
            label="Password"
            type="password"
            {...register("password", {
              required: editingData ? false : "Password wajib diisi!",
            })}
            error={errors.password?.message}
          />
        </form>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="mb-3 text-sm text-blue-900">
              Download template dulu, isi datanya di Excel, lalu upload kembali.
            </div>

            <Button type="button" variant="outline_blue" onClick={downloadTemplate}>
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
          </div>

          <div className="rounded-xl border border-dashed border-gray-300 p-6">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-3 text-center">
              <Upload className="h-8 w-8 text-gray-500" />
              <div className="text-sm font-medium text-gray-700">
                Upload file Excel / CSV
              </div>
              <div className="text-xs text-gray-500">
                Format kolom: name, username, password, jabatan, no_hp
              </div>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFileChange}
              />
              <span className="rounded-lg border px-3 py-2 text-sm text-gray-700">
                Pilih File
              </span>
            </label>
          </div>

          {importErrors.length > 0 && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="mb-2 text-sm font-semibold text-red-700">
                Ada error pada data import:
              </div>
              <ul className="list-disc space-y-1 pl-5 text-sm text-red-600">
                {importErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl border bg-gray-50 p-4">
            <div className="mb-2 text-sm text-gray-600">
              Total data terbaca:{" "}
              <span className="font-semibold text-gray-900">
                {importPreviewCount}
              </span>
            </div>

            <div className="max-h-72 overflow-auto rounded-lg border bg-white">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="sticky top-0 bg-gray-100 text-left text-gray-600">
                  <tr>
                    <th className="px-3 py-2">Nama</th>
                    <th className="px-3 py-2">Username</th>
                    <th className="px-3 py-2">Password</th>
                    <th className="px-3 py-2">Jabatan</th>
                    <th className="px-3 py-2">No HP</th>
                  </tr>
                </thead>
                <tbody>
                  {importRows.length > 0 ? (
                    importRows.map((row, idx) => (
                      <tr key={idx} className="border-t text-black">
                        <td className="px-3 py-2">{row.name || "-"}</td>
                        <td className="px-3 py-2">{row.username || "-"}</td>
                        <td className="px-3 py-2">{row.password || "-"}</td>
                        <td className="px-3 py-2">{row.jabatan || "-"}</td>
                        <td className="px-3 py-2">{row.no_hp || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-8 text-center text-gray-500"
                      >
                        Belum ada file yang diupload.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default LocationModal;