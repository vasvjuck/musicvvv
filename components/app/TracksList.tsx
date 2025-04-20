import { Track } from "@/components/app/Track";
import { Skeleton } from "@/components/ui/skeleton";

export const TracksList = ({ tracks, isLoading, limit }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 pb-6">
        {isLoading
            ? Array.from({ length: limit }).map((_, idx) => (
                <div
                    key={idx}
                    className="relative flex flex-col justify-between gap-4 p-4 bg-card rounded-2xl shadow-sm animate-pulse"
                >
                    <div className="flex items-center gap-4 justify-between w-full">
                        <Skeleton className="w-16 h-16 rounded-lg" />
                        <div className="flex-grow space-y-2">
                            <Skeleton className="h-4 w-3/4 rounded-md" />
                            <Skeleton className="h-3 w-1/2 rounded-md" />
                        </div>
                    </div>
                    <Skeleton className="w-8 h-8 rounded-full absolute bottom-2 right-2" />
                </div>
            ))
            : tracks.map((track) => <Track key={track.id} track={track} />)}
    </div>
);
