import { useQuery } from "@tanstack/react-query";
import { genresApi } from "@/lib/api/genres";

const genresKeys = {
    all: () => ['genres'] as const,
};

export function useGenres() {
    return useQuery({
        queryKey: [...genresKeys.all()],
        queryFn: () => genresApi.get(),
    });
}