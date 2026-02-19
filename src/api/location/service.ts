// api/location/service.ts

import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import type {
  Location,
  CreateLocationDTO,
  UpdateLocationDTO,
  ApiResponse
} from './types';

export class LocationService {
static async getAll(): Promise<Location[]> {
  const { data } = await apiClient.get<ApiResponse<Location[]>>(
    ENDPOINTS.LOCATION
  );

  return data.data; // ambil array di dalamnya
}


static async getById(id: number): Promise<Location> {
  const { data } = await apiClient.get<ApiResponse<Location>>(
    `${ENDPOINTS.LOCATION}/${id}`
  );

  return data.data;
}

static async create(payload: CreateLocationDTO): Promise<Location> {
  const { data } = await apiClient.post<ApiResponse<Location>>(
    ENDPOINTS.LOCATION,
    payload
  );

  return data.data;
}

static async update(
  id: number,
  payload: UpdateLocationDTO
): Promise<Location> {
  const { data } = await apiClient.put<ApiResponse<Location>>(
    `${ENDPOINTS.LOCATION}/${id}`,
    payload
  );

  return data.data;
}

  static async delete(id: number): Promise<void> {
    await apiClient.delete(`${ENDPOINTS.LOCATION}/${id}`);
  }
}
