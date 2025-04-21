import Image from "next/image";
import { PlayIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { components } from "@/lib/api/types";
import { DeleteTrack } from "./actions/DeleteTrack";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { EditTrack } from "./actions/EditTrack";
import { UploadTrackFile } from "./actions/UploadTrackFile";
import { registerAndToggle } from "@/lib/common/audioManager";

type Track = components["schemas"]["Track"];

interface TrackProps extends React.HTMLAttributes<HTMLDivElement> {
    track: Track;
}

export const Track = ({ track }: TrackProps) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const audioUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/files/${track?.audioFile}`;

    const toggleAudio = () => {
        if (!audioRef.current) return;
        registerAndToggle(audioRef.current, setIsPlaying);
    };

    useEffect(() => {
        const audioEl = audioRef.current;
        if (!audioEl) return;

        if (isPlaying) {
            audioEl.play();
        } else {
            audioEl.pause();
        }
    }, [isPlaying]);

    return (
        <div className="group relative flex flex-col justify-between gap-4 p-4 bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 justify-between w-full">
                <div className="flex-shrink-0">
                    <div className="aspect-square w-16 overflow-hidden rounded-lg bg-muted">
                        <Image
                            src={track?.coverImage || '/track_placeholder.png'}
                            alt={track.title}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
                <div className="flex-grow">
                    <h3 className="text-sm font-semibold">{track.title}</h3>
                    <p className="text-xs text-muted-foreground">{track.artist}</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex gap-1 items-center md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                        <UploadTrackFile track={track} />
                        <EditTrack track={track} />
                        <DeleteTrack
                            trackId={track.id}
                            trackTitle={track.title}
                        />
                    </div>
                    {track.audioFile && (
                        <Button variant="outline" size="icon" onClick={toggleAudio} className="gap-0.5">
                            <audio ref={audioRef} className="hidden" src={audioUrl} />
                            {isPlaying ? (
                                <>
                                    {[1, 2, 3, 4].map(bar => (
                                        <div
                                            key={bar}
                                            className={clsx("indicator-line active")}
                                            style={{ animationDelay: `${bar * 0.1}s` }}
                                        />
                                    ))}
                                </>
                            ) : (
                                <PlayIcon size={16} />
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};