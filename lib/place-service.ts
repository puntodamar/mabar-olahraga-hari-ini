// lib/place-service.ts

import { unstable_cache } from "next/cache"
import {supabase} from "@/lib/supabase";


export const getVenues = unstable_cache(
    async () => {
        const {data, error} = await supabase.from("venues").select("*");
        if (error) throw error;
        return data;
    },
    ["venues"],
    {
        // revalidate: 60 * 60 * 24,
        revalidate: 1
    }
)

// export async function getPlaces() {
//     const { data, error } = await supabase
//         .from("places")
//         .select("*")
//
//     console.log(data, error)
//
//     return data
// }