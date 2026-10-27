import { NextResponse } from "next/server";
import { searchVenues } from "@/lib/venue-service";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const q = searchParams.get("q") ?? searchParams.get("search") ?? "";
        const limitParam = searchParams.get("limit");
        const limit = limitParam === null ? 20 : Number(limitParam);
        const results = await searchVenues(q, Number.isFinite(limit) ? limit : 20);
        return NextResponse.json(results);
    } catch (e) {
        console.error(e);
        return NextResponse.json([], { status: 500 });
    }
}
