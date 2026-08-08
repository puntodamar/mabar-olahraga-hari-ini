import {unstable_cache} from "next/cache";
import {supabase} from "@/lib/supabase";
import {GetSchedulesParams} from "@/src/database/params/schedule-params";


export const getSchedules = unstable_cache(
    async ({ day, level, lat, lng, gender, scoring, community, venue }: GetSchedulesParams = {}) => {

        const { data, error } = await supabase.rpc("get_schedules", {
            p_lat: lat,
            p_lng: lng,
            p_day: day,
            p_level: level,
            p_gender: gender,
            p_scoring: scoring,
            p_venue_id: venue,
            p_community_id: community,
            // p_venue_id: venue,
        });

        if (error) throw error;

        return data;
    },
    ["schedules"],
    {
        revalidate: 3600,
        // revalidate: 60 * 60 * 24,
    }
);