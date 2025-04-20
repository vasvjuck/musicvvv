import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tracksApi } from "@/lib/api/tracks";

const KEYS = {
    tracks: () => ["tracks"] as const,
    track: (slug: string) => [...KEYS.tracks(), "track", slug] as const,
};

export function useTracks(params?: Parameters<typeof tracksApi.get>[0]) {
    return useQuery({
        queryKey: [...KEYS.tracks(), params],
        queryFn: () => tracksApi.get(params),
    });
}

export function useTrack(slug: string) {
    return useQuery({
        queryKey: KEYS.track(slug),
        queryFn: () => tracksApi.getBySlug(slug),
    });
}

export function useCreateTrack() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: tracksApi.create,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: KEYS.tracks() });
        }
    });
}

export function useUpdateTrack() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...data }: { id: string; data: any }) =>
            tracksApi.update(id, data),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: KEYS.tracks() });
            qc.invalidateQueries({ queryKey: KEYS.track(id) });
        }
    });
}

export function useDeleteTrack() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => tracksApi.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.tracks() }),
    });
}
