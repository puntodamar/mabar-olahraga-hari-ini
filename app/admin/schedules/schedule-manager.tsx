"use client";

import { AdminTablePage } from "../admin-table-page";
import { getScheduleColumns } from "./columns";
import ScheduleFormDialog from "./schedule-form-dialog";
import { usePaginatedFetch } from "@/hooks/use-paginated-fetch";
import { AdminSchedule } from "@/src/types/AdminSchedule";

export default function ScheduleManager() {
    const paginated = usePaginatedFetch<AdminSchedule>({
        url: "/api/admin/schedules",
        errorMessage: "Gagal memuat jadwal.",
    });

    return (
        <AdminTablePage
            {...paginated}
            onSearchChange={paginated.setSearch}
            columns={getScheduleColumns}
            countLabel={(total) => `${total} jadwal`}
            searchLabel="Cari nama komunitas..."
            loadingLabel="Memuat jadwal..."
            addLabel="Tambah Jadwal"
            emptyMessage="Belum ada jadwal."
            dialog={({ open, onOpenChange, editing, onSaved }) => (
                <ScheduleFormDialog
                    open={open}
                    onOpenChange={onOpenChange}
                    schedule={editing}
                    onSaved={onSaved}
                />
            )}
        />
    );
}