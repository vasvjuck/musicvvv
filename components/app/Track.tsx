import Image from "next/image";
import { PlayIcon, EditIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { components } from "@/lib/api/types";
import { DeleteTrackButton } from "./actions/DeleteTrack";

// todo
type Track = components["schemas"]["Track"];

interface TrackProps extends React.HTMLAttributes<HTMLDivElement> {
    track: Track;
}

export const Track = ({ track }: TrackProps) => {
    const placeholder = `https://picsum.photos/seed/${encodeURIComponent(
        track.id
    )}/100/100`;

    return (
        <div
            className="group relative flex flex-col justify-between gap-4 p-4 bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex items-center gap-4 justify-between w-full">
                <div className="flex-shrink-0">
                    <div className="aspect-square w-16 overflow-hidden rounded-lg bg-muted">
                        <Image
                            src={track.coverImage || placeholder}
                            alt={track.title}
                            width={100}
                            height={100}
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = placeholder;
                            }}
                            className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-125"
                        />
                    </div>
                </div>
                <div className="flex-grow">
                    <h3 className="text-sm font-semibold">{track.title}</h3>
                    <p className="text-xs text-muted-foreground">{track.artist}</p>
                </div>
            </div>

            <div className="flex gap-1 items-center md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => console.log("edit")}
                    aria-label="Edit track"
                >
                    <EditIcon className="h-4 w-4" />
                </Button>
                <DeleteTrackButton
                    trackId={track.id}
                    trackTitle={track.title}
                />
            </div>

            <Button
                variant="outline"
                size="icon"
                onClick={() => console.log("play")}
                aria-label="Play track"
                className="absolute bottom-2 right-2 z-10"
            >
                <PlayIcon className="h-4 w-4" />
            </Button>
        </div>
    );
}
