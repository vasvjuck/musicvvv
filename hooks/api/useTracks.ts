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
    list: (params?: TrackParams) =>
        [...trackKeys.lists(), params ?? {}] as const,
    detail: (identifier: string) =>
        [...trackKeys.all, 'detail', identifier] as const,
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
};

export const useTrack = (
    identifier: string,
    options?: UseQueryOptions<Track, ApiError>
) => {
    return useQuery<Track, ApiError>({
        queryKey: trackKeys.detail(identifier),
        queryFn: () => tracksApi.getBySlug(identifier),
        ...options,
    });
};

export const useCreateTrack = (
    options?: MutationConfig<Track, TrackInput>
) => {
    const queryClient = useQueryClient();
    return useMutation<Track, ApiError, TrackInput>({
        mutationFn: (newTrack) => tracksApi.create(newTrack),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: trackKeys.lists() });
        },
        ...options,
    });
};

export const useUpdateTrack = (
    options?: MutationConfig<Track, { id: string } & Partial<TrackInput>>
) => {
    const queryClient = useQueryClient();
    return useMutation<Track, ApiError, { id: string } & Partial<TrackInput>>({
        mutationFn: ({ id, ...data }) => tracksApi.update(id, data),
        onMutate: async (variables) => {
            const { id, ...newData } = variables;
            await queryClient.cancelQueries({ queryKey: trackKeys.lists() });
            await queryClient.cancelQueries({ queryKey: trackKeys.detail(id) });

            const previousList = queryClient.getQueryData<Track[]>(trackKeys.lists());
            const previousDetail = queryClient.getQueryData<Track>(trackKeys.detail(id));

            if (previousList) {
                queryClient.setQueryData<Track[]>(trackKeys.lists(), (old = []) =>
                    old.map((t) => (t.id === id ? { ...t, ...newData } : t))
                );
            }
            if (previousDetail) {
                queryClient.setQueryData<Track>(trackKeys.detail(id), {
                    ...previousDetail,
                    ...newData,
                });
            }

            return { previousList, previousDetail };
        },
        onError: (_err, variables, context) => {
            if (context?.previousList) {
                queryClient.setQueryData(trackKeys.lists(), context.previousList);
            }
            if (context?.previousDetail) {
                queryClient.setQueryData(trackKeys.detail(variables.id), context.previousDetail);
            }
        },
        onSettled: (_data, _error, variables) => {
            queryClient.invalidateQueries({ queryKey: trackKeys.lists() });
            queryClient.invalidateQueries({ queryKey: trackKeys.detail(variables.id) });
        },
        ...options,
    });
};

export const useDeleteTrack = (
    options?: MutationConfig<void, string>
) => {
    const queryClient = useQueryClient();
    return useMutation<void, ApiError, string>({
        mutationFn: (id) => tracksApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: trackKeys.lists() });
            queryClient.removeQueries({ queryKey: trackKeys.detail(id) });
        },
        ...options,
    });
};

export const useDeleteTracks = (
    options?: MutationConfig<void, string[]>
) => {
    const queryClient = useQueryClient();
    return useMutation<void, ApiError, string[]>({
        mutationFn: (ids) => tracksApi.deleteAll(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: trackKeys.lists() });
        },
        ...options,
    });
};
