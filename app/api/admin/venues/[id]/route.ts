import { NextResponse } from "next/server";
import { updateVenue, deleteVenue } from "@/lib/venue-service";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function parseLatLngFromUrl(url: string): { lat: number; lng: number } | null {
    try {
        const pair = url.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
        if (pair) return { lat: Number(pair[1]), lng: Number(pair[2]) };
        const at = url.match(/@(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
        if (at) return { lat: Number(at[1]), lng: Number(at[2]) };
        const d3 = url.match(/!3d(-?\d+\.?\d*)/);
        const d4 = url.match(/!4d(-?\d+\.?\d*)/);
        if (d3 && d4) return { lat: Number(d3[1]), lng: Number(d4[1]) };
        const u = new URL(url);
        const q = u.searchParams.get("ll") || u.searchParams.get("query") || u.searchParams.get("q");
        if (q) {
            const m = q.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
            if (m) return { lat: Number(m[1]), lng: Number(m[2]) };
        }
        return null;
    } catch {
        return null;
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const supabaseAdmin = getSupabaseAdmin();

        const name = body.name?.trim();
        const mapUrl = body.map_url || body.location_url || body.maps_url;
        let lat: number | null = null;
        let lng: number | null = null;
        if (mapUrl) {
            const parsed = parseLatLngFromUrl(mapUrl);
            if (parsed) {
                lat = parsed.lat;
                lng = parsed.lng;
            }
        }

        if (name || lat != null) {
            const updatePayload: any = {};
            if (name) updatePayload.name = name;
            if (lat != null && lng != null) updatePayload.location = `SRID=4326;POINT(${lng} ${lat})`;
            const { data, error } = await supabaseAdmin
                .from("venues")
                .update(updatePayload)
                .eq("id", Number(id))
                .select()
                .single();
            if (error) throw error;
            return NextResponse.json(data);
        }

        const venue = await updateVenue(Number(id), body);
        return NextResponse.json(venue);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "failed" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await deleteVenue(Number(id));
        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "failed" }, { status: 500 });
    }
}
