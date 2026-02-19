// api/location/hooks.ts

import { useEffect, useState } from 'react';
import { LocationService } from './service';
import type { Location, CreateLocationDTO, UpdateLocationDTO } from './types';

export const useLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await LocationService.getAll();
      setLocations(data);
    } catch (error) {
      console.error('Failed to fetch locations', error);
    } finally {
      setLoading(false);
    }
  };

  const createLocation = async (payload: CreateLocationDTO) => {
    const newLocation = await LocationService.create(payload);
    setLocations((prev) => [...prev, newLocation]);
  };

  const updateLocation = async (
    id: number,
    payload: UpdateLocationDTO
  ) => {
    const updated = await LocationService.update(id, payload);
    setLocations((prev) =>
      prev.map((loc) =>
        loc.id_location === id ? updated : loc
      )
    );
  };

  const deleteLocation = async (id: number) => {
    await LocationService.delete(id);
    setLocations((prev) =>
      prev.filter((loc) => loc.id_location !== id)
    );
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return {
    locations,
    loading,
    fetchLocations,
    createLocation,
    updateLocation,
    deleteLocation,
  };
};
