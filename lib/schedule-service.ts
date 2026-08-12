
import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";
import { GetSchedulesParams } from "@/src/database/params/schedule-params";

export const getSchedules = async ({
                                       day,
                                       level,
                                       lat,
                                       lng,
                                       gender,
                                       scoring,
                                       community,
                                       venue,
                                   }: GetSchedulesParams = {}) => {
    const getCachedSchedules = unstable_cache(
        async () => {
            const params = {
                p_lat: lat ?? null,
                p_lng: lng ?? null,
                p_day: day ?? null,
                p_level: level ?? null,
                p_gender: gender ?? null,
                p_scoring: scoring ?? null,
                p_venue_id: venue ?? null,
                p_community_id: community ?? null,
            }

            console.log("Fetching schedules with params:", params);

            const { data, error } = await supabase.rpc("get_schedules", params);

            console.log(data);
            if (error) throw error;

            return data;
        },
        [
            "schedules",
            String(day ?? ""),
            String(level ?? ""),
            String(lat ?? ""),
            String(lng ?? ""),
            String(gender ?? ""),
            String(scoring ?? ""),
            String(community ?? ""),
            String(venue ?? ""),
        ],
        {
            revalidate: 3600,
        }
    );

    return getCachedSchedules();
};