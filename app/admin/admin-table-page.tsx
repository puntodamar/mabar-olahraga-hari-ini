"use client"

import { useCallback, useMemo, useState, type ReactNode } from "react"
import type { ColumnDef, OnChangeFn, PaginationState, RowData } from "@tanstack/react-table"
import { PlusIcon, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "./schedules/data-table"
import type { DataTableFeatures } from "./schedules/data-table-features"

interface AdminTableDialogState<T> {
    open: boolean
    onOpenChange: (open: boolean) => void
    editing: T | null
    onSaved: () => void
}

interface AdminTablePageProps<T extends RowData> {
    rows: T[]
    total: number
    loading: boolean
    refreshing: boolean
    error: string
    pagination: PaginationState
    onPaginationChange: OnChangeFn<PaginationState>
    search: string
    onSearchChange: (value: string) => void
    reload: () => void
    columns: (onEdit: (row: T) => void) => ColumnDef<DataTableFeatures, T>[]
    countLabel: (total: number) => string
    searchLabel: string
    loadingLabel: string
    addLabel: string
    emptyMessage: string
    dialog: (state: AdminTableDialogState<T>) => ReactNode
}

export function AdminTablePage<T extends RowData>({
    rows,
    total,
    loading,
    refreshing,
    error,
    pagination,
    onPaginationChange,
    search,
    onSearchChange,
    reload,
    columns: buildColumns,
    countLabel,
    searchLabel,
    loadingLabel,
    addLabel,
    emptyMessage,
    dialog,
}: AdminTablePageProps<T>) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<T | null>(null)

    const handleAdd = useCallback(() => {
        setEditing(null)
        setDialogOpen(true)
    }, [])

    const handleEdit = useCallback((row: T) => {
        setEditing(row)
        setDialogOpen(true)
    }, [])

    const columns = useMemo(() => buildColumns(handleEdit), [buildColumns, handleEdit])

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex items-center justify-between gap-4">

                {!loading && (
                    <>
                        <div className="flex items-center gap-3">
                            <div className="relative overflow-visible">
                                <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="search"
                                    tabIndex={-1}
                                    value={search}
                                    onChange={(event) => onSearchChange(event.target.value)}
                                    placeholder={searchLabel}
                                    aria-label={searchLabel}
                                    className="w-56 pl-8 overflow-visible"
                                    autoComplete="off"
                                />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {!loading && countLabel(total)}
                            </p>
                        </div>
                        <Button onClick={handleAdd} className="text-white">
                            <PlusIcon />
                            <span>{addLabel}</span>
                        </Button>
                    </>
                )}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex-1 overflow-hidden">
                {loading ? (
                    <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
                        {loadingLabel}
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={rows}
                        rowCount={total}
                        pagination={pagination}
                        onPaginationChange={onPaginationChange}
                        loading={refreshing}
                        emptyMessage={emptyMessage}
                    />
                )}
            </div>

            {dialog({ open: dialogOpen, onOpenChange: setDialogOpen, editing, onSaved: reload })}
        </div>
    )
}