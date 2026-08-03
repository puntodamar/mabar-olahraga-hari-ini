"use client";

import { toSchedule } from "@/src/mappers/schedule-mapper";
import ScheduleCard from "@/components/map/schedule/schedule-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {SkeletonAvatar} from "@/components/skeleton";
import {useScheduleStore} from "@/src/stores/schedule-store";

export default function ScheduleList() {

    const loading = useScheduleStore((state) => state.loading);
    const schedules = useScheduleStore((state) => state.schedules);
    const init = useScheduleStore((state) => state.init);
    // const error = useScheduleStore((state) => state.error);

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

            {/*{error && (*/}
            {/*    <div className="p-4 text-center text-sm text-destructive">*/}
            {/*        {error}*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
}