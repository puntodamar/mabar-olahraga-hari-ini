import { NextResponse } from "next/server";
import { updateSchedule } from "@/lib/schedule-service";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const payload = await request.json();
        const schedule = await updateSchedule(Number(id), payload);
        return NextResponse.json(schedule);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Gagal memperbarui jadwal" }, { status: 500 });
    }
}
