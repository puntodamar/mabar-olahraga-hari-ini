const escapeLike = (value: string) => value.replace(/[\\%_]/g, "\\$&");

export const getVenues = unstable_cache(
    async (search?: string) => {
        let query = supabase.from("venues").select("*").order("name", { ascending: true });
        if (search && search.trim()) {
            query = query.ilike("name", `%${escapeLike(search.trim())}%`);
        }
        const {data, error} = await query;
        if (error) throw error;
        return data ?? [];
    },
    ["venues"],
    {
        revalidate: 3600,
    }
)

export const getAdminVenues = async (
    page = 0,
    pageSize?: number,
    search?: string
): Promise<{ data: any[]; total: number }> => {
    let query = supabase
        .from("venues")
        .select("*", { count: "exact" })
        .order("name", { ascending: true });

    if (search) {
        query = query.ilike("name", `%${escapeLike(search)}%`);
    }

    if (pageSize !== undefined && Number.isFinite(pageSize)) {
        query = query.range(page * pageSize, (page + 1) * pageSize - 1);
    }

    const { data, count, error } = await query;
    if (error) throw error;
    return { data: data ?? [], total: count ?? 0 };
};

export const searchVenues = async (
    search: string,
    limit = 20
): Promise<{ id: number; name: string }[]> => {
    let query = supabase
        .from("venues")
        .select("id, name")
        .order("name", { ascending: true })
        .limit(limit);

    if (search && search.trim()) {
        query = query.ilike("name", `%${escapeLike(search.trim())}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
};

import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const createVenue = async (payload: any) => {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
        .from("venues")
        .insert(payload)
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const updateVenue = async (id: number, payload: any) => {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
        .from("venues")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
    if (error) throw error;
    return data;
};

export const deleteVenue = async (id: number) => {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
        .from("venues")
        .delete()
        .eq("id", id);
    if (error) throw error;
};
//     const { data, error } = await supabase
//         .from("places")
//         .select("*")
//
//     console.log(data, error)
//
//     return data
// }