"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import debounce from "lodash.debounce";
import { useTracks } from "@/hooks/api/useTracks";
import { Track } from "@/components/app/Track";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { ArrowUp, ArrowDown } from "lucide-react";

const SORT_FIELDS = [
  { label: "Title", value: "title" },
  { label: "Artist", value: "artist" },
  { label: "Album", value: "album" },
  { label: "Genre", value: "genre" },
];

export default function MusicPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "8", 10);
  const sort = searchParams.get("sort") ?? "title";
  const order = searchParams.get("order") ?? "asc";
  const genreParam = searchParams.get("genre");
  const artistParam = searchParams.get("artist");
  const search = searchParams.get("search") ?? "";
  const genre = genreParam ?? "all";
  const artist = artistParam ?? "all";

  const [searchTerm, setSearchTerm] = useState(search);

  const updateSearch = useMemo(
    () =>
      debounce((value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) params.set("search", value);
        else params.delete("search");
        // params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
      }, 300),
    [searchParams, pathname, router]
  );

  useEffect(() => {
    updateSearch(searchTerm);
    return () => updateSearch.cancel();
  }, [searchTerm, updateSearch]);

  const { data: tracks, isLoading } = useTracks({
    page,
    limit,
    sort: sort as any,
    order: order as any,
    genre: genre !== "all" ? genre : undefined,
    artist: artist !== "all" ? artist : undefined,
    search: search || undefined,
  });

  const totalPages = tracks?.meta?.totalPages ?? 1;

  const goTo = (newPage: number) => {
    const clamped = Math.max(1, Math.min(totalPages, newPage));
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", `${clamped}`);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSelectChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const toggleOrder = () => {
    handleSelectChange("order", order === "asc" ? "desc" : "asc");
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
      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Search tracks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="min-w-[200px]"
        />

        <Select
          value={sort}
          onValueChange={(val) => handleSelectChange("sort", val)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Field</SelectLabel>
              {SORT_FIELDS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={artist}
          onValueChange={(val) => handleSelectChange("artist", val)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter Artist" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Artist</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Artist A">Artist A</SelectItem>
              <SelectItem value="Artist B">Artist B</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={genre}
          onValueChange={(val) => handleSelectChange("genre", val)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filter Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Genre</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Rock">Rock</SelectItem>
              <SelectItem value="Pop">Pop</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleOrder}
          className="ml-auto"
        >
          {order === "asc" ? <ArrowUp /> : <ArrowDown />}
        </Button>
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
              <Track key={track.id} track={track} />
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
                  onClick={() => goTo(itm as number)}
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
}
