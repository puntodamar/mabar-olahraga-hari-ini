"use client";

import { useCallback, useMemo, useState } from "react";
import { AdminTablePage } from "../admin-table-page";
import { getScheduleColumns } from "./columns";
import ScheduleFormDialog from "./schedule-form-dialog";
import SelectFilter from "@/components/ui/filter/select-filter";
import AsyncSelectFilter from "@/components/ui/filter/async-select-filter";
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

export default function ScheduleManager() {
    const [dayFilter, setDayFilter] = useState<number | null>(null);
    const [levelFilter, setLevelFilter] = useState<number | null>(null);
    const [communityFilter, setCommunityFilter] = useState<number | null>(null);
    const [venueFilter, setVenueFilter] = useState<number | null>(null);

    const filtersQuery = useMemo(() => {
        const params = new URLSearchParams();
        if (dayFilter != null) params.set("day", String(dayFilter));
        if (levelFilter != null) params.set("level", String(levelFilter));
        if (communityFilter != null) params.set("community", String(communityFilter));
        if (venueFilter != null) params.set("venue", String(venueFilter));
        return params.toString();
    }, [dayFilter, levelFilter, communityFilter, venueFilter]);

    const paginated = usePaginatedFetch<AdminSchedule>({
        url: "/api/admin/schedules",
        errorMessage: "Gagal memuat jadwal.",
        filtersQuery,
    });

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
                <>
                    <div className="w-36 overflow-visible">
                        <SelectFilter
                            items={filterDayItems}
                            value={dayFilter}
                            onValueChange={setDayFilter}
                            placeholder="Semua hari"
                        />
                    </div>
                    <div className="w-40 overflow-visible">
                        <SelectFilter
                            items={filterLevelItems}
                            value={levelFilter}
                            onValueChange={setLevelFilter}
                            placeholder="Semua level"
                        />
                    </div>
                    <div className="w-44 overflow-visible">
                        <AsyncSelectFilter
                            loadOnOpen
                            value={communityFilter}
                            onValueChange={setCommunityFilter}
                            placeholder="Semua komunitas"
                            searchPlaceholder="Cari komunitas..."
                            fetchItems={fetchCommunities}
                        />
                    </div>
                    <div className="w-40 overflow-visible">
                        <AsyncSelectFilter
                            loadOnOpen
                            value={venueFilter}
                            onValueChange={setVenueFilter}
                            placeholder="Semua lokasi"
                            searchPlaceholder="Cari lokasi..."
                            fetchItems={fetchVenues}
                        />
                    </div>
                </>
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
