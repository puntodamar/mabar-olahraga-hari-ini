import { NextResponse } from "next/server";
import { createSchedule, getAdminSchedules } from "@/lib/schedule-service";

export async function GET() {
    try {
        const schedules = await getAdminSchedules();
        return NextResponse.json(schedules);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Gagal memuat jadwal" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const schedule = await createSchedule(payload);
        return NextResponse.json(schedule, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Gagal menyimpan jadwal" }, { status: 500 });
    }
}
