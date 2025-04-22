'use client';

import { useState, useMemo } from 'react';
import { useTracks } from '@/hooks/api/useTracks';
import { useGenres } from '@/hooks/api/useGenres';
import { useDebouncedSearch } from '@/hooks/common/useDebounceSearch';
import { usePagination } from '@/hooks/common/usePagination';
import { useDeleteTracks } from '@/hooks/api/useTracks';
import { Separator } from '@/components/ui/separator';
import { FilterSelect, SearchInput, SortOrderToggle } from '@/components/app/FilterControls';
import { TracksList } from '@/components/app/TracksList';
import { PaginationControls } from '@/components/app/PaginationControls';
import { SORT_OPTIONS } from '@/lib/constants';
import { toast } from 'sonner';
import { BulkActions } from '@/components/app/actions/BulkActions';

export default function MusicPage() {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [genre, setGenre] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  const { data: genres = [] } = useGenres();
  const totalPages = data?.meta?.totalPages || 1;
  const { pages, goTo } = usePagination(totalPages, page, setPage);

  const { mutate: deleteMutation } = useDeleteTracks();

  const allIds = useMemo(() => data?.data.map(t => t.id) ?? [], [data]);
  const isAllSelected = selectedIds.length > 0 && selectedIds.length === allIds.length;

  const handleSelectAll = (checked: boolean) =>
    setSelectedIds(checked ? allIds : []);

  const handleSelectOne = (id: string, checked: boolean) =>
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter(el => el !== id)
    );

  const handleSortChange = (val: string) => { setSort(val); setPage(1); };
  const handleGenreChange = (val: string) => { setGenre(val); setPage(1); };
  const toggleOrder = () => {
    setOrder(order => (order === 'asc' ? 'desc' : 'asc')); setPage(1);
  };

  const confirmDelete = () => {
    deleteMutation(selectedIds, {
      onSuccess: () => {
        toast.success("Tracks were successfully deleted");
        setSelectedIds([])
      },
      onError: () => toast.error("Deletion failed"),
    });
  };

  return (
    <div className="flex gap-5 flex-col h-[calc(100vh-112px)]">
      <BulkActions
        isAllSelected={isAllSelected}
        selectedCount={selectedIds.length}
        onSelectAll={handleSelectAll}
        onDelete={confirmDelete}
      />
      <div className="flex flex-col md:flex-row items-center gap-4">
        <SearchInput value={searchTerm} onChange={setSearchTerm} />
        <div className="flex items-center gap-4 w-full md:w-auto">
          <FilterSelect
            label="Sort By"
            options={SORT_OPTIONS}
            value={sort}
            onChange={handleSortChange}
            width="140px"
            testId="sort-select"
          />
          <FilterSelect
            label="Genre"
            options={['All', ...genres]}
            value={genre}
            onChange={handleGenreChange}
            testId="filter-genre"
          />
          <SortOrderToggle order={order} onToggle={toggleOrder} />
        </div>
      </div>
      <Separator />
      <div className="flex-grow overflow-y-auto">
        <TracksList
          tracks={data?.data || []}
          isLoading={isLoading}
          selectedIds={selectedIds}
          onSelect={handleSelectOne}
        />
      </div>
      <PaginationControls pages={pages} currentPage={page} goTo={goTo} />
    </div>
  );
}
