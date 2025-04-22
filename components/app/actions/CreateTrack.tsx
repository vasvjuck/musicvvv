"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/app/Form";
import { toast } from "sonner";
import { useCreateTrack } from "@/hooks/api/useTracks";
import { TrackInput } from '@/schema'
export const CreateTrack = () => {
    const [open, setOpen] = useState(false);

    const createTrack = useCreateTrack();

    const onSubmit = async (values: TrackInput) => {
        try {
            await createTrack.mutateAsync(values);
            toast.success("New track added", {
                description: `"${values.title}" by ${values.artist} has been created.`,
            });
            setOpen(false);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "There was a problem creating your track.";
            toast.error("Error creating track", {
                description: message,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button data-testid="create-track-button">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Track
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add a new track</DialogTitle>
                    <DialogDescription>
                        Enter metadata for your new track.
                    </DialogDescription>
                </DialogHeader>
                <Form onSubmit={onSubmit} />
            </DialogContent>
        </Dialog >
    );
}
