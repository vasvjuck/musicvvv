
import {
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import { tracksApi } from '@/lib/api/tracks';
import type { Track, FileInput, ApiError } from '@/schema';
import { MutationConfig, trackKeys } from './useTracks';

export const useUploadTrackFile = (
    trackId: string,
    options?: MutationConfig<Track, FileInput>
) => {
    const qc = useQueryClient();
    return useMutation<Track, ApiError, FileInput>({
        mutationFn: (file) => tracksApi.uploadFile(trackId, file),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: trackKeys.detail(trackId) });
            qc.invalidateQueries({ queryKey: trackKeys.lists() });
        },
        ...options,
    });
}

export const useRemoveTrackFile = (
    trackId: string,
    options?: MutationConfig<Track, void>
) => {
    const qc = useQueryClient();
    return useMutation<Track, ApiError, void>({
        mutationFn: () => tracksApi.deleteFile(trackId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: trackKeys.detail(trackId) });
            qc.invalidateQueries({ queryKey: trackKeys.lists() });
        },
        ...options,
    });
}
