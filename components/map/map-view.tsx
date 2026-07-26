"use client";

import {Map, AdvancedMarker, useMap, useAdvancedMarkerRef} from "@vis.gl/react-google-maps";
import {useEffect, useMemo} from "react";
import { useVenueStore } from "@/src/stores/venue-store";
import {useScheduleStore} from "@/src/stores/schedule-store";
import {DBScheduleList} from "@/src/types/DBScheduleList";
import {DBVenue} from "@/src/types/DBVenue";
import Image from "next/image";
import {toSchedule} from "@/src/mappers/schedule-mapper";

function MapController() {
    const map = useMap();
    const selectedVenue = useVenueStore((s) => s.selectedVenue);

    useEffect(() => {
        if (!map || !selectedVenue) return;

        map.panTo({
            lat: selectedVenue.latitude,
            lng: selectedVenue.longitude,
        });

        // map.setZoom(17);
    }, [map, selectedVenue]);

    return null;
}

export default function MapView() {
    const userLocation = useVenueStore((s) => s.userLocation);
    const schedules = useScheduleStore((s) => s.schedules);
    const setSelectedVenue = useVenueStore((s) => s.setSelectedVenue);
    const selectedVenue = useVenueStore((s) => s.selectedVenue);
    const map = useMap();
    const [markerRef, marker] = useAdvancedMarkerRef();
    const places = useMemo(() => {
        return Object.values(
            schedules.reduce((acc, schedule) => {
                const id = schedule.place.id;

                if (!acc[id]) {
                    acc[id] = {
                        place: schedule.place,
                        schedules: [],
                    };
                }

                acc[id].schedules.push(schedule);

                return acc;
            }, {} as Record<number, {
                place: DBVenue;
                schedules: DBScheduleList[];
            }>)
        );
    }, [schedules]);

    useEffect(() => {
        if (!map || !selectedVenue) return;

        map.panTo({
            lat: selectedVenue.latitude,
            lng: selectedVenue.longitude,
        });

        map.setZoom(17);
    }, [map, selectedVenue]);

    return (
        <Map
            className="h-full w-full"
            defaultCenter={{
                lat: userLocation?.lat || -7.7829174,
                lng: userLocation?.lng || 110.3670608,
            }}
            defaultZoom={14}
            mapId="95551f0836631fd51401ffbd"
            // gestureHandling="auto"
            disableDefaultUI
        >
            {places.map(({ place, schedules }) => (
                <AdvancedMarker
                    key={place.id}
                    ref={markerRef}
                    position={{
                        lat: place.latitude,
                        lng: place.longitude,
                    }}
                    onClick={() => setSelectedVenue(place)}
                >
                    <div className="relative">
                        <div className="flex z-100 flex-row max-w-md items-center gap-x-2 pl-1 pr-4 bg-white rounded-full">
                            <Image
                                src="/images/icons/court.svg"
                                alt={place.name}
                                width={25}
                                height={25}
                                className="object-contain rounded-full border-primary  w-10"
                            />
                            <div className="flex flex-col">
                                <span className="font-semibold text-md line-clamp-1 text-nowrap">{place.name}</span>
                                <span className="text-xs italic">{schedules.length} jadwal</span>
                            </div>
                        </div>

                    </div>
                </AdvancedMarker>
            ))}

            {userLocation && (
                <AdvancedMarker position={userLocation} />
            )}

            <MapController />
        </Map>
    );
}