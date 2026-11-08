"use client";

import { useCallback, useMemo, useState } from "react";
import { AdminTablePage } from "../admin-table-page";
import { getScheduleColumns } from "./table/columns";
import ScheduleFilter, { defaultScheduleFilters, ScheduleFilters } from "./schedule-filter";
import ScheduleFormDialog from "./schedule-form-dialog";
import ScheduleDeleteDialog from "./schedule-delete-dialog";
import { usePaginatedFetch } from "@/hooks/use-paginated-fetch";
import { AdminSchedule } from "@/src/types/AdminSchedule";

export default function ScheduleManager() {
    const [filters, setFilters] = useState<ScheduleFilters>(defaultScheduleFilters);
    const [deleting, setDeleting] = useState<AdminSchedule | null>(null);

    const filtersQuery = useMemo(() => {
        const params = new URLSearchParams();
        if (filters.day != null) params.set("day", String(filters.day));
        if (filters.level != null) params.set("level", String(filters.level));
        if (filters.communityId != null) params.set("community", String(filters.communityId));
        if (filters.venueId != null) params.set("venue", String(filters.venueId));
        return params.toString();
    }, [filters]);

    const paginated = usePaginatedFetch<AdminSchedule>({
        url: "/api/admin/schedules",
        errorMessage: "Gagal memuat jadwal.",
        filtersQuery,
    });

    const { reload } = paginated;

    const requestDelete = useCallback((schedule: AdminSchedule) => {
        setDeleting(schedule);
    }, []);

    return (
        <>
            <AdminTablePage
                {...paginated}
                onSearchChange={paginated.setSearch}
                columns={(onEdit) => getScheduleColumns(onEdit, requestDelete)}
                countLabel={(total) => `${total} jadwal`}
                searchLabel="Cari nama komunitas..."
                loadingLabel="Memuat jadwal..."
                addLabel="Tambah Jadwal"
                emptyMessage="Belum ada jadwal."
                filters={<ScheduleFilter value={filters} onChange={setFilters} />}
                dialog={({ open, onOpenChange, editing, onSaved }) => (
                    <ScheduleFormDialog
                        open={open}
                        onOpenChange={onOpenChange}
                        schedule={editing}
                        onSaved={onSaved}
                    />
                )}
            />

            <ScheduleDeleteDialog
                schedule={deleting}
                onOpenChange={(next) => {
                    if (!next) setDeleting(null);
                }}
                onDeleted={reload}
            />
        </>
    );
}
