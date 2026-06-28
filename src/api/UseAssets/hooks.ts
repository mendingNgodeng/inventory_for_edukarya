import { useEffect, useState } from 'react';
import { dataService } from './service';
import type { data, CreateData, UpdateData,RejectBorrowPayload } from './types';

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

  const createUsed = async (payload: CreateData) => {
    const newData = await dataService.createUsed(payload);
    setData((prev) => [...prev, newData]);
  };

  const createBorrow = async (payload: CreateData) => {
    const newData = await dataService.createBorrow(payload);
    setData((prev) => [...prev, newData]);
  };

  const updateData = async (
    id: number,
    payload: UpdateData
  ) => {
    const updated = await dataService.returnAsset(id, payload);
    setData((prev) =>
      prev.map((loc) =>
        loc.id_asset_borrowed === id ? updated : loc
      )
    );
  };

  const deleteData = async (id: number) => {
    await dataService.delete(id);
    setData((prev) =>
      prev.filter((loc) => loc.id_asset_borrowed !== id)
    );
  };


  const approveByAdmin = async (id: number) => {
  const updated = await dataService.approveByAdmin(id);

  setData((prev) =>
    prev.map((x) => (x.id_asset_borrowed === id ? updated : x))
  );

  return updated;
};

const approveByBoss = async (id: number) => {
  const updated = await dataService.approveByBoss(id);

  setData((prev) =>
    prev.map((x) => (x.id_asset_borrowed === id ? updated : x))
  );

  return updated;
};

const rejectBorrow = async (id: number, payload?: RejectBorrowPayload) => {
  const updated = await dataService.rejectBorrow(id, payload);

  setData((prev) =>
    prev.map((x) => (x.id_asset_borrowed === id ? updated : x))
  );

  return updated;
};

  useEffect(() => {
    fetchData();
  }, []);

  return {
    Data,
    loading,
    fetchData,
    createBorrow,
    createUsed,
    updateData,
    approveByAdmin,
    approveByBoss,
    rejectBorrow,
    deleteData,
  };
};
