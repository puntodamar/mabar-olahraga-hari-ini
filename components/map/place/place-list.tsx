"use client"

import { useEffect, useState } from "react"

export default function PlaceList() {
    const [places, setPlaces] = useState([])

    useEffect(() => {
        fetch("/api/places")
            .then((res) => res.json())
            .then(setPlaces)
    }, [])

    return (
        <ul>
            {places.map((place: any) => (
                <li key={place.id}>{place.title}</li>
            ))}
        </ul>
    )
}