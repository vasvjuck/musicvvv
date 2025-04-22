import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination";

export const PaginationControls = ({ pages, currentPage, goTo }) => (
    <Pagination className="mt-2 md:mt-0" data-testid="pagination">
        <PaginationContent>
            <PaginationPrevious
                data-testid="pagination-prev"
                onClick={() => goTo(currentPage - 1)}
            />
            {pages.map((itm, idx) => (
                <PaginationItem key={`${itm}-${idx}`}>
                    {itm === 'ellipsis' ? (
                        <PaginationEllipsis />
                    ) : (
                        <PaginationLink onClick={() => goTo(itm)} isActive={itm === currentPage}>
                            {itm}
                        </PaginationLink>
                    )}
                </PaginationItem>
            ))}
            <PaginationNext
                onClick={() => goTo(currentPage + 1)} data-testid="pagination-next"
            />
        </PaginationContent>
    </Pagination>
);