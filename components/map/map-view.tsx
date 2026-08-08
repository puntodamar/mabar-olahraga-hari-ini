"use client";

import { Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import { useVenueStore } from "@/src/stores/venue-store";
import { useScheduleStore } from "@/src/stores/schedule-store";
import { useMapStore } from "@/src/stores/map-store";

import { DBVenue } from "@/src/types/DBVenue";
import { DBScheduleList } from "@/src/types/DBScheduleList";

import { useSidebar } from "@/components/ui/sidebar";
import { LocationPermissionDialog } from "@/components/ui/dialog/location-permission-dialog";

export default function MapView() {
    const map = useMap();

    const { schedules } = useScheduleStore();
    const { selectedVenue, setSelectedVenue } = useVenueStore();

    const {
        geolocation,
        getPermissionState,
        getUserLocation,
        lastKnownLocation,
        setLastKnownLocation,
        listenPermissionChanges,
    } = useMapStore();

    const [locationDialogOpen, setLocationDialogOpen] = useState(false);

    const { setOpenMobile } = useSidebar();

    // Custom map marker
    // Show only one marker per place, with all schedules for that place
    const places = useMemo(() => {
        return Object.values(
            schedules.reduce(
                (acc, schedule) => {
                    const id = schedule.place.id;

                    if (!acc[id]) {
                        acc[id] = {
                            place: schedule.place,
                            schedules: [],
                        };
                    }

                    acc[id].schedules.push(schedule);

                    return acc;
                },
                {} as Record<
                    number,
                    {
                        place: DBVenue;
                        schedules: DBScheduleList[];
                    }
                >
            )
        );
    }, [schedules]);

    const handleAllow = async () => {
        try {
            const location = await getUserLocation();
            setLastKnownLocation(location);
        } catch (err) {
            console.error(err);
        }
    };

    // Register permission listener once
    useEffect(() => {
        void listenPermissionChanges();

        async function init() {
            const permission = await getPermissionState();

            if (permission === "granted") {
                try {
                    const location = await getUserLocation();
                    setLastKnownLocation(location);
                } catch (err) {
                    console.error(err);
                }
            } else {
                setLocationDialogOpen(true);
            }
        }

        void init();
    }, []);

    // React to permission changes
    useEffect(() => {
        if (geolocation !== "granted") return;

        setLocationDialogOpen(false);

        async function loadLocation() {
            try {
                const location = await getUserLocation();
                setLastKnownLocation(location);
            } catch (err) {
                console.error(err);
            }
        }

        void loadLocation();
    }, [geolocation]);

    // Pan to user location
    useEffect(() => {
        if (!map || !lastKnownLocation || selectedVenue) return;

        map.panTo(lastKnownLocation);
    }, [map, lastKnownLocation, selectedVenue]);

    // Pan to selected venue
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
            defaultCenter={
                lastKnownLocation ?? {
                    lat: -7.7829174,
                    lng: 110.3670608,
                }
            }
            gestureHandling="greedy"
            defaultZoom={14}
            mapId="95551f0836631fd51401ffbd"
            disableDefaultUI
        >
            <LocationPermissionDialog
                open={locationDialogOpen}
                onOpenChange={setLocationDialogOpen}
                onAllow={handleAllow}
            />

            {places.map(({ place, schedules }) => (
                <AdvancedMarker
                    key={place.id}
                    position={{
                        lat: place.latitude,
                        lng: place.longitude,
                    }}
                    onClick={() => {
                        setSelectedVenue(place);
                        setOpenMobile(true);
                    }}
                >
                    <div className="relative">
                        <div className="z-100 flex max-w-md flex-row items-center gap-x-2 rounded-full bg-white pl-1 pr-4">
                            <Image
                                src="/images/icons/court.svg"
                                alt={place.name}
                                width={25}
                                height={25}
                                className="w-10 rounded-full border-primary object-contain"
                            />

                            <div className="flex flex-col">
                                <span className="line-clamp-1 text-nowrap text-xs font-semibold md:text-md">
                                    {place.name}
                                </span>

                                <span className="text-xs italic">
                                    {schedules.length} jadwal
                                </span>
                            </div>
                        </div>
                    </div>
                </AdvancedMarker>
            ))}

            {lastKnownLocation && (
                <AdvancedMarker position={lastKnownLocation} />
            )}
        </Map>
    );
}