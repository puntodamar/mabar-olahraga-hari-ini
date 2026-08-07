import {unstable_cache} from "next/cache";
import {supabase} from "@/lib/supabase";
import {GetSchedulesParams} from "@/src/database/params/schedule-params";


export const getSchedules = unstable_cache(
    async ({ placeId, day, level, lat, lng, gender, scoring }: GetSchedulesParams = {}) => {

        if (day == null) {
            const today = new Date().getDay();
            day = today === 0 ? 7 : today;
        }

        const { data, error } = await supabase.rpc("get_schedules", {
            p_lat: lat,
            p_lng: lng,
            p_day: day,
            p_level: level,
            p_gender: gender,
            p_scoring: scoring,
            p_venue_id: placeId,
        });
        console.log("getSchedules called with params:", { placeId, day, level, lat, lng, gender, scoring });
        console.log(data);

        if (error) throw error;

        return data;
    },
    ["schedules"],
    {
        revalidate: 1,
        // revalidate: 60 * 60 * 24,
    }
);