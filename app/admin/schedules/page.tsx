import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getSchedules } from "@/lib/schedule-service";
import {DayLabel} from "@/src/consts/filter";

export default async function JadwalPage() {

    const jsDay = new Date(
        new Date().toLocaleString("en-US", {
            timeZone: "Asia/Jakarta",
        })
    ).getDay();

    const defaultDay = DayLabel[jsDay === 0 ? DayLabel.length - 1 : jsDay - 1]?.value ?? null;

    const schedules = await getSchedules({day: jsDay});
    return (
        <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] p-4 md:p-6">
            <h1 className="text-2xl font-bold text-primary mb-4">Jadwal</h1>
            
            <div className="flex-1 overflow-hidden">
                <DataTable columns={columns} data={schedules} />
            </div>
        </div>
    );
}