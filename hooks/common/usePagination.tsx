import { useCallback, useMemo } from "react";

export const usePagination = (
    totalPages: number,
    currentPage: number,
    setPage: void
) => {
    const goTo = useCallback(
        page => {
            const next = Math.max(1, Math.min(totalPages, page));
            setPage(next);
        },
        [totalPages, setPage]
    );

    const pages = useMemo(() => {
        const list = [];
        list.push(1);
        if (currentPage > 3) list.push('ellipsis');
        for (
            let p = Math.max(2, currentPage - 1);
            p <= Math.min(totalPages - 1, currentPage + 1);
            p++
        ) {
            list.push(p);
        }
        if (currentPage < totalPages - 2) list.push('ellipsis');
        if (totalPages > 1) list.push(totalPages);
        return list;
    }, [totalPages, currentPage]);

    return { pages, goTo };
}