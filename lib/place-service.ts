// lib/place-service.ts

import { unstable_cache } from "next/cache"
import {supabase} from "@/lib/supabase";


export const getPlaces = unstable_cache(
    async () => {
        const {data, error} = await supabase.from("places").select("*");
        if (error) throw error;
        return data;
    },
    ["places"],
    {
        revalidate: 60 * 60 * 24,
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