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

  const createData = async (payload: CreateData) => {
    const newData = await dataService.create(payload);
    setData((prev) => [...prev, newData]);
  };

  const updateData = async (
    id: number,
    payload: UpdateData
  ) => {
    const updated = await dataService.update(id, payload);
    setData((prev) =>
      prev.map((loc) =>
        loc.id_rental_customer === id ? updated : loc
      )
    );
  };

  const deleteData = async (id: number) => {
    await dataService.delete(id);
    setData((prev) =>
      prev.filter((loc) => loc.id_rental_customer !== id)
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    Data,
    loading,
    fetchData,
    createData,
    updateData,
    deleteData,
  };
};
