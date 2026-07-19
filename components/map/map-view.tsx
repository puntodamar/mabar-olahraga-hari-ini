"use client";

import { APIProvider, Map } from "@vis.gl/react-google-maps";

export default function MapView() {
    return (
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
            <Map
                className="h-full w-full"
                style={{ width: "100%", height: "100%" }}
                defaultCenter={{
                    lat: -7.7829174,
                    lng: 110.3670608,
                }}
                defaultZoom={14}
                mapId={"95551f0836631fd51401ffbd"}
                gestureHandling="greedy"
                disableDefaultUI
            />
        </APIProvider>
    );
}

