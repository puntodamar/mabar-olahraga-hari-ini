"use client";

import {Suspense, useEffect} from "react";

import { APIProvider } from "@vis.gl/react-google-maps";
import { useSearchParams } from "next/navigation";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import MapView from "@/components/map/map-view";
// import { ThemeModeToggle } from "@/components/ui/theme/theme-mode-toggle";

import { useAppHeight } from "@/hooks/use-mobile";
import { useScheduleStore } from "@/src/stores/schedule-store";
import {useMapStore} from "@/src/stores/map-store";

export default function Home() {
    useAppHeight();

    return (
        <Suspense fallback={null}>
            <HomeContent />
        </Suspense>
    );
}

function HomeContent() {
    const searchParams = useSearchParams();

    const {fetchSchedules} = useScheduleStore();
    const {
        getLastKnownLocation,
        getPermissionState,
        getUserLocation,
        setLastKnownLocation,
    } = useMapStore();

    useEffect(() => {
        async function initSchedules() {
            let location = getLastKnownLocation();

            if (!location) {
                const permission = await getPermissionState();

                if (permission === "granted") {
                    try {
                        location = await getUserLocation();
                        setLastKnownLocation(location);
                    } catch (error) {
                        console.error(error);
                    }
                }
            }

            await fetchSchedules(searchParams.toString(), location);
        }

        void initSchedules();
    }, [
        fetchSchedules,
        searchParams,
        getLastKnownLocation,
        getPermissionState,
        getUserLocation,
        setLastKnownLocation,
    ]);

    return (
        <SidebarProvider>
            <AppSidebar />

            <main className="flex w-full h-screen overflow-hidden">
                <div className="relative flex flex-1 flex-col">
                    <SidebarTrigger className="absolute ml-3 p-3 bg-white size-10 top-2 z-50 lg:hidden" />

                    <div className="flex-1 bg-muted">
                        <APIProvider
                            apiKey={
                                process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
                            }
                        >
                            <Suspense fallback={null}>
                                <MapView />
                            </Suspense>
                        </APIProvider>
                    </div>

                    {/*
                    <div className="pointer-events-none absolute bottom-2 right-2 lg:top-2 lg:left-2 z-50">
                        <div className="pointer-events-auto inline-block">
                            <ThemeModeToggle />
                        </div>
                    </div>
                    */}
                </div>
            </main>
        </SidebarProvider>
    );
}