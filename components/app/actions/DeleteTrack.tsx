"use client";

import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useDeleteTrack } from "@/hooks/api/useTracks";

interface DeleteTrackButtonProps {
    trackId: string;
    trackTitle: string;
}

export const DeleteTrackButton = ({ trackId, trackTitle }: DeleteTrackButtonProps) => {
    const { mutate: deleteTrack, isLoading: isDeleting } = useDeleteTrack();

    const handleConfirm = () => {
        deleteTrack(trackId, {
            onSuccess: () => {
                toast.success("Track deleted", {
                    description: `${trackTitle} was successfully deleted.`,
                });
            },
            onError: (error: any) => {
                toast.error("Deletion failed", {
                    description: error?.message || "Unable to delete track.",
                });
            },
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="destructive"
                    size="icon"
                    aria-label="Delete track"
                    disabled={isDeleting}
                >
                    <Trash2Icon className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete track?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete "{trackTitle}"? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} disabled={isDeleting}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}