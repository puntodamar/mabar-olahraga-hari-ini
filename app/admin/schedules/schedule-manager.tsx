"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { getScheduleColumns } from "./columns";
import ScheduleFormDialog from "./schedule-form-dialog";
import { AdminSchedule } from "@/src/types/AdminSchedule";

export default function ScheduleManager() {
    const [schedules, setSchedules] = useState<AdminSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<AdminSchedule | null>(null);

    const loadSchedules = useCallback(() => {
        fetch("/api/admin/schedules")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load schedules");
                }
                return response.json();
            })
            .then((data) => {
                setSchedules(data);
                setError("");
            })
            .catch((e) => {
                console.error(e);
                setError("Gagal memuat jadwal.");
            })
            .finally(() => setLoading(false));
    }, []);

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
                    {loading ? "Memuat jadwal..." : `${schedules.length} jadwal`}
                </p>
                <Button onClick={handleAdd} className="text-white">
                    <PlusIcon />
                    <span>Tambah Jadwal</span>
                </Button>
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
