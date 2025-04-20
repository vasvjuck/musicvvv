import { api } from "./client";
import {
    components,
    paths,
} from "./types";

type Track = components["schemas"]["Track"];
type TrackList = paths["/api/tracks"]["get"]["responses"]["200"]["content"]["application/json"];

export const tracksApi = {
    get: (params?: {
        page?: number;
        limit?: number;
        sort?: string;
        order?: string;
        search?: string;
        genre?: string;
        artist?: string;
    }) =>
        api.get<TrackList>("/api/tracks", { params }).then(res => res.data),

    getBySlug: (slug: string) =>
        api.get<Track>("/api/tracks/" + slug).then(res => res.data),

    create: (payload: {
        title: string;
        artist: string;
        album?: string;
        genres: string[];
        coverImage?: string;
    }) =>
        api.post<Track>("/api/tracks", payload).then(res => res.data),

    update: (id: string, payload: Partial<Omit<Track, "id" | "slug">>) =>
        api.put<Track>(`/api/tracks/${id}`, payload).then(res => res.data),

    delete: (id: string) =>
        api.delete<void>(`/api/tracks/${id}`),
};
