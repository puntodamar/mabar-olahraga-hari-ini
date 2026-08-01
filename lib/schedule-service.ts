import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";
import { DBScheduleList } from "@/src/types/DBScheduleList";
import { GetSchedulesParams } from "@/src/database/params/schedule-params";

export const getSchedules = unstable_cache(
    async ({ placeId, day, level }: GetSchedulesParams = {}) => {
        let query = supabase
            .from("schedule_list")
            .select("*");

        if (placeId != null) {
            query = query.eq("place_id", placeId);
        }

        if (day != null) {
            query = query.eq("day", day);
        }

        if (level != null) {
            query = query.or(`level.is.null,level.lte.${level}`);
        }

        const { data, error } = await query
            .order("time_start")
            .overrideTypes<DBScheduleList[]>();

        if (error) throw error;

        return data;
    },
    ["schedules"],
    {
        revalidate: 1,
        // revalidate: 60 * 60 * 24,
    }
);