"use client";

import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/app-sidebar";
import {ThemeModeToggle} from "@/components/ui/theme/theme-mode-toggle";
import MapView from "@/components/map/map-view";
import {APIProvider} from "@vis.gl/react-google-maps";
import { useVenueStore } from "@/src/stores/venue-store";
import {useEffect} from "react";

export default function Home() {
    const setUserLocation = useVenueStore(
        (state) => state.setUserLocation
    );

    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                setUserLocation({
                    lat: coords.latitude,
                    lng: coords.longitude,
                });
            },
            (err) => {
                console.error(err);
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 5 * 60 * 1000,
            }
        );
    }, [setUserLocation]);

    return (
        <SidebarProvider>
            <AppSidebar  />
            <main className="flex w-full h-screen overflow-hidden">
                <div className="relative flex flex-1 flex-col">
                    <SidebarTrigger className="absolute top-2 z-50 lg:hidden " />
                    <div className="flex-1 bg-muted ">
                        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
                            <MapView/>
                        </APIProvider>
                    </div>

                    <div className="pointer-events-none absolute bottom-2 right-2 lg:top-2 lg:left-2 z-50">
                        <div className="pointer-events-auto inline-block">
                            <ThemeModeToggle />
                        </div>
                    </div>
                </div>
            </main>
        </SidebarProvider>
    );
}