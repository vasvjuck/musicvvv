'use client'

import { useState } from "react";
import { useTracks } from "@/hooks/api/useTracks";
import { Separator } from "@/components/ui/separator";
import { useDebouncedSearch } from "@/hooks/common/useDebounceSearch";
import { usePagination } from "@/hooks/common/usePagination";
import { FilterSelect, SearchInput, SortOrderToggle } from "@/components/app/FilterControls";
import { TracksList } from "@/components/app/TracksList";
import { PaginationControls } from "@/components/app/PaginationControls";
import { SORT_OPTIONS } from "@/lib/constants";
import { useGenres } from "@/hooks/api/useGenres";

export default function MusicPage() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('title');
  const [order, setOrder] = useState('asc');
  const [genre, setGenre] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useDebouncedSearch(searchTerm);
  const limit = 8;

  const { data, isLoading } = useTracks({
    page,
    limit,
    sort,
    order,
    genre: genre !== 'All' ? genre : undefined,
    search: debouncedSearch || undefined,
  });

  const { data: genres = [] } = useGenres()

  const totalPages = data?.meta?.totalPages || 1;
  const { pages, goTo } = usePagination(totalPages, page, setPage);

  const handleSortChange = (val: string) => { setSort(val); setPage(1); };
  const handleGenreChange = (val: string) => { setGenre(val); setPage(1); };
  const toggleOrder = () => {
    setOrder(order => (order === 'asc' ? 'desc' : 'asc')); setPage(1);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-112px)]">
      <div className="flex items-center gap-4 mb-4">
        <SearchInput value={searchTerm} onChange={setSearchTerm} />
        <FilterSelect
          label="Sort By"
          options={SORT_OPTIONS}
          value={sort}
          onChange={handleSortChange}
          width="140px"
        />
        <FilterSelect
          label="Genre"
          options={['All', ...genres]}
          value={genre}
          onChange={handleGenreChange}
        />
        <SortOrderToggle order={order} onToggle={toggleOrder} />
      </div>
      <Separator />
      <div className="flex-grow overflow-y-auto mt-4">
        <TracksList
          tracks={data?.data || []}
          isLoading={isLoading}
          limit={limit}
        />
      </div>
      <PaginationControls pages={pages} currentPage={page} goTo={goTo} />
    </div>
  );
}

