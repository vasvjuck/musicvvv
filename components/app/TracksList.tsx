import React from 'react';
import { Track as TrackCard } from './Track';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music2 } from 'lucide-react';
import Link from 'next/link';
import type { components } from '@/lib/api/types';

type Track = components['schemas']['Track'];

interface TracksListProps {
    tracks: Track[];
    isLoading: boolean;
    selectedIds: string[];
    onSelect: (id: string, checked: boolean) => void;
}

export const TracksList: React.FC<TracksListProps> = ({
    tracks,
    isLoading,
    selectedIds,
    onSelect,
}) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 pb-6">
                {Array.from({ length: 8 }).map((_, idx) => (
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
                ))}
            </div>
        );
    }

    if (!tracks.length) {
        return (
            <Card className="max-w-md mx-auto mt-12 p-6">
                <CardHeader className="space-y-2">
                    <Music2 className="mx-auto h-12 w-12 text-muted-foreground" />
                    <CardTitle className="text-center text-lg">No Tracks Found</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                        We couldn't find any tracks here. Try adding new tracks or refresh the page.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 pb-6">
            {tracks.map(({ id, ...track }) => (
                <div key={id} className="relative">
                    <Checkbox
                        checked={selectedIds.includes(id)}
                        onCheckedChange={(checked) => onSelect(id, checked as boolean)}
                        className="absolute z-10 top-2 left-2"
                    />
                    <TrackCard track={{ id, ...track }} />
                </div>
            ))}
        </div>
    );
};