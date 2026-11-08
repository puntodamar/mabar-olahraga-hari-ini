"use client";

import { useCallback, useMemo, useState } from "react";
import { FilterIcon } from "lucide-react";
import { AdminTablePage } from "../admin-table-page";
import { getScheduleColumns } from "./columns";
import ScheduleFormDialog from "./schedule-form-dialog";
import SelectFilter from "@/components/ui/filter/select-filter";
import AsyncSelectFilter from "@/components/ui/filter/async-select-filter";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { usePaginatedFetch } from "@/hooks/use-paginated-fetch";
import { AdminSchedule } from "@/src/types/AdminSchedule";
import { Day } from "@/src/types/enums/Day";
import { Level } from "@/src/types/enums/Level";

const filterDayItems = [
    { label: "Semua", value: null as number | null },
    ...Day.map((label, index) => ({ label, value: index + 1 })),
];
const filterLevelItems = [
    { label: "Semua", value: null as number | null },
    ...Level.map((label, index) => ({ label, value: index })),
];

interface CommunityOption {
    id: number;
    name: string | null;
}

interface VenueOption {
    id: number;
    name: string;
}

interface ScheduleFilters {
    day: number | null;
    level: number | null;
    communityId: number | null;
    venueId: number | null;
}

const emptyFilters: ScheduleFilters = {
    day: null,
    level: null,
    communityId: null,
    venueId: null,
};

// Same default as the public schedule filter: today in Jakarta, 1 = Senin ... 7 = Minggu.
const todayDay = (() => {
    const jsDay = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
    ).getDay();
    return jsDay === 0 ? 7 : jsDay;
})();

const initialFilters: ScheduleFilters = { ...emptyFilters, day: todayDay };

export default function ScheduleManager() {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState<ScheduleFilters>(initialFilters);
    const [applied, setApplied] = useState<ScheduleFilters>(initialFilters);
    const [deleting, setDeleting] = useState<AdminSchedule | null>(null);
    const [removing, setRemoving] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const filtersQuery = useMemo(() => {
        const params = new URLSearchParams();
        if (applied.day != null) params.set("day", String(applied.day));
        if (applied.level != null) params.set("level", String(applied.level));
        if (applied.communityId != null) params.set("community", String(applied.communityId));
        if (applied.venueId != null) params.set("venue", String(applied.venueId));
        return params.toString();
    }, [applied]);

    const activeCount = Object.values(applied).filter((v) => v != null).length;

    const paginated = usePaginatedFetch<AdminSchedule>({
        url: "/api/admin/schedules",
        errorMessage: "Gagal memuat jadwal.",
        filtersQuery,
    });

    const { reload } = paginated;

    const applyFilters = useCallback(() => {
        setApplied(draft);
        setOpen(false);
    }, [draft]);

    const resetFilters = useCallback(() => {
        setDraft(initialFilters);
        setApplied(initialFilters);
    }, []);

    const requestDelete = useCallback((schedule: AdminSchedule) => {
        setDeleteError("");
        setDeleting(schedule);
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!deleting) return;
        setRemoving(true);
        setDeleteError("");
        try {
            const response = await fetch(`/api/admin/schedules/${deleting.id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete schedule");
            setDeleting(null);
            reload();
        } catch (e) {
            console.error(e);
            setDeleteError("Gagal menghapus jadwal.");
        } finally {
            setRemoving(false);
        }
    }, [deleting, reload]);

    const fetchCommunities = useCallback(async (search: string) => {
        const params = new URLSearchParams()
        if (search.trim()) params.set("q", search.trim())
        const response = await fetch(`/api/admin/communities/search?${params.toString()}`)
        if (!response.ok) return []
        const data = await response.json()
        if (!Array.isArray(data)) return []
        return data.map((item: CommunityOption) => ({
            label: item.name ?? "-",
            value: item.id,
        }))
    }, [])

    const fetchVenues = useCallback(async (search: string) => {
        const params = new URLSearchParams()
        if (search.trim()) params.set("q", search.trim())
        const response = await fetch(`/api/admin/venues/search?${params.toString()}`)
        if (!response.ok) return []
        const data = await response.json()
        if (!Array.isArray(data)) return []
        return data.map((item: VenueOption) => ({
            label: item.name,
            value: item.id,
        }))
    }, [])

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
                filters={
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger
                            render={
                                <Button variant="outline" className={activeCount > 0 ? "border-primary text-primary" : ""}>
                                    <FilterIcon />
                                    <span>Filter</span>
                                    {activeCount > 0 && <span className="text-xs">({activeCount})</span>}
                                </Button>
                            }
                        />
                        <PopoverContent align="end" className="w-[420px] max-w-[90vw] p-3">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel>Hari</FieldLabel>
                                    <SelectFilter
                                        items={filterDayItems}
                                        value={draft.day}
                                        onValueChange={(value) => setDraft((old) => ({ ...old, day: value }))}
                                        placeholder="Semua hari"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>Level</FieldLabel>
                                    <SelectFilter
                                        items={filterLevelItems}
                                        value={draft.level}
                                        onValueChange={(value) => setDraft((old) => ({ ...old, level: value }))}
                                        placeholder="Semua level"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>Komunitas</FieldLabel>
                                    <AsyncSelectFilter
                                        loadOnOpen
                                        value={draft.communityId}
                                        onValueChange={(value) => setDraft((old) => ({ ...old, communityId: value }))}
                                        placeholder="Semua komunitas"
                                        searchPlaceholder="Cari komunitas..."
                                        fetchItems={fetchCommunities}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel>Lokasi</FieldLabel>
                                    <AsyncSelectFilter
                                        loadOnOpen
                                        value={draft.venueId}
                                        onValueChange={(value) => setDraft((old) => ({ ...old, venueId: value }))}
                                        placeholder="Semua lokasi"
                                        searchPlaceholder="Cari lokasi..."
                                        fetchItems={fetchVenues}
                                    />
                                </Field>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-2">
                                <Button variant="outline" type="button" onClick={resetFilters}>
                                    Reset
                                </Button>
                                <Button type="button" onClick={applyFilters} className="text-white">
                                    Filter
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                }
                dialog={({ open, onOpenChange, editing, onSaved }) => (
                    <ScheduleFormDialog
                        open={open}
                        onOpenChange={onOpenChange}
                        schedule={editing}
                        onSaved={onSaved}
                    />
                )}
            />

            <Dialog
                open={deleting != null}
                onOpenChange={(next) => {
                    if (!next) setDeleting(null);
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Hapus jadwal?</DialogTitle>
                        <DialogDescription>
                            {deleting &&
                                `PB. ${deleting.community?.name ?? "-"} · ${Day[deleting.day - 1] ?? "-"} · ${deleting.time_start.slice(0, 5)} - ${deleting.time_end.slice(0, 5)}`}
                        </DialogDescription>
                    </DialogHeader>

                    {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}

                    <DialogFooter className="mt-4">
                        <DialogClose render={<Button variant="outline" type="button" disabled={removing} />}>
                            Batal
                        </DialogClose>
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={removing}
                            onClick={confirmDelete}
                        >
                            {removing ? "Menghapus..." : "Hapus"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
