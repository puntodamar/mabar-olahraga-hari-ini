import { NextRequest, NextResponse } from "next/server";
import { getSchedules } from "@/lib/schedule-service";

export async function GET(req: NextRequest) {
    const search = req.nextUrl.searchParams;

    const placeId = search.get("placeId");
    const day = search.get("day");
    const level = search.get("level");

    const schedules = await getSchedules({
        placeId: placeId ? Number(placeId) : undefined,
        day: day ? Number(day) : undefined,
        level: level ? Number(level) : undefined,
    });

    return NextResponse.json(schedules);
}