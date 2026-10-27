import { NextResponse } from "next/server";
import { createSchedule, getAdminSchedules } from "@/lib/schedule-service";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page") ?? "0");
        const pageSizeParam = searchParams.get("pageSize");
        const pageSize = pageSizeParam === null ? undefined : Number(pageSizeParam);
        const search = searchParams.get("search") ?? undefined;
        const result = await getAdminSchedules(page, pageSize, search);
        return NextResponse.json(result);
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
