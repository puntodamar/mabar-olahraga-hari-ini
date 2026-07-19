"use client"

import { useEffect, useState } from "react"

export default function Location() {
    const [location, setLocation] = useState<{
        latitude: number
        longitude: number
    } | null>(null)

    const [error, setError] = useState<string | null>(null)


    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported")
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                })
            },
            (err) => {
                setError(err.message)
            }
        )
    }, [])


    if (error) {
        return <p>{error}</p>
    }

    if (!location) {
        return <p>Getting location...</p>
    }


    return (
        <div>
            <p>
                Latitude: {location.latitude}
            </p>

            <p>
                Longitude: {location.longitude}
            </p>
        </div>
    )
}