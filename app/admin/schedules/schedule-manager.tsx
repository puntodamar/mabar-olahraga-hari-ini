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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function ScheduleManager() {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState<ScheduleFilters>(emptyFilters);
    const [applied, setApplied] = useState<ScheduleFilters>(emptyFilters);

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

    const applyFilters = useCallback(() => {
        setApplied(draft);
        setOpen(false);
    }, [draft]);

    const resetFilters = useCallback(() => {
        setDraft(emptyFilters);
        setApplied(emptyFilters);
    }, []);

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
        <AdminTablePage
            {...paginated}
            onSearchChange={paginated.setSearch}
            columns={getScheduleColumns}
            countLabel={(total) => `${total} jadwal`}
            searchLabel="Cari nama komunitas..."
            loadingLabel="Memuat jadwal..."
            addLabel="Tambah Jadwal"
            emptyMessage="Belum ada jadwal."
            filters={
                <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger
                        render={
                            <Button variant="outline" className={activeCount > 0 ? "border-primary text-primary" : ""}>
                                <FilterIcon />
                                <span>Filter</span>
                                {activeCount > 0 && <span className="text-xs">({activeCount})</span>}
                            </Button>
                        }
                    />
                    <DropdownMenuContent className="w-[420px] max-w-[90vw] p-3">
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
                    </DropdownMenuContent>
                </DropdownMenu>
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
    );
}
