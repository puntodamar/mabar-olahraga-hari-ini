
"use client";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import SelectFilter from "@/components/ui/filter/select-filter";
import {
    CommunityLabel,
    DayLabel,
    GenderLabel,
    LevelLabel,
    ScoringLabel,
} from "@/src/consts/filter";
import { ListFilter, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCommunityStore } from "@/src/stores/community-store";
import { useScheduleStore } from "@/src/stores/schedule-store";
import { useEffect, useMemo, useState } from "react";
import { useVenueStore } from "@/src/stores/venue-store";

export default function ScheduleFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const communities = useCommunityStore((state) => state.communities);
    const setCommunities = useCommunityStore((state) => state.setCommunities);

    const schedules = useScheduleStore((state) => state.schedules);

    const venues = useVenueStore((state) => state.venues);
    const setVenues = useVenueStore((state) => state.setVenues);

    const [filterOpen, setFilterOpen] = useState(true);

    const jsDay = new Date(
        new Date().toLocaleString("en-US", {
            timeZone: "Asia/Jakarta",
        })
    ).getDay();

    const defaultDay =
        DayLabel[jsDay === 0 ? DayLabel.length - 1 : jsDay - 1]?.value ?? null;

    const [day, setDay] = useState<string | null>(
        searchParams.get("day") ?? defaultDay
    );

    const [level, setLevel] = useState<string | null>(
        searchParams.get("level")
    );

    const [gender, setGender] = useState<string | null>(
        searchParams.get("gender")
    );

    const [scoring, setScoring] = useState<string | null>(
        searchParams.get("scoring")
    );

    const [communityType, setCommunityType] = useState<string | null>(
        searchParams.get("communityType")
    );

    const [community, setCommunity] = useState<string | null>(
        searchParams.get("community")
    );

    const [venue, setVenue] = useState<string | null>(
        searchParams.get("venue")
    );

    useEffect(() => {
        fetch("/api/communities")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(
                        `Error fetching communities: ${res.status} ${res.statusText}`
                    );
                }

                return res.json();
            })
            .then((data) => setCommunities(data));
    }, [setCommunities]);

    useEffect(() => {
        fetch("/api/venues")
            .then((res) => {
                if (!res.ok) {
                    throw new Error(
                        `Error fetching venues: ${res.status} ${res.statusText}`
                    );
                }

                return res.json();
            })
            .then((data) => setVenues(data));
    }, [setVenues]);

    useEffect(() => {
        if (schedules.length > 0) {
            setFilterOpen(false);
        }
    }, [schedules]);

    const communityNameOptions = useMemo(() => {
        const filtered = communityType
            ? communities.filter(
                (community) =>
                    community.type?.type === communityType
            )
            : communities;

        return [
            { label: "Semua", value: null },
            ...filtered.map((community) => ({
                label: community.name,
                value: community.id.toString(),
            })),
        ];
    }, [communities, communityType]);

    const venueNameOptions = useMemo(() => {
        return [
            { label: "Semua", value: null },
            ...(venues?.map((venue) => ({
                label: venue.name,
                value: venue.id.toString(),
            })) ?? []),
        ];
    }, [venues]);

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (day) params.set("day", day);
        if (level) params.set("level", level);
        if (gender) params.set("gender", gender);
        if (scoring) params.set("scoring", scoring);
        if (communityType) params.set("communityType", communityType);
        if (community) params.set("community", community);
        if (venue) params.set("venue", venue);

        const query = params.toString();

        router.replace(
            query ? `${pathname}?${query}` : pathname,
            {
                scroll: false,
            }
        );
    };

    useEffect(() => {
        // Don't automatically query if filters are already
        // present in the URL.
        if (searchParams.toString()) {
            return;
        }

        if (!navigator.geolocation) {
            handleSearch();
            return;
        }

        navigator.geolocation.getCurrentPosition(
            () => {
                // Location has been successfully obtained.
                // Trigger the initial query.
                handleSearch();
            },
            () => {
                // Permission denied / location unavailable.
                // Still perform the initial query.
                handleSearch();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000,
            }
        );
    }, []);

    return (
        <Collapsible
            open={filterOpen}
            onOpenChange={setFilterOpen}
            className="mx-auto mt-5 w-full px-4"
        >
            <div className="flex justify-center">
                <CollapsibleTrigger className="inline-flex items-center rounded-sm bg-primary px-3 py-2 text-white hover:cursor-pointer">
                    <ListFilter className="mr-2 h-4 w-4" />
                    <span className="text-xs">Filter</span>
                </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="mt-2 flex w-full flex-col gap-y-2 rounded-md border p-4">
                <div className="flex items-center gap-x-2">
                    <span className="w-25 text-title text-sm">
                        Hari
                    </span>

                    <SelectFilter
                        items={DayLabel}
                        value={day}
                        onValueChange={setDay}
                    />
                </div>

                <div className="flex items-center gap-x-2">
                    <span className="w-25 text-title text-sm">
                        Min. Level
                    </span>

                    <SelectFilter
                        items={LevelLabel}
                        value={level}
                        onValueChange={setLevel}
                    />
                </div>

                <div className="flex items-center gap-x-2">
                    <span className="w-25 text-title text-sm">
                        Gender
                    </span>

                    <SelectFilter
                        items={GenderLabel}
                        value={gender}
                        onValueChange={setGender}
                    />
                </div>

                <div className="flex items-center gap-x-2">
                    <span className="w-25 text-title text-sm">
                        Aturan Main
                    </span>

                    <SelectFilter
                        items={ScoringLabel}
                        value={scoring}
                        onValueChange={setScoring}
                    />
                </div>

                <div className="flex items-center gap-x-2">
                    <span className="w-25 text-title text-sm">
                        Jenis Komunitas
                    </span>

                    <SelectFilter
                        items={CommunityLabel}
                        value={"badminton"}
                        onValueChange={(value) => {
                            setCommunityType(value);
                            setCommunity(null);
                        }}
                    />
                </div>

                <div className="flex items-center gap-x-2">
                    <span className="w-25 text-title text-sm">
                        Komunitas
                    </span>

                    <SelectFilter
                        items={communityNameOptions}
                        value={community}
                        onValueChange={setCommunity}
                    />
                </div>

                <div className="flex items-center gap-x-2">
                    <span className="w-25 text-title text-sm">
                        Lokasi
                    </span>

                    <SelectFilter
                        items={venueNameOptions}
                        value={venue}
                        onValueChange={setVenue}
                    />
                </div>

                <Button
                    size="sm"
                    className="mx-auto mt-2 w-full text-white hover:cursor-pointer"
                    onClick={handleSearch}
                >
                    <Search className="mr-2 h-4 w-4" />
                    Cari
                </Button>
            </CollapsibleContent>
        </Collapsible>
    );
}

