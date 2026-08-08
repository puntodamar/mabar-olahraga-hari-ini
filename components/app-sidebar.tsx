"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import ScheduleList from "@/components/map/schedule/schedule-list";
import {useScheduleStore} from "@/src/stores/schedule-store";
import ScheduleFilter from "@/components/ui/filter/schedule-filter";
import {Suspense} from "react";
import {useSearchParams} from "next/navigation";
import {DayLabel} from "@/src/consts/filter";

export function AppSidebar() {
    const loading = useScheduleStore((state) => state.loading);
    const init = useScheduleStore((state) => state.init);

    const searchParams = useSearchParams();
    const day = searchParams.get("day");

    const dayLabel =
        DayLabel.find((item) => item.value === day)?.label ?? "Hari Ini";

    return (
        <Sidebar className="bg-black">
            <SidebarHeader>
                <Image
                    src="/images/logo-fixed.png"
                    alt="Logo"
                    loading="eager"
                    width={546}
                    height={196}
                    className="h-auto w-40 mx-auto sm:w-25 md:w-64 lg:w-72"
                />
                <div className="text-xs mx-auto text-gray-500">Made by <a href="https://puntodamar.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-blue-400 font-semibold">Punto Damar P.</a></div>
                <Suspense fallback={null}>
                    <ScheduleFilter/>
                </Suspense>
                <h2 className="text-title text-2xl font-bold text-center dark:text-white mb-2 mt-10">
                    {loading || init
                        ? "Mencari Jadwal..."
                        : `Jadwal Hari ${dayLabel}`}
                </h2>

            </SidebarHeader>

            <SidebarContent className="">
                <ScheduleList/>
            </SidebarContent>
        </Sidebar>
    );
}