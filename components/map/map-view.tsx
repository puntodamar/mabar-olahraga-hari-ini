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

    /**
     * Request the user's location.
     *
     * Use the browser API directly here instead of
     * waiting for the Permissions API to report "granted".
     */
    const handleAllow = () => {
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by this browser.");
            return;
        }

        console.log("Requesting user location...");

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                console.log("Location acquired:", location);
                console.log("Accuracy:", position.coords.accuracy);

                setLastKnownLocation(location);
                setLocationDialogOpen(false);
            },
            (error) => {
                console.error("Geolocation error:", {
                    code: error.code,
                    message: error.message,
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }
        );
    };

    /**
     * Initialize location handling.
     *
     * If permission was already granted, try to get the location.
     * Otherwise show the permission dialog.
     */
    useEffect(() => {
        void listenPermissionChanges();

        async function init() {
            try {
                const permission = await getPermissionState();

                console.log("Initial geolocation permission:", permission);

                if (permission === "granted") {
                    handleAllow();
                } else {
                    setLocationDialogOpen(true);
                }
            } catch (err) {
                console.error("Failed to initialize geolocation:", err);

                setLocationDialogOpen(true);
            }
        }

        void init();
    }, []);

    // close the location dialog if permission is granted
    useEffect(() => {
        if (geolocation === "granted") {
            setLocationDialogOpen(false);
        }
    }, [geolocation]);

    // pan to user location
    useEffect(() => {
        if (!map || !lastKnownLocation || selectedVenue) return;

        map.panTo(lastKnownLocation);
    }, [map, lastKnownLocation, selectedVenue]);

    // pan to selected venue
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