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
    <Pagination>
        <PaginationContent>
            <PaginationPrevious onClick={() => goTo(currentPage - 1)} />
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
            <PaginationNext onClick={() => goTo(currentPage + 1)} />
        </PaginationContent>
    </Pagination>
);