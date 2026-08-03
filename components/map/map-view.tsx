"use client";

import {Map, AdvancedMarker, useMap, useAdvancedMarkerRef,} from "@vis.gl/react-google-maps";
import {useEffect, useMemo, useState} from "react";
import Image from "next/image";

import {useVenueStore} from "@/src/stores/venue-store";
import {useScheduleStore} from "@/src/stores/schedule-store";
import {usePermissionStore} from "@/src/stores/map-store";

import {DBVenue} from "@/src/types/DBVenue";
import {DBScheduleList} from "@/src/types/DBScheduleList";

import {useSidebar} from "@/components/ui/sidebar";
import {LocationPermissionDialog} from "@/components/ui/dialog/location-permission-dialog";

export default function MapView() {
    const map = useMap();
    const [markerRef] = useAdvancedMarkerRef();

    const schedules = useScheduleStore((s) => s.schedules);
    const {selectedVenue, setSelectedVenue} = useVenueStore();

    const {
        getPermissionState,
        getUserLocation,
        lastKnownLocation,
        setLastKnownLocation,
    } = usePermissionStore();

    const {setOpenMobile} = useSidebar();

    const [openPermissionDialog, setOpenPermissionDialog] = useState(false);

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
                {} as Record<number, { place: DBVenue; schedules: DBScheduleList[]; }>
            )
        );
    }, [schedules]);

    const handleAllow = async () => {
        setOpenPermissionDialog(false);

        try {
            const location = await getUserLocation();
            setLastKnownLocation(location);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        async function init() {
            if (!navigator.geolocation) return;

            const permission = await getPermissionState();

            if (permission === "granted") {
                try {
                    const location = await getUserLocation();
                    setLastKnownLocation(location);
                } catch (err) {
                    console.error(err);
                }
            } else {
                setOpenPermissionDialog(true);
            }
        }

        init();
    }, [getPermissionState, getUserLocation, setLastKnownLocation]);

    // Move map when user location changes
    useEffect(() => {
        if (!map || !lastKnownLocation || selectedVenue) return;

        map.panTo(lastKnownLocation);
    }, [map, lastKnownLocation, selectedVenue]);

    // Move map when venue changes
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
            defaultZoom={14}
            mapId="95551f0836631fd51401ffbd"
            disableDefaultUI
        >
            <LocationPermissionDialog
                open={openPermissionDialog}
                onOpenChange={setOpenPermissionDialog}
                onAllow={handleAllow}
            />

            {places.map(({place, schedules}) => (
                <AdvancedMarker
                    key={place.id}
                    ref={markerRef}
                    position={{
                        lat: place.latitude,
                        lng: place.longitude,
                    }}
                    onClick={() => {
                        setSelectedVenue(place);
                        setOpenMobile(true);
                    }}>
                    <div className="relative">
                        <div
                            className="flex z-100 flex-row max-w-md items-center gap-x-2 pl-1 pr-4 bg-white rounded-full">
                            <Image
                                src="/images/icons/court.svg"
                                alt={place.name}
                                width={25}
                                height={25}
                                className="object-contain rounded-full border-primary w-10"
                            />

                            <div className="flex flex-col">
                                <span className="font-semibold text-xs md:text-md line-clamp-1 text-nowrap">
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
                <AdvancedMarker position={lastKnownLocation}/>
            )}
        </Map>
    );
}