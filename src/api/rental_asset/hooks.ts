//src/api/rental_asset/hooks.ts
// src/api/rental_asset/hooks.ts

import { useEffect, useState } from "react";
import { rentalAssetService } from "./service";
import type { data, CreateData, UpdateData, FinishPayload } from "./types";

export const useData = () => {
  const [Data, setData] = useState<data[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const rows = await rentalAssetService.getAll();
      setData(rows);
    } catch (error) {
      console.error("Failed to fetch rental assets", (error as any)?.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const createRental = async (payload: CreateData) => {
    const created = await rentalAssetService.create(payload);
    setData((prev) => [created, ...prev]);
    return created;
  };

  const updateData = async (id: number, payload: UpdateData) => {
    const updated = await rentalAssetService.update(id, payload);
    setData((prev) => prev.map((x) => (x.id_asset_rental === id ? updated : x)));
    return updated;
  };

  const finishRental = async (id: number, payload?: FinishPayload) => {
    const updated = await rentalAssetService.finish(id, payload);
    setData((prev) => prev.map((x) => (x.id_asset_rental === id ? updated : x)));
    return updated;
  };

  const cancelRental = async (id: number) => {
    const updated = await rentalAssetService.cancel(id);
    setData((prev) => prev.map((x) => (x.id_asset_rental === id ? updated : x)));
    return updated;
  };

  const deleteData = async (id: number) => {
    await rentalAssetService.delete(id);
    setData((prev) => prev.filter((x) => x.id_asset_rental !== id));
  };

   const deletAllnonActive = async () => {
    await rentalAssetService.deleteAllNonActive();
    setData((prev) => prev.filter((x) => {x.status === "AKTIF"}));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    Data,
    loading,
    fetchData,
    createRental,
    updateData,
    finishRental,
    cancelRental,
    deletAllnonActive,
    deleteData, //only for non active
  };
};