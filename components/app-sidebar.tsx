"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import ScheduleList from "@/components/map/schedule/schedule-list";

export function AppSidebar() {
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
            </SidebarHeader>

            <SidebarContent className="mt-10">
                <ScheduleList/>
            </SidebarContent>
        </Sidebar>
    );
}