"use client";

import { useEffect, useState } from "react";
import { DBScheduleList } from "@/src/types/DBScheduleList";
import { toSchedule } from "@/src/mappers/schedule-mapper";
import ScheduleCard from "@/components/map/schedule/schedule-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {SkeletonAvatar} from "@/components/skeleton";
import {useScheduleStore} from "@/src/stores/schedule-store";

interface ScheduleListProps {
    placeId?: number;
    day?: number;
    level?: number;
    gender?: number;
    scoring?: number;

}

export default function ScheduleList({placeId, day, level, gender, scoring,}: ScheduleListProps) {
    const [schedules, setSchedules] = useState<DBScheduleList[]>([]);
    const [error, setError] = useState<string | null>(null);

    const setSchedulesStore = useScheduleStore((state) => state.setSchedules);
    const setLoading = useScheduleStore((state) => state.setLoading);
    const loading = useScheduleStore((state) => state.getLoading());
    const init = useScheduleStore((state) => state.getInit());
    const setInit = useScheduleStore((state) => state.setInit);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchSchedules() {
            try {

                setLoading(true);
                setInit();
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

                if (gender != null) {
                    params.set("gender", gender.toString());
                }

                if (scoring != null) {
                    params.set("scoring", scoring.toString());
                }

                const response = await fetch(
                    `/api/schedules?${params.toString()}`,
                    {
                        signal: controller.signal,
                    }
                );

                if (!response.ok) {
                    throw new Error("Gagal memuat database jadwal. Silakan coba beberapa saat lagi.");
                }

                const data: DBScheduleList[] = await response.json();
                setSchedules(data);
                setSchedulesStore(data);
            } catch (e) {
                if (e instanceof DOMException && e.name === "AbortError") {
                    return;
                }

                console.error(e);
                setError("Gagal memuat database jadwal. Silakan coba beberapa saat lagi.");
            } finally {
                setLoading(false);
            }
        }

        fetchSchedules().then(r => r).catch(e => console.error(e));

        return () => controller.abort();
    }, [placeId, day, level, gender, scoring, setSchedulesStore, setLoading, setInit]);



    return (
        <div className="h-[calc(100vh-8rem)]">

            {loading && (
                <ScrollArea className="h-[calc(100vh-8rem)]">
                    <div className="flex flex-col gap-3 px-3">

                        {Array.from({ length: 10 }).map((_, i) => (
                            <div className="mt-4" key={i}>
                                <SkeletonAvatar />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            )}

            {!loading && schedules.length > 0 && (
                <ScrollArea className="h-full">
                    <div className="flex flex-col gap-3 px-3 pt-1 md:px-0 lg:pl-4 lg:pr-5 pb-10">
                        {schedules.map((schedule) => (
                            <ScheduleCard key={schedule.id} Schedule={toSchedule(schedule)} />
                        ))}
                    </div>
                </ScrollArea>
            )}

            {!init && !loading && schedules.length === 0 && (
                <div className="p-4 text-center text-muted-foreground">
                    Belum ada jadwal yang tersedia.
                </div>
            )}

            {error && (
                <div className="p-4 text-center text-sm text-destructive">
                    {error}
                </div>
            )}
        </div>
    );
}