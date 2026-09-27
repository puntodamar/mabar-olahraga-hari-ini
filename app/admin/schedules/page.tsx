import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getSchedules } from "@/lib/schedule-service";

export default async function JadwalPage() {
    // Fetching data on the server
    const schedules = await getSchedules({day: 1});
    console.log(schedules);
    return (
        <div>
            <h1 className="text-2xl font-bold text-primary">Jadwal</h1>
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={schedules} />
            </div>
        </div>
    );
}