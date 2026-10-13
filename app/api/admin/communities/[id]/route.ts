import { NextResponse } from "next/server";
import { updateCommunity } from "@/lib/community-service";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const payload = await request.json();
        const community = await updateCommunity(Number(id), payload);
        return NextResponse.json(community);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Gagal memperbarui komunitas" }, { status: 500 });
    }
}
