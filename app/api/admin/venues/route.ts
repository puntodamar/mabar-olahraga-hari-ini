import { NextResponse } from "next/server";
import { getAdminVenues, createVenue } from "@/lib/venue-service";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page") ?? "0");
        const pageSizeParam = searchParams.get("pageSize");
        const pageSize = pageSizeParam === null ? undefined : Number(pageSizeParam);
        const search = searchParams.get("search") ?? undefined;
        const result = await getAdminVenues(page, pageSize, search);
        return NextResponse.json(result);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "failed" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const venue = await createVenue(body);
        return NextResponse.json(venue, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "failed" }, { status: 500 });
    }
}
