"use client"

import { useTable, type ColumnDef, type OnChangeFn, type PaginationState, type RowData, type SortingState } from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { features, featuresWithoutPagination, type DataTableFeatures } from "./data-table-features"

interface DataTableProps<TData extends RowData> {

    columns: ColumnDef<DataTableFeatures, TData>[]
    data: TData[]
    rowCount?: number
    pagination?: PaginationState
    onPaginationChange?: OnChangeFn<PaginationState>
    initialSorting?: SortingState
    emptyMessage?: string
    loading?: boolean
}

const pageSizeOptions = [20, 50, 100] as const

export function DataTable<TData extends RowData>({columns, data = [], rowCount, pagination, onPaginationChange, initialSorting = [], emptyMessage = "No results.", loading = false}: DataTableProps<TData>) {{
    const [sorting, setSorting] = useState<SortingState>(initialSorting);

    const isServerPaged = pagination !== undefined && onPaginationChange !== undefined;

    const table = useTable({
        features: (isServerPaged ? featuresWithoutPagination : features) as DataTableFeatures,
        data,
        columns,
        state: {
            sorting,
            ...(isServerPaged ? { pagination } : {}),
        },
        onSortingChange: setSorting,
        ...(isServerPaged
            ? {
                onPaginationChange,
                rowCount,
                autoResetPageIndex: false,
            }
            : {}),
        initialState: isServerPaged
            ? undefined
            : {
                pagination: {
                    pageIndex: 0,
                    pageSize: 20,
                },
            },
    })

    const { pageIndex, pageSize } = table.state.pagination;
    const pageCount = table.getPageCount();

    return (
        <div className="flex flex-col h-full rounded-md border overflow-hidden">
            <div className="relative flex-1 overflow-auto">
                {loading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
                        <svg
                            className="size-20 text-primary"
                            viewBox="0 0 300 150"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="15"
                                strokeLinecap="round"
                                strokeDasharray="300 385"
                                strokeDashoffset="0"
                                d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"
                            >
                                <animate
                                    attributeName="stroke-dashoffset"
                                    calcMode="spline"
                                    dur="2"
                                    values="685;-685"
                                    keySplines="0 0 1 1"
                                    repeatCount="indefinite"
                                />
                            </path>
                        </svg>
                    </div>
                )}
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="sticky top-0 z-20 bg-primary">
                                            {header.isPlaceholder ? null : (
                                                <table.FlexRender header={header} />
                                            )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="bg-white">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            <table.FlexRender cell={cell} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {pageCount > 0 && (
                <div className="flex flex-wrap items-center justify-end gap-x-8 gap-y-3 border-t bg-muted/50 px-6 py-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Baris per halaman</span>
                        <select
                            value={pageSize === Infinity ? "all" : String(pageSize)}
                            onChange={(event) =>
                                table.setPageSize(
                                    event.target.value === "all"
                                        ? Infinity
                                        : Number(event.target.value)
                                )
                            }
                            className="appearance-none text-center h-9 rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                            {pageSizeOptions.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                            <option value="all">Semua</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                            Halaman {pageIndex + 1} dari {Math.max(pageCount, 1)}
                        </span>
                        <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeftIcon />
                            <span className="sr-only">Halaman sebelumnya</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRightIcon />
                            <span className="sr-only">Halaman berikutnya</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
}