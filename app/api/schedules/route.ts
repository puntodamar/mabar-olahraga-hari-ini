import { NextRequest, NextResponse } from "next/server";
import { getSchedules } from "@/lib/schedule-service";
import {DayLabel, GenderLabel, LevelLabel, ScoringLabel} from "@/src/consts/filter";

export async function GET(req: NextRequest) {
    const search = req.nextUrl.searchParams;

    // const placeId = search.get("placeId");
    const day = DayLabel.findIndex((day) => day.value === search.get("day")) + 1;
    const level = LevelLabel.findIndex((level) => level.value === search.get("level"));
    const gender = GenderLabel.findIndex((gender) => gender.value === search.get("gender"));
    const scoring = ScoringLabel.findIndex((scoring) => scoring.value === search.get("scoring"));
    const lat = search.get("lat");
    const lng = search.get("lng");
    const community = search.get("community");
    const venue = search.get("venue");

    const schedules = await getSchedules({
        // placeId: placeId ? Number(placeId) : undefined,
        day: day ? Number(day) : undefined,
        level: level ? Number(level) : undefined,
        lat: lat ? Number(lat) : undefined,
        lng: lng ? Number(lng) : undefined,
        gender: gender ? Number(gender) : undefined,
        scoring: scoring ? Number(scoring) : undefined,
        community: community ? Number(community) : undefined,
        venue: venue ? Number(venue) : undefined,
    });

    return NextResponse.json(schedules);
}