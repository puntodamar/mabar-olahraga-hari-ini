
import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { GetSchedulesParams } from "@/src/database/params/schedule-params";
import { AdminSchedule, AdminScheduleInput } from "@/src/types/AdminSchedule";

const escapeLike = (value: string) => value.replace(/[\\%_]/g, "\\$&");

export const getSchedules = async ({
                                       day,
                                       level,
                                       lat,
                                       lng,
                                       gender,
                                       scoring,
                                       community,
                                       venue,
                                        time,
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
                p_time: time ? `${time}:00` : null,
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
            String(time ?? "")
        ],
        {
            revalidate: 1,
        }
    );

    return getCachedSchedules();
};

export const getAdminSchedules = async (
    page = 0,
    pageSize?: number,
    search?: string
): Promise<{ data: AdminSchedule[]; total: number }> => {
    let communityIds: number[] | null = null;
    if (search) {
        const { data: matched, error: searchError } = await supabase
            .from("communities")
            .select("id")
            .ilike("name", `%${escapeLike(search)}%`);
        if (searchError) throw searchError;
        communityIds = (matched ?? []).map((row) => row.id);
        if (communityIds.length === 0) {
            return { data: [], total: 0 };
        }
    }

    let query = supabase
        .from("schedules")
        .select(`
            id,
            day,
            time_start,
            time_end,
            fee,
            level,
            gender,
            scoring,
            courts,
            additional_info,
            community:communities ( id, name ),
            place:venues ( id, name )
        `, { count: "exact" })
        .order("day", { ascending: true })
        .order("time_start", { ascending: true });

    if (communityIds) {
        query = query.in("community_id", communityIds);
    }

    if (pageSize !== undefined && Number.isFinite(pageSize)) {
        query = query.range(page * pageSize, (page + 1) * pageSize - 1);
    }

    const { data, count, error } = await query;

    if (error) throw error;

    return { data: (data ?? []) as unknown as AdminSchedule[], total: count ?? 0 };
};

export const createSchedule = async (payload: AdminScheduleInput) => {
    const { data, error } = await getSupabaseAdmin()
        .from("schedules")
        .insert(payload)
        .select()
        .single();

    if (error) throw error;

    return data;
};

export const updateSchedule = async (id: number, payload: AdminScheduleInput) => {
    const { data, error } = await getSupabaseAdmin()
        .from("schedules")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    return data;
};