import { api } from "./client";
import { paths } from "./types";

type GenreList = paths["/api/genres"]["get"]["responses"]["200"]["content"]["application/json"];

export const genresApi = {
    get: () =>
        api.get<GenreList>("/api/genres").then(res => res.data),
};
