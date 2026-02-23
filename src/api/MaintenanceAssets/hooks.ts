import { useEffect, useState } from 'react';
import { dataService } from './service';
import type { data, CreateData, UpdateData } from './types';

export const useData = () => {
  const [Data, setData] = useState<data[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await dataService.getAll();
      setData(data);
    } catch (error) {
      console.error('Failed to fetch Data', error);
    } finally {
      setLoading(false);
    }
  };

  const createMaintenance = async (payload: CreateData) => {
    const newData = await dataService.createMaintenance(payload);
    setData((prev) => [...prev, newData]);
  };

  const returnAsset = async (
    id: number,
  ) => {
    const updated = await dataService.returnAsset(id);
    setData((prev) =>
      prev.map((loc) =>
        loc.id_asset_maintenance === id ? updated : loc
      )
    );
  };

  const deleteData = async (id: number) => {
    await dataService.delete(id);
    setData((prev) =>
      prev.filter((loc) => loc.id_asset_maintenance !== id)
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    Data,
    loading,
    fetchData,
    createMaintenance,
    returnAsset,
    deleteData,
  };
};
