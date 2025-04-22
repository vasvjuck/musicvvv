import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryOptions,
    UseMutationOptions,
} from '@tanstack/react-query';
import { tracksApi } from '@/lib/api/tracks';
import type {
    Track,
    TrackParams,
    TrackInput,
    ApiError,
} from '@/schema';

export const trackKeys = {
    all: ['tracks'] as const,
    lists: () => [...trackKeys.all, 'list'] as const,
    list: (params?: TrackParams) => [...trackKeys.lists(), params ?? {}] as const,
    detail: (identifier: string) => [...trackKeys.all, 'detail', identifier] as const,
};

export type MutationConfig<TData, TVariables> = Omit<
    UseMutationOptions<TData, ApiError, TVariables>,
    'mutationFn'
>;

export const useTracks = (
    params?: TrackParams,
    options?: UseQueryOptions<Track[], ApiError>
) => {
    return useQuery<Track[], ApiError>({
        queryKey: trackKeys.list(params),
        queryFn: () => tracksApi.get(params),
        ...options,
    });
}

export const useTrack = (
    identifier: string,
    options?: UseQueryOptions<Track, ApiError>
) => {
    return useQuery<Track, ApiError>({
        queryKey: trackKeys.detail(identifier),
        queryFn: () => tracksApi.getBySlug(identifier),
        ...options,
    });
}

export const useCreateTrack = (
    options?: MutationConfig<Track, TrackInput>
) => {
    const qc = useQueryClient();
    return useMutation<Track, ApiError, TrackInput>({
        mutationFn: (newTrack) => tracksApi.create(newTrack),
        onSuccess: (data, variables, context) => {
            qc.invalidateQueries({ queryKey: trackKeys.lists() });
            options?.onSuccess?.(data, variables, context);
        },
        ...options,
    });
}

export const useUpdateTrack = (
    options?: MutationConfig<Track, { id: string } & Partial<TrackInput>>
) => {
    const qc = useQueryClient();
    return useMutation<Track, ApiError, { id: string } & Partial<TrackInput>>({
        mutationFn: ({ id, ...data }) => tracksApi.update(id, data),
        onMutate: async (variables) => {
            const { id, ...newData } = variables;
            await qc.cancelQueries({ queryKey: trackKeys.lists() });
            await qc.cancelQueries({ queryKey: trackKeys.detail(id) });

            const previousList = qc.getQueryData<Track[]>(trackKeys.lists());
            const previousDetail = qc.getQueryData<Track>(trackKeys.detail(id));

            if (previousList) {
                qc.setQueryData<Track[]>(trackKeys.lists(), (old = []) =>
                    old.map((t) => (t.id === id ? { ...t, ...newData } : t))
                );
            }
            if (previousDetail) {
                qc.setQueryData<Track>(trackKeys.detail(id), {
                    ...previousDetail,
                    ...newData,
                });
            }

            return { previousList, previousDetail };
        },
        onError: (_err, variables, context) => {
            if (context?.previousList) {
                qc.setQueryData(trackKeys.lists(), context.previousList);
            }
            if (context?.previousDetail) {
                qc.setQueryData(trackKeys.detail(variables.id), context.previousDetail);
            }
        },
        onSettled: (_data, _error, variables) => {
            qc.invalidateQueries({ queryKey: trackKeys.lists() });
            qc.invalidateQueries({ queryKey: trackKeys.detail(variables.id) });
        },
        ...options,
    });
}

export const useDeleteTrack = (
    options?: MutationConfig<void, string>
) => {
    const qc = useQueryClient();
    return useMutation<void, ApiError, string>({
        mutationFn: (id) => tracksApi.delete(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: trackKeys.lists() });
            qc.removeQueries({ queryKey: trackKeys.detail(id) });
        },
        ...options,
    });
}

export const useDeleteTracks = (
    options?: MutationConfig<void, string[]>
) => {
    const qc = useQueryClient();
    return useMutation<void, ApiError, string[]>({
        mutationFn: (ids) => tracksApi.deleteAll(ids),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: trackKeys.lists() });
        },
        ...options,
    });
}