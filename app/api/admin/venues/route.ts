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
        // @ maps.google.com?ll=lat,lng or ?q=lat,lng or /place/.../@lat,lng,...
        if (u.searchParams.get("ll")) {
            const [lat, lng] = u.searchParams.get("ll")!.split(",").map(Number);
            if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
        }
        if (u.searchParams.get("query")) {
            const q = u.searchParams.get("query")!;
            const m = q.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
            if (m) return { lat: Number(m[1]), lng: Number(m[2]) };
        }
        if (u.searchParams.get("q")) {
            const q = u.searchParams.get("q")!;
            const m = q.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
            if (m) return { lat: Number(m[1]), lng: Number(m[2]) };
        }
        // /@lat,lng,zoom
        const at = u.pathname.match(/@(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
        if (at) return { lat: Number(at[1]), lng: Number(at[2]) };
        // !3dlat!4dlng
        const d3 = url.match(/!3d(-?\d+\.?\d*)/);
        const d4 = url.match(/!4d(-?\d+\.?\d*)/);
        if (d3 && d4) return { lat: Number(d3[1]), lng: Number(d4[1]) };
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
        const { data, error } = await supabaseAdmin.rpc("create_venue", {
            p_name: name,
            p_lat: lat,
            p_lng: lng,
        });

        if (error) {
            console.error(error);
            return NextResponse.json({ error: "failed" }, { status: 500 });
        }

        // If RPC doesn't store map_url/address, try to update
        if ((body.map_url || body.address) && data?.[0]?.id) {
            await supabaseAdmin
                .from("venues")
                .update({
                    address: body.address?.trim() || null,
                    map_url: body.map_url?.trim() || null,
                })
                .eq("id", data[0].id);
        }

        return NextResponse.json(data?.[0] ?? data, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "failed" }, { status: 500 });
    }
}
