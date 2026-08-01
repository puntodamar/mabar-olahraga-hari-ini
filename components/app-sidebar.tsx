"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import ScheduleList from "@/components/map/schedule/schedule-list";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {Button} from "@/components/ui/button";
import {ListFilter, Search} from "lucide-react";
import SelectFilter from "@/components/ui/filter/select-filter";
import {DayLabel, GenderLabel, LevelLabel} from "@/src/consts/filter";
import {useState} from "react";

export function AppSidebar() {

    const [selectedDay, setDay] = useState<string | null>(null);
    const [selectedLevel, setLevel] = useState<string | null>(null);
    const [selectedGender, setGender] = useState<string | null>(null);

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

                <Collapsible className="mx-auto w-full px-4 mt-5">
                    <div className="flex justify-center">
                        <CollapsibleTrigger>
                            <Button
                                size="sm"
                                className="text-white hover:cursor-pointer"
                            >
                                <ListFilter className="mr-2 h-4 w-4" />
                                Filter
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent className="flex flex-col gap-y-2 w-full p-4 mt-2 border-1 rounded-md ">
                        <div className="flex flex-row w-full items-center gap-x-2">
                            <span className="w-20 text-title">Hari</span>
                            <SelectFilter items={DayLabel} placeholder="Semua Hari" onValueChange={setDay} />
                        </div>
                        <div className="flex flex-row w-full  items-center gap-x-2">
                            <span className="w-20 text-title">Level</span>
                            <SelectFilter items={LevelLabel} placeholder="Semua Level" onValueChange={setLevel} />
                        </div>
                        <div className="flex flex-row w-full  items-center gap-x-2">
                            <span className="w-20 text-title">Gender</span>
                            <SelectFilter items={GenderLabel} placeholder="Semua Gender" onValueChange={setGender} />
                        </div>
                        {/*<div className="flex flex-row w-full justify-between">*/}
                        {/*    <div className="w-full">*/}
                        {/*        <div className="flex flex-row  items-center gap-x-2">*/}
                        {/*            <span className="text-title">Mulai</span> <TimePicker value={startTime} onChange={setStartTime}/>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*    <div className="w-full">*/}
                        {/*        <div className="flex flex-row w-full  items-center gap-x-2">*/}
                        {/*            <span className="text-title">Berakhir</span> <TimePicker value={endTime} onChange={setEndTime}/>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        <Button
                            size="sm"
                            className="hover:cursor-pointer text-white mx-auto w-full mt-2">
                            <Search data-icon="inline-start "/> <span>Cari</span>
                        </Button>
                    </CollapsibleContent>
                </Collapsible>


                <h2 className="text-title text-2xl font-bold text-center dark:text-white mb-2 mt-10">Jadwal Hari Ini</h2>
            </SidebarHeader>

            <SidebarContent className="">
                <ScheduleList/>
            </SidebarContent>
        </Sidebar>
    );
}