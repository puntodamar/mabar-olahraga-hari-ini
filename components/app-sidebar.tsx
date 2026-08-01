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

export function AppSidebar() {
    const loading = useScheduleStore((state) => state.getLoading());
    const init = useScheduleStore((state) => state.getInit());

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
                <Suspense fallback={null}>
                    <ScheduleFilter/>
                </Suspense>
                <h2 className="text-title text-2xl font-bold text-center dark:text-white mb-2 mt-10">
                    {loading || init ? "Mencari Jadwal..." : "Jadwal Hari Ini"}
                </h2>

            </SidebarHeader>

            <SidebarContent className="">
                <ScheduleList/>
            </SidebarContent>
        </Sidebar>
    );
}