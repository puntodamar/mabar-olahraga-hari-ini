"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AdminSchedule } from "@/src/types/AdminSchedule";
import { Day } from "@/src/types/enums/Day";

interface ScheduleDeleteDialogProps {
    schedule: AdminSchedule | null;
    onOpenChange: (open: boolean) => void;
    onDeleted: () => void;
}

export default function ScheduleDeleteDialog({
    schedule,
    onOpenChange,
    onDeleted,
}: ScheduleDeleteDialogProps) {
    const [removing, setRemoving] = useState(false);
    const [error, setError] = useState("");

    const confirm = useCallback(async () => {
        if (!schedule) return;
        setRemoving(true);
        setError("");
        try {
            const response = await fetch(`/api/admin/schedules/${schedule.id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete schedule");
            onOpenChange(false);
            onDeleted();
        } catch (e) {
            console.error(e);
            setError("Gagal menghapus jadwal.");
        } finally {
            setRemoving(false);
        }
    }, [schedule, onOpenChange, onDeleted]);

    return (
        <Dialog
            open={schedule != null}
            onOpenChange={(next) => {
                if (!next) onOpenChange(false);
            }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Hapus jadwal?</DialogTitle>
                    <DialogDescription>
                        {schedule &&
                            `PB. ${schedule.community?.name ?? "-"} · ${Day[schedule.day - 1] ?? "-"} · ${schedule.time_start.slice(0, 5)} - ${schedule.time_end.slice(0, 5)}`}
                    </DialogDescription>
                </DialogHeader>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <DialogFooter className="mt-4">
                    <DialogClose render={<Button variant="outline" type="button" disabled={removing} />}>
                        Batal
                    </DialogClose>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={removing}
                        onClick={confirm}
                    >
                        {removing ? "Menghapus..." : "Hapus"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
