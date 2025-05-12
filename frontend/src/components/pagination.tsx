"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

type PaginationProps = {
    totalPages: number
    currentPage: number
    onPageChange: (page: number) => void
}

export const Pagination = ({ totalPages, currentPage, onPageChange }: PaginationProps) => {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = []
        const maxPagesToShow = 5

        if (totalPages <= maxPagesToShow) {
            // Show all pages if total pages is less than max pages to show
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
        } else {
            // Always show first page
            pageNumbers.push(1)

            // Calculate start and end of page range
            let start = Math.max(2, currentPage - 1)
            let end = Math.min(totalPages - 1, currentPage + 1)

            // Adjust if at the beginning
            if (currentPage <= 3) {
                end = Math.min(totalPages - 1, 4)
            }

            // Adjust if at the end
            if (currentPage >= totalPages - 2) {
                start = Math.max(2, totalPages - 3)
            }

            // Add ellipsis if needed
            if (start > 2) {
                pageNumbers.push("...")
            }

            // Add page numbers
            for (let i = start; i <= end; i++) {
                pageNumbers.push(i)
            }

            // Add ellipsis if needed
            if (end < totalPages - 1) {
                pageNumbers.push("...")
            }

            // Always show last page
            pageNumbers.push(totalPages)
        }

        return pageNumbers
    }

    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
                หน้า {currentPage} จาก {totalPages} หน้า
            </div>

            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8"
                    aria-label="First page"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center space-x-1">
                    {getPageNumbers().map((page, index) =>
                        typeof page === "number" ? (
                            <Button
                                key={index}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(page)}
                                className={`h-8 w-8 ${currentPage === page ? "bg-blue-600 text-white hover:bg-blue-700" : ""}`}
                            >
                                {page}
                            </Button>
                        ) : (
                            <span key={index} className="px-2">
                                {page}
                            </span>
                        ),
                    )}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8"
                    aria-label="Next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8"
                    aria-label="Last page"
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
