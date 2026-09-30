import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getSchedules } from "@/lib/schedule-service";

export default async function JadwalPage() {
    const schedules = await getSchedules({day: 1});
    return (
        <div>
            <h1 className="text-2xl font-bold text-primary border-b border-primary">Jadwal</h1>
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={schedules} />
            </div>
        </div>
    );
}