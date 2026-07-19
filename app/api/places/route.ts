// app/api/places/route.ts

import { NextResponse } from "next/server"
import { getPlaces } from "@/lib/place-service"

export async function GET() {
    try {
        const data = await getPlaces();
        console.log("Fetched places:", data);
        return NextResponse.json(data);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "failed" }, { status: 500 });
    }
}