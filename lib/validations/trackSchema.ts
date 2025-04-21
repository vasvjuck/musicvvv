import { z } from "zod";

export const trackSchema = z.object({
    title: z.string().min(1, "Title is required"),
    artist: z.string().min(1, "Artist is required"),
    album: z.string(),
    genres: z
        .array(z.string().min(1))
        .min(1, "At least one genre is required"),
    // coverImage: z
    //     .string()
    //     .url("Must be a valid URL")
    //     .optional()
    //     .or(z.literal("")),
});

export type TrackInput = z.infer<typeof trackSchema>;
