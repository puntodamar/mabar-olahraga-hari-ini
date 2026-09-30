"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu, SidebarMenuItem, SidebarFooter
} from "@/components/ui/sidebar";
import Image from "next/image";
import ScheduleList from "@/components/map/schedule/schedule-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import {CalendarRangeIcon, HouseIcon, LogOutIcon, MapPinHouseIcon, UserRoundIcon} from "lucide-react";
import Link from 'next/link';
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar>
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
            <SidebarContent className="m-4">
                <ScrollArea>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Link prefetch={false} href={"/admin/schedules"} className={`flex flex-row gap-x-2 text-base p-2 hover:text-primary hover:bg-primary/10 rounded-md ${pathname === "/admin/schedules" ? "bg-primary/10 text-primary" : ""}`}>
                                <CalendarRangeIcon className="size-5" />
                                <span>Jadwal</span>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Link prefetch={false} href={"/admin/venues"} className={`flex flex-row gap-x-2 text-base p-2 hover:text-primary hover:bg-primary/10 rounded-md ${pathname === "/admin/venues" ? "bg-primary/10 text-primary" : ""}`}>
                                <MapPinHouseIcon className="size-5" />
                                <span>Venue</span>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Link prefetch={false} href={"/admin/communities"} className="flex flex-row gap-x-2 text-base p-2 hover:text-primary hover:bg-primary/10 rounded-md">
                                <UserRoundIcon className="size-5" />
                                <span>Komunitas</span>
                            </Link>
                        </SidebarMenuItem>
                    </SidebarMenu>

                </ScrollArea>
            </SidebarContent>
            <SidebarFooter className="w-full">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link
                            href="/logout"
                            className="flex w-full items-center gap-x-2 px-3 py-2 text-base text-white bg-red-800 hover:bg-red-800 rounded-md transition-colors"
                        >
                            <LogOutIcon className="size-5" />
                            <span>Keluar</span>
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}