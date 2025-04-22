import { z } from 'zod';
import { trackSchema } from '@/lib/validations/trackSchema';
import { trackFileSchema } from '@/lib/validations/trackFileSchema';

export type TrackInput = z.infer<typeof trackSchema>;

export type FileInput = z.infer<typeof fileSchema>;

export interface Track extends TrackInput {
    id: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    audioFile?: string;
}

export interface TrackParams {
    page?: number;
    limit?: number;
    search?: string;
    genre?: string;
}

export interface ApiError {
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
}