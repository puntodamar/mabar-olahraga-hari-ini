import { NextResponse } from "next/server";
import { getAdminVenues, createVenue } from "@/lib/venue-service";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

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

function parseLatLngFromUrl(url: string): { lat: number; lng: number } | null {
    try {
        const u = new URL(url);
        if (u.searchParams.get("ll")) {
            const parts = u.searchParams.get("ll")!.split(",");
            const lat = Number(parts[0]);
            const lng = Number(parts[1]);
            if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
        }
        const q = u.searchParams.get("query") || u.searchParams.get("q");
        if (q) {
            const m = q.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
            if (m) return { lat: Number(m[1]), lng: Number(m[2]) };
        }
        const at = url.match(/@(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
        if (at) return { lat: Number(at[1]), lng: Number(at[2]) };
        const d3 = url.match(/!3d(-?\d+\.?\d*)/);
        const d4 = url.match(/!4d(-?\d+\.?\d*)/);
        if (d3 && d4) return { lat: Number(d3[1]), lng: Number(d4[1]) };
        const pair = url.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
        if (pair) return { lat: Number(pair[1]), lng: Number(pair[2]) };
        return null;
    } catch {
        return null;
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const name = body.name?.trim();
        if (!name) {
            return NextResponse.json({ error: "name required" }, { status: 400 });
        }

        let lat: number | null = null;
        let lng: number | null = null;
        if (body.map_url || body.location_url) {
            const parsed = parseLatLngFromUrl(body.map_url || body.location_url);
            if (parsed) {
                lat = parsed.lat;
                lng = parsed.lng;
            }
        }

        const supabaseAdmin = getSupabaseAdmin();
        const { data, error } = await supabaseAdmin
            .from("venues")
            .insert({
                name,
                address: body.address?.trim() || null,
                map_url: body.map_url?.trim() || null,
                location: lat != null && lng != null ? `SRID=4326;POINT(${lng} ${lat})` : null,
            })
            .select()
            .single();

        if (error) {
            console.error(error);
            return NextResponse.json({ error: "failed" }, { status: 500 });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "failed" }, { status: 500 });
    }
}
