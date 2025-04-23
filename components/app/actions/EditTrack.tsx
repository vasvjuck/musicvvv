"use client";

import { useState } from "react";
import { Edit } from "lucide-react";
import {
    Dialog, DialogTrigger, DialogContent,
    DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/app/Form";
import { toast } from "sonner";
import { useUpdateTrack } from "@/hooks/api/useTracks";
import { Track, TrackInput } from '@/schema'
interface EditTrackProps {
    track: Track;
}

export const EditTrack = ({ track }: EditTrackProps) => {
    const [open, setOpen] = useState(false);
    const updateTrack = useUpdateTrack();

    const onSubmit = async (values: TrackInput) => {
        try {
            setOpen(false);
            await updateTrack.mutateAsync({ ...values, id: track.id });
            toast.success(`"${values.title}" updated.`);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "There was a problem editing your track.";
            toast.error("Error editing track", {
                description: message,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    data-testid={`edit-track-${track?.id}`}
                >
                    <Edit size={16} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit track</DialogTitle>
                    <DialogDescription>Modify the metadata below.</DialogDescription>
                </DialogHeader>
                <Form
                    initialValues={{
                        title: track?.title,
                        artist: track?.artist,
                        album: track?.album || "",
                        genres: track?.genres,
                        coverImage: track?.coverImage || "",
                    }}
                    submitLabel="Save changes"
                    onSubmit={onSubmit}
                />
            </DialogContent>
        </Dialog>
    );
}
