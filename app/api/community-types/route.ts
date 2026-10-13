import { NextResponse } from "next/server";
import { getCommunityTypes } from "@/lib/community-service";

export async function GET() {
    try {
        const types = await getCommunityTypes();
        return NextResponse.json(types);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Gagal memuat tipe komunitas" }, { status: 500 });
    }
}
