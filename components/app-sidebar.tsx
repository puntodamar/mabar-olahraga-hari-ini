"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import CollapsibleCommunity from "@/components/map/community/collapsible-community";

export function AppSidebar() {
    return (
        <Sidebar className="bg-black">
            <SidebarHeader>
                <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={546}
                    height={196}
                    className="h-auto w-40 mx-auto sm:w-25 md:w-64 lg:w-72"
                />
            </SidebarHeader>

            <SidebarContent className="mt-10">
               <ScrollArea className="h-[calc(100vh-8rem)] flex flex-col gap-y-4">
                   <div className="flex flex-col gap-3 lg:pl-4 lg:pr-5 pt-1 px-3 md:px-0">
                       <CollapsibleCommunity Community="PB. Harjog" Place="ARARI Badminton dan Tennis " />
                       <CollapsibleCommunity Community="PB. Harjog" Place="ARARI Badminton dan Tennis " />
                       <CollapsibleCommunity Community="PB. Harjog" Place="ARARI Badminton dan Tennis " />
                       <CollapsibleCommunity Community="PB. Harjog" Place="ARARI Badminton dan Tennis " />
                       <CollapsibleCommunity Community="PB. Harjog" Place="ARARI Badminton dan Tennis " />
                       <CollapsibleCommunity Community="PB. Harjog" Place="ARARI Badminton dan Tennis " />
                   </div>
               </ScrollArea>
            </SidebarContent>
        </Sidebar>
    );
}