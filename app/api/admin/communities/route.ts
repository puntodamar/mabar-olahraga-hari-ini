import { NextResponse } from "next/server";
import { createCommunity, getCommunities } from "@/lib/community-service";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number(searchParams.get("page") ?? "0");
        const pageSizeParam = searchParams.get("pageSize");
        const pageSize = pageSizeParam === null ? undefined : Number(pageSizeParam);
        const result = await getCommunities(page, pageSize);
        return NextResponse.json(result);
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
