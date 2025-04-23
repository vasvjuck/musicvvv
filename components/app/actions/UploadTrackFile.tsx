"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Form as ShadcnForm,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useUploadTrackFile, useRemoveTrackFile } from "@/hooks/api/useTrackFile";
import { registerAndToggle } from "@/lib/common/audioManager";
import { FileInput, fileSchema } from "@/lib/validations/trackFileSchema";
import { Track } from "@/schema";

interface UploadTrackFileProps {
    track: Track;
}

export const UploadTrackFile: React.FC<UploadTrackFileProps> = ({ track }) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    const [open, setOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const upload = useUploadTrackFile(track.id);
    const remove = useRemoveTrackFile(track.id);

    const form = useForm<FileInput>({
        resolver: zodResolver(fileSchema),
        defaultValues: { file: undefined },
    });

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { isSubmitting },
    } = form;

    const selectedFile = watch("file");

    const onSubmit = async ({ file }: FileInput) => {
        try {
            await upload.mutateAsync(file);
            toast.success("Audio file uploaded.");
            reset();
        } catch (err: any) {
            toast.error("Upload failed", { description: err.message });
        }
    };

    const handleRemove = async () => {
        try {
            await remove.mutateAsync();
            toast.success("Audio file removed.");
        } catch (err: any) {
            toast.error("Remove failed", { description: err.message });
        }
    };

    const audioUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/files/${track?.audioFile}`;

    const toggleAudioPreview = () => {
        if (!audioRef.current) return;
        registerAndToggle(audioRef.current, setIsPlaying);
    };

    useEffect(() => {
        const audioEl = audioRef.current;
        if (!audioEl) return;
        if (isPlaying) audioEl.play();
        else audioEl.pause();
    }, [isPlaying]);

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <Upload size={16} />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Upload Audio File</DialogTitle>
                        <DialogDescription>
                            Add or replace the audio file for this track. Max size 10 MB.
                        </DialogDescription>
                    </DialogHeader>
                    {!track?.audioFile ? (
                        <ShadcnForm {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <FormItem>
                                    <FormLabel>Select File</FormLabel>
                                    <FormControl>
                                        <Controller
                                            name="file"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    className="cursor-pointer"
                                                    type="file"
                                                    accept=".mp3, .mp4, .wav"
                                                    onChange={(e) => field.onChange(e.target.files?.[0])}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                <div className="flex justify-end space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setOpen(false)}
                                        disabled={isSubmitting || upload.isPending}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={!selectedFile || isSubmitting || upload.isPending}
                                    >
                                        {upload.isPending ? "Uploading…" : "Upload"}
                                    </Button>
                                </div>
                            </form>
                        </ShadcnForm>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <audio
                                onPlay={toggleAudioPreview}
                                onPause={() => setIsPlaying(false)}
                                ref={audioRef}
                                controls
                                src={audioUrl}
                            />
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleRemove}
                                disabled={remove.isPending}
                            >
                                <Trash2 className="mr-1" size={16} />
                                Remove
                            </Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};
