// app/api/places/route.ts

import { NextResponse } from "next/server"
import { getVenues } from "@/lib/venue-service"

export async function GET() {
    try {
        const data = await getVenues();
        console.log("Fetched places:", data);
        return NextResponse.json(data);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "failed" }, { status: 500 });
    }
}

