"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { getScheduleColumns } from "./columns";
import ScheduleFormDialog from "./schedule-form-dialog";
import { AdminSchedule } from "@/src/types/AdminSchedule";

export default function ScheduleManager() {
    const [schedules, setSchedules] = useState<AdminSchedule[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<AdminSchedule | null>(null);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });
    const totalRef = useRef(0);

    const handlePaginationChange = useCallback((updater: PaginationState | ((old: PaginationState) => PaginationState)) => {
        setPagination(updater);
    }, []);

    const loadSchedules = useCallback(() => {
        const size = pagination.pageSize;
        let page = pagination.pageIndex;
        if (Number.isFinite(size) && totalRef.current > 0) {
            page = Math.min(page, Math.max(0, Math.ceil(totalRef.current / size) - 1));
        }
        const params = new URLSearchParams();
        if (Number.isFinite(size)) {
            params.set("page", String(page));
            params.set("pageSize", String(size));
        }
        const query = params.toString();

        Promise.resolve()
            .then(() => setRefreshing(true))
            .then(() => fetch(`/api/admin/schedules${query ? `?${query}` : ""}`))
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load schedules");
                }
                return response.json();
            })
            .then((data) => {
                totalRef.current = data.total;
                setSchedules(data.data);
                setTotal(data.total);
                setError("");
                if (page !== pagination.pageIndex) {
                    setPagination((old) => (old.pageIndex === page ? old : { ...old, pageIndex: page }));
                }
            })
            .catch((e) => {
                console.error(e);
                setError("Gagal memuat jadwal.");
            })
            .finally(() => {
                setLoading(false);
                setRefreshing(false);
            });
    }, [pagination]);

    useEffect(() => {
        void loadSchedules();
    }, [loadSchedules]);

    const handleAdd = useCallback(() => {
        setEditing(null);
        setDialogOpen(true);
    }, []);

    const handleEdit = useCallback((schedule: AdminSchedule) => {
        setEditing(schedule);
        setDialogOpen(true);
    }, []);

    const columns = useMemo(() => getScheduleColumns(handleEdit), [handleEdit]);

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                    {!loading &&`${total} jadwal`}
                </p>
                {!loading && (
                    <Button onClick={handleAdd} className="text-white">
                        <PlusIcon />
                        <span>Tambah Jadwal</span>
                    </Button>
                )}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex-1 overflow-hidden">
                {loading ? (
                    <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
                        Memuat jadwal...
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={schedules}
                        rowCount={total}
                        pagination={pagination}
                        onPaginationChange={handlePaginationChange}
                        loading={refreshing}
                        emptyMessage="Belum ada jadwal."
                    />
                )}
            </div>

            <ScheduleFormDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                schedule={editing}
                onSaved={loadSchedules}
            />
        </div>
    );
}