import { supabase } from "@/lib/supabase"
export default async function PlaceList() {
    const { data: places, error } = await supabase
        .from("places_with_coords")
        .select("*")

    console.log(places)
    if (error) {
        throw new Error(error.message)
    }

    return (
        <ul>
            {places?.map((place) => (
                <li key={place.id}>
                    <h2>{place.title}</h2>
                    <p>
                        Latitude: {place.latitude}
                    </p>
                    <p>
                        Longitude: {place.longitude}
                    </p>
                </li>
            ))}
        </ul>
    )
}