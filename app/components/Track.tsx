"use client";

import Image from "next/image";
import type { components } from "@/lib/api/types";

type Track = components["schemas"]["Track"];

interface TrackProps extends React.HTMLAttributes<HTMLDivElement> {
    track: Track;
}

export function Track({ track }: TrackProps) {
    const placeholder = `https://picsum.photos/seed/${encodeURIComponent(
        track.id
    )}/100/100`;

    return (
        <div
            className="group flex items-center gap-4 p-4 bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex-shrink-0">
                <div className="aspect-square w-16 overflow-hidden rounded-lg bg-muted">
                    <Image
                        src={track.coverImage || placeholder}
                        alt={track.title}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = placeholder;
                        }}
                    />
                </div>
            </div>
            <div className="flex-grow">
                <h3 className="text-sm font-semibold">
                    {track.title}
                </h3>
                <p className="text-xs text-muted-foreground">{track.artist}</p>
            </div>
        </div>
    );
}
