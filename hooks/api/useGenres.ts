import { useQuery } from "@tanstack/react-query";
import { genresApi } from "@/lib/api/genres";

const KEYS = {
    genres: () => ["genres"] as const,
};

export function useGenres() {
    return useQuery({
        queryKey: [...KEYS.genres()],
        queryFn: () => genresApi.get(),
    });
}