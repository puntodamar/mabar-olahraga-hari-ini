import { NextResponse } from "next/server";
import { createCommunity, getCommunities } from "@/lib/community-service";

export async function GET() {
    try {
        const communities = await getCommunities();
        return NextResponse.json(communities);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Gagal memuat komunitas" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const community = await createCommunity(payload);
        return NextResponse.json(community, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Gagal menyimpan komunitas" }, { status: 500 });
    }
}
