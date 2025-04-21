import { z } from "zod";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ["audio/mpeg", "audio/wav"];

export const fileSchema = z.object({
    file: z
        .instanceof(File)
        .refine((file) => ALLOWED_TYPES.includes(file.type), {
            message: "Only MP3, MP4 or WAV files are allowed.",
        })
        .refine((file) => file.size <= MAX_SIZE, {
            message: "File must be smaller than 10 MB.",
        }),
});

export type FileInput = z.infer<typeof fileSchema>;
