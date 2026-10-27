import { NextResponse } from "next/server"
import { getVenues } from "@/lib/venue-service"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") ?? searchParams.get("q") ?? undefined;
        const data = await getVenues(search);
        return NextResponse.json(data);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "failed" }, { status: 500 });
    }
}

