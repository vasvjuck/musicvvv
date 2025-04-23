import { api } from "./client";
import { paths } from "./types";
import { Track } from '@/schema';
type TrackList = paths["/api/tracks"]["get"]["responses"]["200"]["content"]["application/json"];

export interface TrackQueryParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
    search?: string;
    genre?: string;
    artist?: string;
}

export interface TrackPayload {
    title: string;
    artist: string;
    album?: string;
    genres: string[];
    coverImage?: string;
}

const BASE_URL = '/api/tracks';

export const tracksApi = {
    get: async (params: TrackQueryParams = {}): Promise<TrackList> => {
        const { data } = await api.get<TrackList>(BASE_URL, { params });
        return data;
    },

    create: async (payload: TrackPayload): Promise<Track> => {
        const { data } = await api.post<Track>(BASE_URL, payload);
        return data;
    },

    update: async (id: string, payload: Partial<Omit<Track, 'id'>>): Promise<Track> => {
        const { data } = await api.put<Track>(`${BASE_URL}/${id}`, payload);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`${BASE_URL}/${id}`);
    },

    deleteAll: async (ids: string[]): Promise<void> => {
        await api.post<void>(`${BASE_URL}/delete`, { ids });
    },

    uploadFile: async (id: string, file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await api.post(`/api/tracks/${id}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return data;
    },

    deleteFile: async (id: string) => {
        const { data } = await api.delete(`/api/tracks/${id}/file`);
        return data;
    },
};
