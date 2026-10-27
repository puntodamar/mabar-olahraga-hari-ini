const escapeLike = (value: string) => value.replace(/[\\%_]/g, "\\$&");

export const getVenues = unstable_cache(
    async () => {
        const {data, error} = await supabase.from("venues").select("*").order("name", { ascending: true });
        if (error) throw error;
        return data;
    },
    ["venues"],
    {
        revalidate: 3600,
        // revalidate: 1
    }
)

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
//     const { data, error } = await supabase
//         .from("places")
//         .select("*")
//
//     console.log(data, error)
//
//     return data
// }