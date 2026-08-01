"use client";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import SelectFilter from "@/components/ui/filter/select-filter";
import {
    CourtLabel,
    DayLabel,
    GenderLabel,
    LevelLabel,
    ScoringLabel,
} from "@/src/consts/filter";
import { ListFilter, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ScheduleFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const today = new Date().getDay();
    const day = searchParams.get("day") ?? String(today);

    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());

        if (!value) {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        router.replace(`${pathname}?${params.toString()}`, {
            scroll: false,
        });
    };


    return (
        <Collapsible className="mx-auto mt-5 w-full px-4">
            <div className="flex justify-center">
                <CollapsibleTrigger className="inline-flex items-center rounded-sm bg-primary px-3 py-2 text-white hover:cursor-pointer">
                    <ListFilter className="mr-2 h-4 w-4" />
                    <span className="text-xs">Filter</span>
                </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="mt-2 flex w-full flex-col gap-y-2 rounded-md border p-4">
                <div className="flex items-center gap-x-2">
                    <span className="w-25 text-title">Hari</span>
                    <SelectFilter
                        items={DayLabel}
                        value={day}
                        onValueChange={(value) => updateFilter("day", value)}
                    />
                </div>

                <div className="flex items-center gap-x-2">
                    <span className="w-25 text-title">Level</span>
                    <SelectFilter
                        items={LevelLabel}
                        value={searchParams.get("level")}
                        onValueChange={(value) => updateFilter("level", value)}
                    />
                </div>

                <div className="flex items-center gap-x-2">
                    <span className="w-25 text-title">Gender</span>
                    <SelectFilter
                        items={GenderLabel}
                        value={searchParams.get("gender")}
                        onValueChange={(value) => updateFilter("gender", value)}
                    />
                </div>

                <div className="flex items-center gap-x-2">
                    <span className="w-25 text-title">Aturan Main</span>
                    <SelectFilter
                        items={ScoringLabel}
                        value={searchParams.get("scoring")}
                        onValueChange={(value) => updateFilter("scoring", value)}
                    />
                </div>

                <Button size="sm" className="mx-auto mt-2 w-full text-white hover:cursor-pointer">
                    <Search className="mr-2 h-4 w-4" />
                    Cari
                </Button>
            </CollapsibleContent>
        </Collapsible>
    );
}