import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tracksApi } from "@/lib/api/tracks";
import { KEYS } from "@/hooks/api/useTracks";

export const useUploadTrackFile = (trackId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (file: File) => tracksApi.uploadFile(trackId, file),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: KEYS.track(trackId) });
            qc.invalidateQueries({ queryKey: KEYS.tracks() });
        },
    });
}

export const useRemoveTrackFile = (trackId: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => tracksApi.deleteFile(trackId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: KEYS.track(trackId) });
            qc.invalidateQueries({ queryKey: KEYS.tracks() });
        },
    });
}