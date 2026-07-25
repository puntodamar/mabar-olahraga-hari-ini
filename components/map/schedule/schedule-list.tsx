"use client";

import { useEffect, useState } from "react";
import { DBScheduleList } from "@/src/types/DBScheduleList";
import { toSchedule } from "@/src/mappers/schedule_mappers";
import CollapsibleSchedule from "@/components/map/schedule/collapsible-schedule";
import { ScrollArea } from "@/components/ui/scroll-area";
import {SkeletonAvatar} from "@/components/skeleton";

interface ScheduleListProps {
    placeId?: number;
    day?: number;
    level?: number;
}

export default function ScheduleList({placeId, day, level,}: ScheduleListProps) {
    const [schedules, setSchedules] = useState<DBScheduleList[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchSchedules() {
            try {
                setLoading(true);
                setError(null);

                const params = new URLSearchParams();

                if (placeId != null) {
                    params.set("placeId", placeId.toString());
                }

                if (day != null) {
                    params.set("day", day.toString());
                }

                if (level != null) {
                    params.set("level", level.toString());
                }

                const response = await fetch(
                    `/api/schedules?${params.toString()}`,
                    {
                        signal: controller.signal,
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch schedules");
                }

                const data: DBScheduleList[] = await response.json();
                setSchedules(data);
            } catch (e) {
                if (e instanceof DOMException && e.name === "AbortError") {
                    return;
                }

                console.error(e);
                setError("Failed to load schedules.");
            } finally {
                setLoading(false);
            }
        }

        fetchSchedules().then(r => r).catch(e => console.error(e));

        return () => controller.abort();
    }, [placeId, day, level]);

    if (loading) {
        return (
            <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="flex flex-col gap-3 px-3 ">
                    <h2 className="text-title text-2xl font-bold text-center dark:text-white">Mencari Jadwal...</h2>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div className="mt-4" key={i}>
                            <SkeletonAvatar />
                        </div>
                    ))}
                </div>
            </ScrollArea>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-center text-sm text-destructive">
                {error}
            </div>
        );
    }

    if (schedules.length === 0) {
        return (
            <div className="p-4 text-center text-muted-foreground">
                Belum ada jadwal yang tersedia.
            </div>
        );
    }

    return (
        <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="flex flex-col gap-3 px-3 pt-1 md:px-0 lg:pl-4 lg:pr-5">
                {schedules.map((schedule) => (
                    <CollapsibleSchedule key={schedule.id} Schedule={toSchedule(schedule)} />
                ))}
            </div>
        </ScrollArea>
    );
}