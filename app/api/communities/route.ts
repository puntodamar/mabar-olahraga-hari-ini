import {NextResponse} from "next/server";
import {getCommunityOptions} from "@/lib/community-service";

export async function GET() {
   const communities = await getCommunityOptions()
    return NextResponse.json(communities);
}