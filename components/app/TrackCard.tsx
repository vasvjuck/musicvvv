import Image from "next/image";
import { PlayIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteTrack } from "./actions/DeleteTrack";
import { useEffect, useRef, useState } from "react";
import { EditTrack } from "./actions/EditTrack";
import { UploadTrackFile } from "./actions/UploadTrackFile";
import { registerAndToggle } from "@/lib/common/audioManager";
import { cn } from "@/lib/utils";
import { Track } from '@/schema'

interface TrackProps extends React.HTMLAttributes<HTMLDivElement> {
    track: Track;
}

export const TrackCard = ({ track }: TrackProps) => {
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
        <div
            className="group relative flex flex-col justify-between gap-4 p-4 bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            data-testid={`track-item-${track?.id}`}
        >
            <div className="flex items-center gap-4 justify-between w-full">
                <div className="flex-shrink-0">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                        <Image
                            src={track?.coverImage || '/track_placeholder.png'}
                            alt={track.title}
                            width={72}
                            height={72}
                            className={cn("object-cover",
                                track.audioFile && "blur-xs")}
                        />
                        {track.audioFile && (
                            <div data-testid={`audio-player-${track?.id}`}>
                                <Button
                                    data-testid={!isPlaying ? `play-button-${track?.id}` : `pause-button-${track?.id}`}
                                    variant="link"
                                    size="icon"
                                    onClick={toggleAudio}
                                    className="absolute inset-0 m-auto flex items-center justify-center gap-0.5 bg-secondary rounded-full"
                                >
                                    <audio
                                        ref={audioRef}
                                        className="hidden"
                                        src={audioUrl}
                                    />
                                    {isPlaying ? (
                                        <div
                                            data-testid={`audio-progress-${track?.id}`}
                                        >
                                            {
                                                [1, 2, 3, 4].map(bar => (
                                                    <div
                                                        key={bar}
                                                        className="indicator-line active"
                                                        style={{ animationDelay: `${bar * 0.1}s` }}
                                                    />
                                                ))
                                            }
                                        </div>
                                    ) : (
                                        <PlayIcon size={16} />
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex-grow">
                    <h3
                        className="text-sm font-semibold"
                        data-testid={`track-item-${track?.id}-title`}
                    >
                        {track.title}
                    </h3>
                    <p
                        className="text-xs text-muted-foreground"
                        data-testid={`track-item-${track?.id}-artist`}
                    >
                        {track.artist}
                    </p>
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
                </div>
            </div >
        </div >
    );
};