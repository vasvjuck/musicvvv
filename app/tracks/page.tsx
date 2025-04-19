"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTracks } from "@/hooks/useTracks";
import { Track } from "@/components/app/Track";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";

const MusicPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "8", 10);

  const { data: tracks, isLoading } = useTracks({ page, limit });

  const totalPages = tracks?.meta?.totalPages ?? 1;

  const goTo = (newPage: number) => {
    const clamped = Math.max(1, Math.min(totalPages, newPage));
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(clamped));
    params.set("limit", String(limit));
    router.push(`${pathname}?${params.toString()}`);
  };

  const pages: (number | "ellipsis")[] = [];
  pages.push(1);
  if (page > 3) pages.push("ellipsis");
  for (let p = Math.max(2, page - 1); p <= Math.min(totalPages - 1, page + 1); p++) {
    pages.push(p);
  }
  if (page < totalPages - 2) pages.push("ellipsis");
  if (totalPages > 1) pages.push(totalPages);

  return (
    <div className="flex flex-col h-[calc(100vh-112px)]">
      <div className="space-y-1 mb-4">
        <h2 className="text-2xl font-semibold tracking-tight">Listen Now</h2>
        <p className="text-sm text-muted-foreground">
          Top picks for you. Updated daily.
        </p>
      </div>

      <Separator />
      <div className="flex-grow overflow-y-auto mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 pb-6">
          {isLoading
            ? Array.from({ length: limit }).map((_, idx) => (
              <div
                key={idx}
                className="relative flex flex-col justify-between gap-4 p-4 bg-card rounded-2xl shadow-sm animate-pulse"
              >
                <div className="flex items-center gap-4 justify-between w-full">
                  <div className="flex-shrink-0">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                  </div>
                  <div className="flex-grow space-y-2">
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-3 w-1/2 rounded-md" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
              </div>
            ))
            : tracks?.data?.map((track) => (
              <Track
                key={track.id}
                track={track}
              />
            ))}
        </div>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => goTo(page - 1)} />
          </PaginationItem>
          {pages.map(itm =>
            itm === "ellipsis" ? (
              <PaginationItem key={`e${itm}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={itm}>
                <PaginationLink
                  onClick={() => goTo(itm)}
                  isActive={itm === page}
                >
                  {itm}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext onClick={() => goTo(page + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default MusicPage;
