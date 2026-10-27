import { NextResponse } from "next/server";
import { updateVenue, deleteVenue } from "@/lib/venue-service";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const supabaseAdmin = getSupabaseAdmin();

        const name = body.name?.trim();
        if (name) {
            // Try to update via direct update if location not changing
            const updatePayload: any = {};
            if (body.name !== undefined) updatePayload.name = body.name?.trim();
            if (body.map_url !== undefined) updatePayload.map_url = body.map_url?.trim() || null;

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
