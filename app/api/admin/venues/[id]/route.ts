import { NextResponse } from "next/server";
import { updateVenue, deleteVenue } from "@/lib/venue-service";

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
