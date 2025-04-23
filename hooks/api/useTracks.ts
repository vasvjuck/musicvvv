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
    Meta,
} from '@/schema';

export const trackKeys = {
    all: ['tracks'] as const,
    lists: () => [...trackKeys.all, 'list'] as const,
    list: (params?: TrackParams) =>
        [...trackKeys.lists(), params ?? {}] as const,
};

export type MutationConfig<
    TData,
    TVariables,
    TContext = unknown
> = Omit<
    UseMutationOptions<TData, ApiError, TVariables, TContext>,
    'mutationFn'
>;

type TrackList = { data: Track[]; meta: Meta };

export const useTracks = (
    params?: TrackParams,
    options?: UseQueryOptions<TrackList, ApiError>
) => {
    return useQuery<TrackList, ApiError>({
        queryKey: trackKeys.list(params),
        // @ts-ignore
        queryFn: () => tracksApi.get(params),
        ...options,
    });
};

export const useCreateTrack = (
    options?: MutationConfig<Track, TrackInput>
) => {
    const queryClient = useQueryClient();
    return useMutation<Track, ApiError, TrackInput>({
        mutationFn: (newTrack) => tracksApi.create(newTrack),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: trackKeys.lists() }),
        ...options,
    });
};

export const useUpdateTrack = (
    options?: MutationConfig<
        Track,
        { id: string } & Partial<TrackInput>,
        { previousList?: TrackList }
    >
) => {
    const queryClient = useQueryClient();
    const allQueries = queryClient.getQueryCache().findAll();
    const listQuery = allQueries.find(
        (q) =>
            Array.isArray(q.queryKey) &&
            q.queryKey[0] === 'tracks' &&
            q.queryKey[1] === 'list'
    );
    const params = (listQuery?.queryKey[2] as TrackParams) || undefined;
    const key = trackKeys.list(params);

    return useMutation<
        Track,
        ApiError,
        { id: string } & Partial<TrackInput>,
        { previousList?: TrackList }
    >({
        mutationFn: ({ id, ...data }) => tracksApi.update(id, data),
        onMutate: async ({ id, ...newData }) => {
            await queryClient.cancelQueries({ queryKey: key });

            const previousList = queryClient.getQueryData<TrackList>(key);

            if (previousList) {
                queryClient.setQueryData<TrackList>(key, (old) => ({
                    data: old?.data.map((t) =>
                        t.id === id ? { ...t, ...newData } : t
                    ) ?? [],
                    meta: previousList.meta,
                }));
            }

            return { previousList };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousList) {
                queryClient.setQueryData<TrackList>(key, context.previousList);
            }
        },
        onSettled: () =>
            queryClient.invalidateQueries({ queryKey: key }),
        ...options,
    });
};

export const useDeleteTrack = (
    options?: MutationConfig<void, string>
) => {
    const queryClient = useQueryClient();
    return useMutation<void, ApiError, string>({
        mutationFn: id => tracksApi.delete(id),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: trackKeys.lists() }),
        ...options,
    });
};

export const useDeleteTracks = (
    options?: MutationConfig<void, string[]>
) => {
    const queryClient = useQueryClient();
    return useMutation<void, ApiError, string[]>({
        mutationFn: ids => tracksApi.deleteAll(ids),
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: trackKeys.lists() }),
        ...options,
    });
};