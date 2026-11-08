"use client";

import { useCallback, useState } from "react";
import { FilterIcon } from "lucide-react";
import SelectFilter from "@/components/ui/filter/select-filter";
import AsyncSelectFilter from "@/components/ui/filter/async-select-filter";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Day } from "@/src/types/enums/Day";
import { Level } from "@/src/types/enums/Level";

const dayItems = [
    { label: "Semua", value: null as number | null },
    ...Day.map((label, index) => ({ label, value: index + 1 })),
];

const levelItems = [
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

export interface ScheduleFilters {
    day: number | null;
    level: number | null;
    communityId: number | null;
    venueId: number | null;
}

// Same default as the public schedule filter: today in Jakarta, 1 = Senin ... 7 = Minggu.
const todayInJakarta =
    new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
    ).getDay() || 7;

export const defaultScheduleFilters: ScheduleFilters = {
    day: todayInJakarta,
    level: null,
    communityId: null,
    venueId: null,
};

interface ScheduleFilterProps {
    value: ScheduleFilters;
    onChange: (filters: ScheduleFilters) => void;
}

export default function ScheduleFilter({ value, onChange }: ScheduleFilterProps) {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState(value);

    const activeCount = Object.values(value).filter((v) => v != null).length;

    const apply = () => {
        onChange(draft);
        setOpen(false);
    };

    const reset = () => {
        setDraft(defaultScheduleFilters);
        onChange(defaultScheduleFilters);
    };

    const fetchCommunities = useCallback(async (search: string) => {
        const params = new URLSearchParams();
        if (search.trim()) params.set("q", search.trim());
        const response = await fetch(`/api/admin/communities/search?${params.toString()}`);
        if (!response.ok) return [];
        const data = await response.json();
        if (!Array.isArray(data)) return [];
        return data.map((item: CommunityOption) => ({
            label: item.name ?? "-",
            value: item.id,
        }));
    }, []);

    const fetchVenues = useCallback(async (search: string) => {
        const params = new URLSearchParams();
        if (search.trim()) params.set("q", search.trim());
        const response = await fetch(`/api/admin/venues/search?${params.toString()}`);
        if (!response.ok) return [];
        const data = await response.json();
        if (!Array.isArray(data)) return [];
        return data.map((item: VenueOption) => ({
            label: item.name,
            value: item.id,
        }));
    }, []);

    return (
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
                            items={dayItems}
                            value={draft.day}
                            onValueChange={(day) => setDraft((old) => ({ ...old, day }))}
                            placeholder="Semua hari"
                        />
                    </Field>
                    <Field>
                        <FieldLabel>Level</FieldLabel>
                        <SelectFilter
                            items={levelItems}
                            value={draft.level}
                            onValueChange={(level) => setDraft((old) => ({ ...old, level }))}
                            placeholder="Semua level"
                        />
                    </Field>
                    <Field>
                        <FieldLabel>Komunitas</FieldLabel>
                        <AsyncSelectFilter
                            loadOnOpen
                            value={draft.communityId}
                            onValueChange={(communityId) => setDraft((old) => ({ ...old, communityId }))}
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
                            onValueChange={(venueId) => setDraft((old) => ({ ...old, venueId }))}
                            placeholder="Semua lokasi"
                            searchPlaceholder="Cari lokasi..."
                            fetchItems={fetchVenues}
                        />
                    </Field>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button variant="outline" type="button" onClick={reset}>
                        Reset
                    </Button>
                    <Button type="button" onClick={apply} className="text-white">
                        Filter
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
