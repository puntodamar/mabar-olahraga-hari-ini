import {unstable_cache} from "next/cache";
import {supabase} from "@/lib/supabase";

export const getCommunityOptions = unstable_cache(
    async () => {
        const { data, error } = await supabase
            .from("community_list_options")
            .select("id, name");
        if (error) throw error;
        return data;
    },
    ["community_list_options"],
    {
        // revalidate: 1,
        revalidate: 3600,
    }
);